import { MapContainer, TileLayer, GeoJSON, WMSTileLayer } from 'react-leaflet'
import type { Feature } from 'geojson'
import type { PathOptions } from 'leaflet'
import type { GeoJSONCollection, GeoJSONFeature } from '../types'

const INITIAL_CENTER: [number, number] = [19.4205, -99.1935]
const INITIAL_ZOOM = 19
const WMS_URL = import.meta.env.VITE_WMS_URL ?? 'http://localhost:8080/geoserver/demo/wms'

const batchStyle = (feature?: Feature): PathOptions => {
  const props = feature?.properties
  const busy = props?.state === 'busy'
  return {
    color: busy ? '#e74c3c' : '#27ae60',
    weight: 3,
    fill: true,
    fillColor: '#898686',
    fillOpacity: 0.01,
  }
}

interface Props {
  data: GeoJSONCollection | null
  charging: boolean
}

export default function batchMap({ data, charging }: Props) {
  return (
    <div style={{ position: 'relative', height: '600px', width: '100%' }}>
      {charging && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1000,
          background: 'rgba(255,255,255,0.9)', padding: '8px 16px',
          borderRadius: 6, fontWeight: 600, fontSize: 14,
        }}>
          Cargando datos...
        </div>
      )}
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
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

        {data && (
          <GeoJSON
            key={JSON.stringify(data)}
            data={data}
            style={batchStyle}
            onEachFeature={(feature, layer) => {
              const f = feature as unknown as GeoJSONFeature
              const props = f.properties
              const date = props.register_date
                ? new Date(props.register_date).toLocaleDateString('es-MX')
                : '—'
              layer.bindPopup(`
                <strong>${props.name}</strong><br/>
                Estado: <span style="color:${props.state === 'busy' ? '#e74c3c' : '#27ae60'}">
                  ${props.state === 'busy' ? 'Ocupado' : 'Disponible'}
                </span><br/>
                Registro: ${date}
              `)
              layer.on({
                mouseover: (e) => e.target.setStyle({ weight: 5, color: '#2c3e50', fillOpacity: 0.15 }),
                mouseout: (e) => e.target.setStyle(batchStyle(feature)),
              })
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
