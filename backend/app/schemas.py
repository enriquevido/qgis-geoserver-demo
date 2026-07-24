from datetime import date
from typing import Any, Optional

from pydantic import BaseModel


class StatsOut(BaseModel):
    total: int
    ocupados: int
    disponibles: int


class MensajeError(BaseModel):
    detalle: str
    codigo: int
