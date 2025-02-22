// Based on https://github.com/dai-shi/use-context-selector/issues/109#issuecomment-1785147682
import {
  createContext as createContextOrig,
  useContext as useContextOrig,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react"

interface Store<Value> {
  value: Value | null
  subscribe: (listener: () => void) => () => void
  notify: () => void
}

export interface Context<Value> {
  Provider: React.Provider<Value>
  displayName: string
}

export function createContext<Value>(name?: string): Context<Value | null> {
  const context = createContextOrig<Store<Value> | null>(null)
  const ProviderOrig = context.Provider
  ;(context as any).Provider = ({ value, children }: React.ProviderProps<Value | null>) => {
    const storeRef = useRef<Store<Value>>()
    let store = storeRef.current
    if (!store) {
      const listeners = new Set<() => void>()
      store = {
        value,
        subscribe: (listener: () => void) => {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        notify: () => listeners.forEach(listener => listener()),
      }
      storeRef.current = store
    }
    useEffect(() => {
      if (!Object.is(store.value, value)) {
        store.value = value
        store.notify()
      }
    }, [value])
    return <ProviderOrig value={store}>{children}</ProviderOrig>
  }
  context.displayName = name
  return context as any as Context<Value | null>
}

export const useContextSelector = <Value, Selected>(
  context: Context<Value | null>,
  selector: (value: Value | null) => Selected,
): Selected => {
  const store = useContextOrig(context as React.Context<Store<Value> | null>)
  if (!store) throw new Error("useContextSelector must be used inside a provider")
  
  return useSyncExternalStore(store.subscribe, () => selector(store.value))
}

export function useContext<Value>(context: Context<Value | null>): Value | null {
  return useContextSelector(context, value => value)
}
