# qgis-geoserver-demo

Demo de un pipeline geoespacial completo. Simula un registro de tumbas en el Panteón de Dolores (CDMX).

## Propósito

Esta demo sirve para cualquier caso en donde se necesite gestionar objetos (lotes, cultivos, condominios, etc.) sobre un mapa aplicando un pipeline geoespacial

El pipeline completo es el siguiente:

```
QGIS → 
PostGIS → 
GeoServer → 
Backend → 
Frontend
```

## Stack

- **PostgreSQL 16 + PostGIS 3.4**
- **GeoServer 2.24**
- **FastAPI + Python**
- **React + Leaflet**
- **Docker**


## Arranque

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Levantar PostGIS y GeoServer
docker compose up -d

# Publicar la capa en GeoServer (guía en geoserver/guia-publicacion.md)

# 3. Iniciar backend
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000

# 4. Iniciar frontend
cd frontend && npm install && npm run dev
```

Abrir `http://localhost:5173`. API docs en `http://localhost:8000/docs`.


## Conexión local a QGIS

Se debe conectar QGIS directo a PostGIS

- Host: `localhost` | Puerto: `5432` | DB: `gis`
- Usuario: `docker` | Password: `docker`

