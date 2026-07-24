import json
import os
from datetime import date
from typing import Any

import httpx
from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import Lote
from app.schemas import MensajeError, StatsOut

router = APIRouter()

GEOSERVER_URL = os.getenv("GEOSERVER_URL", "http://localhost:8080/geoserver")
WFS_URL = f"{GEOSERVER_URL}/minicatastro/ows"


async def _fetch_wfs(cql_filter: str | None = None) -> dict[str, Any]:
    params: dict[str, str] = {
        "service": "WFS",
        "version": "2.0.0",
        "request": "GetFeature",
        "typeNames": "minicatastro:lotes",
        "outputFormat": "application/json",
        "srsName": "EPSG:4326",
    }
    if cql_filter:
        params["cql_filter"] = cql_filter

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.get(WFS_URL, params=params)
            resp.raise_for_status()
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=503,
                detail=f"No se pudo conectar con GeoServer: {exc}",
            )
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=exc.response.status_code,
                detail=f"GeoServer respondió con error: {exc.response.text[:300]}",
            )
        return resp.json()


@router.get(
    "/lotes",
    summary="Todos los lotes",
    description="Consume el WFS de GeoServer y devuelve todos los lotes como GeoJSON.",
)
async def obtener_lotes() -> dict[str, Any]:
    return await _fetch_wfs()


@router.get(
    "/lotes/disponibles",
    summary="Lotes disponibles",
    description=(
        "Consume el WFS de GeoServer con un filtro CQL (estado='disponible'). "
        "La lógica de negocio (qué significa 'disponible') se aplica en esta "
        "capa, no en GeoServer ni en el frontend."
    ),
)
async def obtener_lotes_disponibles() -> dict[str, Any]:
    return await _fetch_wfs(cql_filter="estado='disponible'")


@router.get(
    "/lotes/stats",
    summary="Estadísticas de lotes",
    description=(
        "Calcula agregaciones directamente sobre PostGIS. "
        "WFS no puede hacer GROUP BY o COUNT, por eso esta consulta "
        "va directo a la base de datos."
    ),
    response_model=StatsOut,
)
async def obtener_stats(db: AsyncSession = Depends(get_db)) -> StatsOut:
    result = await db.execute(
        select(
            func.count().label("total"),
            func.count().filter(Lote.estado == "ocupado").label("ocupados"),
            func.count().filter(Lote.estado == "disponible").label("disponibles"),
        )
    )
    row = result.one()
    return StatsOut(
        total=row.total,
        ocupados=row.ocupados,
        disponibles=row.disponibles,
    )


@router.get(
    "/lotes/{lote_id}",
    summary="Detalle de un lote",
    description=(
        "Obtiene un lote específico por su ID consultando PostGIS directamente. "
        "Devuelve un Feature GeoJSON individual."
    ),
    responses={404: {"model": MensajeError}},
)
async def obtener_lote(
    lote_id: int,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    result = await db.execute(
        select(
            Lote.id,
            Lote.nombre,
            Lote.estado,
            Lote.fecha_registro,
            ST_AsGeoJSON(Lote.geom),
        ).where(Lote.id == lote_id)
    )
    row = result.one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    return {
        "type": "Feature",
        "geometry": json.loads(row[4]),
        "properties": {
            "id": row[0],
            "nombre": row[1],
            "estado": row[2],
            "fecha_registro": (
                row[3].isoformat() if isinstance(row[3], date) else row[3]
            ),
        },
    }
