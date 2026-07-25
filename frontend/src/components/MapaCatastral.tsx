import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from 'react-leaflet'
import type { Feature } from 'geojson'
import type { PathOptions } from 'leaflet'
import type { GeoJSONCollection, GeoJSONFeature } from '../types'

const CENTRO_INICIAL: [number, number] = [19.4205, -99.1935]
const ZOOM_INICIAL = 16
const WMS_URL = import.meta.env.VITE_WMS_URL ?? 'http://localhost:8080/geoserver/demo/wms'

const estiloLote = (feature?: Feature): PathOptions => {
  const props = feature?.properties
  const ocupado = props?.estado === 'ocupado'
  return {
    color: ocupado ? '#e74c3c' : '#27ae60',
    weight: 3,
    fill: true,
    fillColor: '#ffffff',
    fillOpacity: 0.01,
  }
}

interface Props {
  datos: GeoJSONCollection | null
  cargando: boolean
}

export default function MapaCatastral({ datos, cargando }: Props) {
  return (
    <div style={{ position: 'relative', height: '600px', width: '100%' }}>
      {cargando && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1000,
          background: 'rgba(255,255,255,0.9)', padding: '8px 16px',
          borderRadius: 6, fontWeight: 600, fontSize: 14,
        }}>
          Cargando datos...
        </div>
      )}
      <MapContainer
        center={CENTRO_INICIAL}
        zoom={ZOOM_INICIAL}
        maxZoom={20}
        minZoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={19}
          maxZoom={20}
        />

        <WMSTileLayer
          url={WMS_URL}
          layers="demo:lotes"
          format="image/png"
          transparent={true}
          opacity={0.7}
          maxZoom={20}
        />

        {datos && (
          <GeoJSON
            key={JSON.stringify(datos)}
            data={datos}
            style={estiloLote}
            onEachFeature={(feature, layer) => {
              const f = feature as unknown as GeoJSONFeature
              const props = f.properties
              const fecha = props.fecha_registro
                ? new Date(props.fecha_registro).toLocaleDateString('es-MX')
                : '—'
              layer.bindPopup(`
                <strong>${props.nombre}</strong><br/>
                Estado: <span style="color:${props.estado === 'ocupado' ? '#e74c3c' : '#27ae60'}">
                  ${props.estado === 'ocupado' ? 'Ocupado' : 'Disponible'}
                </span><br/>
                Registro: ${fecha}
              `)
              layer.on({
                mouseover: (e) => e.target.setStyle({ weight: 5, color: '#2c3e50', fillOpacity: 0.15 }),
                mouseout: (e) => e.target.setStyle(estiloLote(feature)),
              })
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
