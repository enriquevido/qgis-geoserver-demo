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
            "name": row[1],
            "state": "available" if row[2] == "disponible" else "busy",
            "register_date": (
                row[3].isoformat() if isinstance(row[3], date) else row[3]
            ),
        },
    }


@router.get(
    "/batches",
    summary="List batches",
    description="Returns all batches as GeoJSON, optionally filtered by state.",
)
async def obtener_lotes(
    state: str | None = Query(None, description="Filter by state (available, busy)"),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    stmt = select(
        Lote.id, Lote.nombre, Lote.estado,
        Lote.fecha_registro, ST_AsGeoJSON(Lote.geom),
    )
    if state:
        db_state = "disponible" if state == "available" else "ocupado"
        stmt = stmt.where(Lote.estado == db_state)
    result = await db.execute(stmt)
    return {"type": "FeatureCollection", "features": [_row_to_feature(r) for r in result.all()]}


@router.get(
    "/batches/stats",
    summary="Batch statistics",
    response_model=StatsOut,
)
async def obtener_stats(db: AsyncSession = Depends(get_db)) -> StatsOut:
    result = await db.execute(
        select(
            func.count().label("total"),
            func.count().filter(Lote.estado == "ocupado").label("busy"),
            func.count().filter(Lote.estado == "disponible").label("available"),
        )
    )
    row = result.one()
    return StatsOut(total=row.total, busy=row.busy, available=row.available)


@router.get(
    "/batches/{batch_id}",
    summary="Batch detail",
    responses={404: {"description": "Batch not found"}},
)
async def obtener_lote(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    result = await db.execute(
        select(
            Lote.id, Lote.nombre, Lote.estado,
            Lote.fecha_registro, ST_AsGeoJSON(Lote.geom),
        ).where(Lote.id == batch_id)
    )
    row = result.one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Batch not found")
    return _row_to_feature(row)
