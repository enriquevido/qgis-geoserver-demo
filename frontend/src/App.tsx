import { useEffect, useState } from 'react'
import BatchesMap from './components/BatchesMap'
import FilterPanels from './components/FilterPanels'
import { fetchStats } from './services/api'
import { useLotes } from './hooks/useLotes'
import type { stateFilter, Stats } from './types'

export default function App() {
  const [filter, setFilter] = useState<stateFilter>('all')
  const [stats, setStats] = useState<Stats | null>(null)
  const [errorStats, setErrorStats] = useState<string | null>(null)

  const { state, recharge } = useLotes(filter)

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((e) => setErrorStats(e instanceof Error ? e.message : 'Error'))
  }, [])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
      <header style={{ padding: '20px 0' }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Mapa de tumbas</h1>
        <p style={{ margin: '4px 0 0', color: '#7f8c8d', fontSize: 14 }}>
          Panteón de Dolores, CDMX &mdash; Demo de pipeline geoespacial
        </p>
      </header>

      <FilterPanels filter={filter} onChangeFilter={setFilter} stats={stats} />

      {errorStats && (
        <div style={{ color: '#e74c3c', fontSize: 13, padding: '6px 0' }}>
          {errorStats}
        </div>
      )}

      {state.status === 'error' ? (
        <div style={{
          padding: 40, textAlign: 'center', color: '#e74c3c',
          background: '#fdf0ef', borderRadius: 8, marginTop: 12,
        }}>
          <strong>Error al cargar datos</strong>
          <p style={{ margin: '8px 0 0', fontSize: 14 }}>{state.message}</p>
          <button onClick={recharge} style={{ marginTop: 12, padding: '8px 20px' }}>
            Reintentar
          </button>
        </div>
      ) : (
        <BatchesMap
          data={state.status === 'success' ? state.data : null}
          charging={state.status === 'loading'}
        />
      )}
    </div>
  )
}
