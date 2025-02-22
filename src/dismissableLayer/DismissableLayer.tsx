import { useCallbackRef } from "../hooks/useCallbackRef"
import { useComposedRef } from "../hooks/useComposedRef"
import { mergeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { atom, useAtom } from "jotai"
import { forwardRef, useEffect, useRef, useState } from "react"
import { atomFamily } from "jotai/utils"

interface DismissableLayer {
  body: DismissableLayerElement
  isolation: boolean
}

export type DismissReason = "escape" | "pointer" | "focus"

// eslint-disable-next-line no-unused-vars
const dismissableLayers = atomFamily((ownerDocument: Document) => atom<DismissableLayer[]>([])) // low to high

const originalBodyPointerEvents = new WeakMap<Document, string>()

type DismissableLayerElement = React.ElementRef<typeof el.div>
interface DismissableLayerProps extends React.ComponentPropsWithoutRef<typeof el.div> {
  /**
   * set true to make the layer isolated from lower layers
   */
  disableOutsidePointerEvents?: boolean
  /**
   * return `true` to prevent dismiss
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => boolean | void
  /**
   * return `true` to prevent dismiss
   */
  onPointerDownOutside?: (event: PointerEvent) => boolean | void

  /**
   * return `true` to prevent dismiss
   */
  onFocusOutside?: (event: FocusEvent) => boolean | void

  onDismiss?: (reason: DismissReason) => void
}

export const DismissableLayer = forwardRef<DismissableLayerElement, DismissableLayerProps>(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onDismiss,
      ...bodyProps
    } = props

    const [node, setNode] = useState<DismissableLayerElement | null>(null)
    const bodyElementRef = useComposedRef(forwardedRef, setNode)
    const ownerDocument = node?.ownerDocument ?? document
    const [layers, setLayers] = useAtom(dismissableLayers(ownerDocument))

    const handleEscapeKeydown = useCallbackRef(onEscapeKeyDown)
    const handlePointerDownOutside = useCallbackRef(onPointerDownOutside)
    const handleFocusOutside = useCallbackRef(onFocusOutside)

    const isPointerDownInsideBodyRef = useRef(false)
    const isFocusInsideBodyRef = useRef(false)

    useEffect(() => {
      if (node) {
        setLayers([...layers, { body: node, isolation: disableOutsidePointerEvents }])
        return () => {
          setLayers(layers.filter(layer => layer.body !== node))
        }
      }
    }, [node, ownerDocument])

    useEffect(() => {
      const layer = layers.find(layer => layer.body === node)
      if (layer) {
        layer.isolation = disableOutsidePointerEvents
        setLayers([...layers])
      }
    }, [disableOutsidePointerEvents])

    useEffect(() => {
      const handlePointerDown = (event: PointerEvent) => {
        if (!isPointerDownInsideBodyRef.current) {
          if (handlePointerDownOutside(event)) return
          onDismiss?.("pointer")
        }
        isPointerDownInsideBodyRef.current = false
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          if (handleEscapeKeydown(event)) return
          onDismiss?.("escape")
        }
      }

      const handleFocusIn = (event: FocusEvent) => {
        if (!isFocusInsideBodyRef.current) {
          if (handleFocusOutside(event)) return
          onDismiss?.("focus")
        }
      }

      if (disableOutsidePointerEvents && layers.length === 0) {
        originalBodyPointerEvents.set(ownerDocument, ownerDocument.body.style.pointerEvents)
        ownerDocument.body.style.pointerEvents = "none"
      }

      const noIsolationAboveCurrentLayer =
        layers.findLast(layer => layer.body === node || layer.isolation)?.body === node
      if (noIsolationAboveCurrentLayer) {
        if (node) node.style.pointerEvents = "auto"
        window.setTimeout(() => {
          ownerDocument.addEventListener("pointerdown", handlePointerDown)
          ownerDocument.addEventListener("focusin", handleFocusIn)
        })
      }

      const isCurrentLayerOnTop = layers[layers.length - 1]?.body === node
      if (isCurrentLayerOnTop) {
        window.setTimeout(() => {
          ownerDocument.addEventListener("keydown", handleKeyDown, true)
        })
      }

      return () => {
        ownerDocument.removeEventListener("pointerdown", handlePointerDown)
        ownerDocument.removeEventListener("keydown", handleKeyDown, true)
        ownerDocument.removeEventListener("focusin", handleFocusIn)
        if (node) node.style.pointerEvents = ""

        if (disableOutsidePointerEvents && layers.filter(layer => layer.isolation).length === 1) {
          ownerDocument.body.style.pointerEvents =
            originalBodyPointerEvents.get(ownerDocument) ?? ""
        }
      }
    }, [layers])

    return (
      <el.div
        {...bodyProps}
        ref={bodyElementRef}
        onPointerDownCapture={mergeEventHandlers(bodyProps.onPointerDownCapture, () => {
          // it is still possible to trigger pointerdown on the body element even if pointer-events is none
          if (node?.style.pointerEvents === "auto") isPointerDownInsideBodyRef.current = true
        })}
        onFocusCapture={mergeEventHandlers(bodyProps.onFocusCapture, () => {
          isFocusInsideBodyRef.current = true
        })}
        onBlurCapture={mergeEventHandlers(bodyProps.onBlurCapture, () => {
          isFocusInsideBodyRef.current = false
        })}
      />
    )
  },
)

DismissableLayer.displayName = "DismissableLayer"