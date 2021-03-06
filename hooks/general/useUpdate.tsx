import { useRef } from 'react'

import { useRecordedEffect } from './useRecordedEffect'

/**
 * like useEffect
 *
 * cost:
 * - 1 `React.useEffect()`
 * - 3 `React.useRef()`
 */
export function useUpdate<T extends any[]>(
  effectFn: (prev: T | undefined[]) => ((...params: any) => void) | void,
  dependencies: T
) {
  const hasInited = useRef(false)
  useRecordedEffect((prev) => {
    if (!hasInited.current) {
      hasInited.current = true
    } else {
      return effectFn(prev)
    }
  }, dependencies)
}
