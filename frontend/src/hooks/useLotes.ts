import { useCallback, useEffect, useState } from 'react'
import { fetchBatches } from '../services/api'
import type { stateCharging, stateFilter, GeoJSONCollection } from '../types'

export function useLotes(filter: stateFilter) {
  const [state, setState] = useState<stateCharging<GeoJSONCollection>>({ status: 'loading' })

  const charge = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await fetchBatches(filter === 'all' ? undefined : filter)
      setState({ status: 'success', data })
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }, [filter])

  useEffect(() => { charge() }, [charge])

  return { state, recharge: charge }
}
