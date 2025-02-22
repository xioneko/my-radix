import { useState, useLayoutEffect } from "react"

export type BorderBoxSize = {
  width: number
  height: number
}

export function useSize(element: HTMLElement | null): BorderBoxSize | null {
  const [size, setSize] = useState<BorderBoxSize | null>(null)

  useLayoutEffect(() => {
    if (!element) return
    setSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    })
    
    const observer = new ResizeObserver(entries => {
      const borderBox = entries[0]?.borderBoxSize[0]
      if (borderBox) {
        setSize({
          width: borderBox.inlineSize,
          height: borderBox.blockSize,
        })
      }
    })

    observer.observe(element, { box: "border-box" })

    return () => {
      observer.disconnect()
    }
  }, [element])

  return size
}
