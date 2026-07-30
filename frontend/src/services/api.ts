import type { GeoJSONCollection, Stats } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api'

export async function fetchBatches(state?: 'available' | 'busy'): Promise<GeoJSONCollection> {
  const params = state ? `?state=${state}` : ''
  const res = await fetch(`${API_BASE}/batches${params}`)
  if (!res.ok) throw new Error(`Error fetching batches ${res.statusText}`)
  return res.json()
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/batches/stats`)
  if (!res.ok) throw new Error(`Error fetching stats: ${res.statusText}`)
  return res.json()
}
