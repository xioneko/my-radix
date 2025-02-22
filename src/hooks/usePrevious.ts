import { useMemo, useRef } from "react"

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef({ value, previous: undefined as T | undefined })
  return useMemo(() => {
      ref.current.previous = ref.current.value
      ref.current.value = value
    return ref.current.previous
  }, [value])
}
