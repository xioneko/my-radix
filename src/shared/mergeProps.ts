export function mergeProps(source: Record<string, any>, target: Record<string, any>) {
  for (const p in target) {
    const sourceVal = source[p], targetVal = target[p]
    if (sourceVal === undefined) { 
      source[p] = targetVal
      continue
    }
    if (typeof sourceVal === "function" && typeof targetVal === "function") {
      source[p] = mergeEventHandlers(sourceVal, targetVal)
    } else if (p === "style") {
      source[p] = Object.assign(sourceVal, targetVal)
    } else if (p === "className") {
      source[p] += " " + targetVal
    } else {
      source[p] = targetVal // target can override source
    }
  }
  return source
}

export function mergeEventHandlers<E extends React.SyntheticEvent>(
  source: ((event: E) => void) | undefined,
  target: (event: E) => void,
) {
  return source
    ? (event: E) => {
        source(event)
        target(event)
      }
    : target
}

export function composeEventHandlers<E extends React.SyntheticEvent>(
  source: ((event: E) => void) | undefined,
  target: (event: E) => void,
) {
  return (event: E) => {
    source?.(event)
    if (!event.defaultPrevented) {
      target(event)
    }
  }
}
