import { useCallback, useEffect, useState } from 'react'
import { fetchLotes } from '../services/api'
import type { EstadoCarga, FiltroEstado, GeoJSONCollection } from '../types'

export function useLotes(filtro: FiltroEstado) {
  const [estado, setEstado] = useState<EstadoCarga<GeoJSONCollection>>({ status: 'loading' })

  const cargar = useCallback(async () => {
    setEstado({ status: 'loading' })
    try {
      const data = await fetchLotes(filtro === 'todos' ? undefined : filtro)
      setEstado({ status: 'success', data })
    } catch (err) {
      setEstado({
        status: 'error',
        mensaje: err instanceof Error ? err.message : 'Error desconocido',
      })
    }
  }, [filtro])

  useEffect(() => { cargar() }, [cargar])

  return { estado, recargar: cargar }
}
