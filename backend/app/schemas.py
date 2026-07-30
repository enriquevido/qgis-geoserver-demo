from pydantic import BaseModel


class StatsOut(BaseModel):
    total: int
    busy: int
    available: int
