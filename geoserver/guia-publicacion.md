# Guía de publicación en GeoServer 

Esta guía asume que ya se ejecutó `docker compose up -d` y que PostGIS tiene los datos cargados (init.sql ejecutado automáticamente).

---

## 1. Acceder a GeoServer

Abre http://localhost:8080/geoserver en el navegador.

Usuario: `admin`
Contraseña: `geoserver`

---

## 2. Crear el Workspace `demo`

Un workspace es un namespace OGC. Agrupa capas relacionadas y define el prefijo de las URLs de los servicios.

| Campo | Valor |
|-------|-------|
| Name | `demo` |
| Namespace URI | `http://localhost:8080/geoserver/minicatastro` |

**Pasos:**
1. Click en **Data → Workspaces** (sidebar izquierda)
2. Click en **Add new workspace**
3. Ingresa `demo` como Name
4. Marca **"Default workspace"**
5. Click **Save**

---

## 3. Crear el Store (conexión a PostGIS)

Un store es la configuración de conexión a una fuente de datos. Aquí le decimos a GeoServer cómo conectarse al contenedor `postgis`.

| Campo | Valor |
|-------|-------|
| Workspace | `demo` |
| Data Source Name | `postgis-minicatastro` |
| host | `postgis` |
| port | `5432` |
| database | `gis` |
| schema | `public` |
| user | `docker` |
| passwd | `docker` |

**Pasos:**
1. Click en **Data → Stores**
2. Click en **Add new Store**
3. Click en **PostGIS** (sección Vector Data Sources)
4. En la pestaña **Basic Store Info**:
   - Workspace: selecciona `minicatastro`
   - Data Source Name: `postgis-minicatastro`
5. En **Connection Parameters**:
   - host: `postgis`
   - port: `5432`
   - database: `gis`
   - schema: `public`
   - user: `docker`
   - passwd: `docker`
   - Marca **Expose primary key attributes**
6. Click **Save**

---

## 4. Publicar la capa `lotes`

**Pasos:**
1. Inmediatamente después de guardar el store, GeoServer muestra las tablas disponibles. Click en **Publish** junto a `lotes`.
2. En la pestaña **Data**:
   - **Bounding Boxes**: Click en **Compute from data** y luego **Compute from native bounds**
   - Verifica que aparezcan las coordenadas correctas (~-99.19, 19.42)
   - **SRS**: `EPSG:4326`
   - **Declared SRS**: dejar `EPSG:4326`
3. En la pestaña **Publishing**:
   - **Style**: deja el default (`polygon`) — lo cambiaremos después
   - **WMS Settings**: puedes ajustar el tamaño máximo si quieres
4. Click **Save**

---

## 5. Crear y asignar el estilo SLD

**Subir el SLD a GeoServer:**
1. Click en **Data → Styles**
2. Click en **Add a new style**
3. En **Style**:
   - Name: `lotes_estilo`
   - Workspace: `demo`
   - Format: `SLD` (seleccionado por defecto)
4. En el editor de SLD:
   - Click en **Browse** y selecciona el archivo `geoserver/sld/lotes_estilo.sld` del proyecto
   - O copia y pega el contenido directamente
5. Click en **Validate** (debe mostrar "Style is valid")
6. Click **Save**

**Asignar el estilo a la capa:**
1. Click en **Data → Layers**
2. Click en la capa `demo:lotes`
3. En la pestaña **Publishing**:
   - **Default Style**: selecciona `demo:lotes_estilo`
4. Click **Save**

---

## 6. Verificar en Layer Preview

1. Click en **Data → Layer Preview**
2. Busca `demo:lotes`
3. Click en **OpenLayers** (o en cualquier formato de preview)
4. Deberías ver un pequeño grid de 10 rectángulos:
   - **Verdes** = disponibles (Tumba-A2, A4, B2, B4)
   - **Rojos** = ocupados (Tumba-A1, A3, A5, B1, B3, B5)

Si ves solo un punto, haz zoom (+) hasta nivel 19-20. Las tumbas miden ~4m × 7m, a escalas pequeñas se ven como punto (comportamiento esperado).

---

## 7. Probar los servicios OGC

Una vez publicada la capa, estos endpoints deben funcionar:

### WMS (imagen renderizada)
```
http://localhost:8080/geoserver/demo/wms
  ?service=WMS
  &version=1.1.1
  &request=GetMap
  &layers=demo:lotes
  &bbox=-99.194,19.419,-99.192,19.422
  &width=800
  &height=600
  &srs=EPSG:4326
  &format=image/png
```

### WFS (datos vectoriales — lo usará nuestro backend)
```
http://localhost:8080/geoserver/demo/wfs
  ?service=WFS
  &version=2.0.0
  &request=GetFeature
  &typeNames=demo:lotes
  &outputFormat=application/json
  &srsName=EPSG:4326
```

Este último devuelve GeoJSON — exactamente lo que consumirá el backend FastAPI.
