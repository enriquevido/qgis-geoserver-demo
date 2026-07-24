import type { FiltroEstado, Stats } from '../types'

interface Props {
  filtro: FiltroEstado
  onChangeFiltro: (f: FiltroEstado) => void
  stats: Stats | null
}

const estiloBoton = (activo: boolean): React.CSSProperties => ({
  padding: '8px 20px',
  border: activo ? '2px solid #2c3e50' : '1px solid #bdc3c7',
  borderRadius: 6,
  background: activo ? '#2c3e50' : '#fff',
  color: activo ? '#fff' : '#2c3e50',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 14,
})

export default function PanelFiltros({ filtro, onChangeFiltro, stats }: Props) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0', flexWrap: 'wrap',
    }}>
      <button
        style={estiloBoton(filtro === 'todos')}
        onClick={() => onChangeFiltro('todos')}
      >
        Todos {stats !== null ? `(${stats.total})` : ''}
      </button>

      <button
        style={estiloBoton(filtro === 'disponibles')}
        onClick={() => onChangeFiltro('disponibles')}
      >
        Disponibles {stats !== null ? `(${stats.disponibles})` : ''}
      </button>

      {stats !== null && (
        <span style={{ marginLeft: 'auto', color: '#7f8c8d', fontSize: 13 }}>
          Ocupados: {stats.ocupados} &middot; Disponibles: {stats.disponibles}
        </span>
      )}
    </div>
  )
}
