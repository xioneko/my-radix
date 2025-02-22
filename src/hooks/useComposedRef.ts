import { useCallback } from "react"

function setRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref !== null && ref !== undefined) {
    ref.current = value
  }
}

export function composeRefs<T>(...refs: React.ForwardedRef<T>[]) {
  return (node: T) => refs.forEach(ref => setRef(ref, node))
}


export function useComposedRef<T>(...refs: React.ForwardedRef<T>[]) {
  return useCallback(composeRefs(...refs), refs)
}