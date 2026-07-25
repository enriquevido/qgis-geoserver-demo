from pydantic import BaseModel


class StatsOut(BaseModel):
    total: int
    ocupados: int
    disponibles: int
