import json
from datetime import date
from typing import Any

from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException, Query

from app.database import get_db
from app.models import Lote
from app.schemas import StatsOut

router = APIRouter()


def _row_to_feature(row) -> dict[str, Any]:
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


@router.get(
    "/lotes",
    summary="Listar lotes",
    description="Devuelve todos los lotes como GeoJSON, opcionalmente filtrados por estado.",
)
async def obtener_lotes(
    estado: str | None = Query(None, description="Filtrar por estado (disponible, ocupado)"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    stmt = select(
        Lote.id, Lote.nombre, Lote.estado,
        Lote.fecha_registro, ST_AsGeoJSON(Lote.geom),
    )
    if estado:
        stmt = stmt.where(Lote.estado == estado)
    result = await db.execute(stmt)
    return {"type": "FeatureCollection", "features": [_row_to_feature(r) for r in result.all()]}


@router.get(
    "/lotes/stats",
    summary="Estadísticas de lotes",
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
    return StatsOut(total=row.total, ocupados=row.ocupados, disponibles=row.disponibles)


@router.get(
    "/lotes/{lote_id}",
    summary="Detalle de un lote",
    responses={404: {"description": "Lote no encontrado"}},
)
async def obtener_lote(
    lote_id: int,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    result = await db.execute(
        select(
            Lote.id, Lote.nombre, Lote.estado,
            Lote.fecha_registro, ST_AsGeoJSON(Lote.geom),
        ).where(Lote.id == lote_id)
    )
    row = result.one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Lote no encontrado")
    return _row_to_feature(row)
