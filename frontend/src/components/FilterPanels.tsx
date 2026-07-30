import type { stateFilter, Stats } from '../types'

interface Props {
  filter: stateFilter
  onChangeFilter: (f: stateFilter) => void
  stats: Stats | null
}

const buttonStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 20px',
  border: active ? '2px solid #2c3e50' : '1px solid #bdc3c7',
  borderRadius: 6,
  background: active ? '#2c3e50' : '#fff',
  color: active ? '#fff' : '#2c3e50',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 14,
})

export default function PanelFiltros({ filter, onChangeFilter, stats }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', flexWrap: 'wrap',
    }}>
      <button
        style={buttonStyle(filter === 'all')}
        onClick={() => onChangeFilter('all')}
      >
        Todos {stats !== null ? `(${stats.total})` : ''}
      </button>

      <button
        style={buttonStyle(filter === 'available')}
        onClick={() => onChangeFilter('available')}
      >
        Disponibles {stats !== null ? `(${stats.available})` : ''}
      </button>

      <button
        style={buttonStyle(filter === 'busy')}
        onClick={() => onChangeFilter('busy')}
      >
        Ocupados {stats !== null ? `(${stats.busy})` : ''}
      </button>

      {stats !== null && (
        <span style={{ marginLeft: 'auto', color: '#7f8c8d', fontSize: 13 }}>
          Ocupados: {stats.busy} &middot; Disponibles: {stats.available}
        </span>
      )}
    </div>
  )
}
