export interface LoteProperties {
  id: number
  name: string
  state: 'busy' | 'available'
  register_date: string | null
  [key: string]: unknown
}

export interface GeoJSONFeature {
  type: 'Feature'
  geometry: GeoJSON.Geometry
  properties: LoteProperties
}

export interface GeoJSONCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export interface Stats {
  total: number
  busy: number
  available: number
}

export type stateFilter = 'all' | 'available' | 'busy'

export type stateCharging<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }
