import json
from datetime import date
from typing import Any

from geoalchemy2.functions import ST_AsGeoJSON
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import Lote
from app.schemas import MensajeError, StatsOut

router = APIRouter()


@router.get(
    "/lotes",
    summary="Todos los lotes",
    description="Consume PostGIS directamente y devuelve todos los lotes como GeoJSON.",
)
async def obtener_lotes(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(
        select(
            Lote.id,
            Lote.nombre,
            Lote.estado,
            Lote.fecha_registro,
            ST_AsGeoJSON(Lote.geom),
        )
    )
    rows = result.all()
    features = []
    for row in rows:
        features.append({
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
        })
    return {"type": "FeatureCollection", "features": features}


@router.get(
    "/lotes/disponibles",
    summary="Lotes disponibles",
    description="Lotes filtrados por estado='disponible' desde PostGIS.",
)
async def obtener_lotes_disponibles(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(
        select(
            Lote.id,
            Lote.nombre,
            Lote.estado,
            Lote.fecha_registro,
            ST_AsGeoJSON(Lote.geom),
        ).where(Lote.estado == "disponible")
    )
    rows = result.all()
    features = []
    for row in rows:
        features.append({
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
        })
    return {"type": "FeatureCollection", "features": features}


@router.get(
    "/lotes/ocupados",
    summary="Lotes ocupados",
    description="Lotes filtrados por estado='ocupado' desde PostGIS.",
)
async def obtener_lotes_ocupados(db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    result = await db.execute(
        select(
            Lote.id,
            Lote.nombre,
            Lote.estado,
            Lote.fecha_registro,
            ST_AsGeoJSON(Lote.geom),
        ).where(Lote.estado == "ocupado")
    )
    rows = result.all()
    features = []
    for row in rows:
        features.append({
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
        })
    return {"type": "FeatureCollection", "features": features}


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
