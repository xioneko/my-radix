// eslint-disable eslint/no-console
import { useEffect, useId } from "react"

const counterRefMap = new Map<string, React.MutableRefObject<number>>()
const getOrCreateCounterRef = (id: string) => {
  if (!counterRefMap.has(id)) {
    counterRefMap.set(id, { current: 0 })
  }
  return counterRefMap.get(id)!
}
let resetTimer: number | undefined

/**
 * Logs the render count of the component
 * @param label label of the render count
 * @param debounceTime debounce time to reset the count, default is 1000ms, set to Infinity to disable reset
 */
/*@__NO_SIDE_EFFECTS__*/
export function useRenderCountEffect(
  label: string = "Rendered",
  debounceTime = 1000,
  ...message: any[]
) {
  const id = useId()
  const countRef = getOrCreateCounterRef(id)
  useEffect(() => {
    if (Number.isFinite(debounceTime)) {
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => {
        console.log("--------------------------------------------------")
        counterRefMap.clear()
        resetTimer = undefined
      }, debounceTime)
    }
    const color = getColorForLabel(label)
    message.length
      ? console.log(
          `%c${label} %c<${id}>%c ${++countRef.current}%c: %c`,
          `color: ${color}`,
          "color: silver",
          "color: white",
          "color: gray",
          "color: currentcolor",
          ...message,
        )
      : console.log(
          `%c${label} %c<${id}>%c ${++countRef.current}`,
          `color: ${color}`,
          "color: silver",
          "color: currentcolor",
        )
  })
}

const labelColorMap: Record<string, string> = {}
const colors = ["#BFECFF", "#CDC1FF", "#FFF6E3", "#FFCCEA", "#C6E7FF", "#D4F6FF", "#FFDDAE"]

function getColorForLabel(label: string): string {
  if (!labelColorMap[label]) {
    const color = colors[Object.keys(labelColorMap).length % colors.length]
    labelColorMap[label] = color
  }
  return labelColorMap[label]
}
