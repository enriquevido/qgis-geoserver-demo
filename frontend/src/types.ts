export interface LoteProperties {
  id: number
  nombre: string
  estado: 'ocupado' | 'disponible'
  fecha_registro: string | null
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
  ocupados: number
  disponibles: number
}

export type FiltroEstado = 'todos' | 'disponibles' | 'ocupados'

export type EstadoCarga<T> =
  | { status: 'loading' }
  | { status: 'error'; mensaje: string }
  | { status: 'success'; data: T }
