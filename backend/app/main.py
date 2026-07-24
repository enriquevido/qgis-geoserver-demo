from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import lotes

app = FastAPI(
    title="Mini-Catastro API",
    description=(
        "Backend del sistema Mini-Catastro. "
        "Consume WFS de GeoServer y aplica lógica de negocio "
        "(filtros, estadísticas) antes de servir al frontend."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lotes.router, prefix="/api", tags=["Lotes"])
