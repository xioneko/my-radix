import { useCallback } from "react"

type ControllableStateParams<T> = {
  controlled: [T | undefined, ((value: T) => void) | undefined]
  uncontrolled: [T, (value: T) => void]
}

export function useControllableState<T>({
  controlled: [value, onChange],
  uncontrolled: [uncontrolledState, setUncontrolledState],
}: ControllableStateParams<T>) {
  const isControlled = value !== undefined

  const state = isControlled ? value : uncontrolledState
  const setState: React.Dispatch<React.SetStateAction<T>> = useCallback(
    next => {
      const currentVal = state
      const nextVal = next instanceof Function ? next(currentVal) : next
      if (Object.is(nextVal, currentVal)) return
      if (!isControlled) setUncontrolledState(nextVal)
      onChange?.(nextVal)
    },
    [isControlled, state, onChange, setUncontrolledState],
  )

  return [state, setState] as const
}
