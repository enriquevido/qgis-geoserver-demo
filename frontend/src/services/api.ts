import type { GeoJSONCollection, Stats } from '../types'

const API_BASE = 'http://localhost:8000/api'

export async function fetchLotes(): Promise<GeoJSONCollection> {
  const res = await fetch(`${API_BASE}/lotes`)
  if (!res.ok) throw new Error(`Error al obtener lotes: ${res.statusText}`)
  return res.json()
}

export async function fetchLotesDisponibles(): Promise<GeoJSONCollection> {
  const res = await fetch(`${API_BASE}/lotes/disponibles`)
  if (!res.ok) throw new Error(`Error al obtener lotes disponibles: ${res.statusText}`)
  return res.json()
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/lotes/stats`)
  if (!res.ok) throw new Error(`Error al obtener estadísticas: ${res.statusText}`)
  return res.json()
}
