from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Lote(Base):
    __tablename__ = "lotes"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    estado = Column(String(20), nullable=False)
    fecha_registro = Column(Date)
    geom = Column(Geometry("POLYGON", srid=4326), nullable=False)
