import { useCallback, useEffect, useRef } from "react"

/**
 * Returns a ref that always points to the latest callback.
 * 
 * @param callback The callback to be stored in a ref.
 * @returns A ref that always points to the latest callback.
 */
export function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined) {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  })
  return useCallback((...args: Parameters<T>): ReturnType<T> => callbackRef.current?.(...args), [])
}
