import type { GeoJSONCollection, Stats } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api'

export async function fetchLotes(estado?: 'disponibles' | 'ocupados'): Promise<GeoJSONCollection> {
  const params = estado ? `?estado=${estado.slice(0, -1)}` : ''
  const res = await fetch(`${API_BASE}/lotes${params}`)
  if (!res.ok) throw new Error(`Error al obtener lotes: ${res.statusText}`)
  return res.json()
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/lotes/stats`)
  if (!res.ok) throw new Error(`Error al obtener estadísticas: ${res.statusText}`)
  return res.json()
}
