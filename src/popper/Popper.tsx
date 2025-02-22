import { useCallbackRef } from "../hooks/useCallbackRef"
import { useComposedRef } from "../hooks/useComposedRef"
import { useSize } from "../hooks/useSize"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import {
  arrow,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
  type DetectOverflowOptions,
  type Middleware,
  type Placement,
} from "@floating-ui/react-dom"
import type * as React from "react"
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createContext, useContext, useContextSelector } from "use-context-selector"

export const AvailableWidthVar = "--popper-available-width"
export const AvailableHeightVar = "--popper-available-height"
export const AnchorWidthVar = "--popper-anchor-width"
export const AnchorHeightVar = "--popper-anchor-height"
export const TransformOriginVar = "--popper-transform-origin"

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

const PopperScope = createScope("Popper")

export const Popper = createPopper(PopperScope)

export function createPopper(scope: Scope) {
  /* ------------------------------- Popper Root ------------------------------ */

  const PopperRootContext = createContext<PopperRootContextValue | null>(null)
  type PopperRootContextValue = {
    anchor: Measurable | null
    setAnchor: (anchor: Measurable | null) => void
  }
  interface Measurable {
    getBoundingClientRect(): DOMRect
  }
  PopperRootContext.displayName = `PopperRootContext <${scope.description}>`

  interface PopperRootProps {
    children: React.ReactNode
  }

  const PopperRoot = ({ children }: PopperRootProps) => {
    const [anchor, setAnchor] = useState<Measurable | null>(null)
    return (
      <PopperRootContext.Provider
        value={useMemo(
          () => ({
            anchor: anchor,
            setAnchor: setAnchor,
          }),
          [anchor],
        )}
      >
        {children}
      </PopperRootContext.Provider>
    )
  }

  PopperRoot.displayName = `Popper.Root <${scope.description}>`

  /* ------------------------------ Popper Anchor ----------------------------- */

  type PopperAnchorElement = React.ElementRef<typeof el.div>

  type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof el.div> & {
    virtualRef?: React.RefObject<Measurable>
  }

  const PopperAnchor = forwardRef<PopperAnchorElement, PopperAnchorProps>((props, forwardedRef) => {
    const { virtualRef, ...anchorProps } = props
    const ref = useRef<HTMLDivElement | null>(null)
    const composedRef = useComposedRef(forwardedRef, ref)
    const setAnchor = useContextSelector(PopperRootContext, ctx => ctx!.setAnchor)

    useEffect(() => {
      setAnchor(virtualRef?.current ?? ref.current)
    }, [virtualRef])

    return virtualRef ? null : <el.div {...anchorProps} ref={composedRef} />
  })

  PopperAnchor.displayName = `Popper.Anchor <${scope.description}>`

  /* ----------------------------- Popper Content ----------------------------- */

  const PopperContentContext = createContext<PopperContentContextValue | null>(null)
  type PopperContentContextValue = {
    side: Side
    setArrow: (arrow: HTMLElement | null) => void
    arrowX?: number
    arrowY?: number
    shouldHideArrow: boolean
  }
  PopperContentContext.displayName = `PopperContentContext <${scope.description}>`


  interface PopperContentProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    strategy?: "absolute" | "fixed"
    side?: Side
    sideOffset?: number
    align?: Align
    alignOffset?: number
    avoidFlickeringArrow?: boolean
    arrowPadding?: number
    avoidCollisions?: boolean
    collisionBoundary?: Element | Element[] | null
    collisionPadding?: number | Partial<Record<Side, number>>
    sticky?: "partial" | "always"
    hideWhenDetached?: boolean
    updatePositionStrategy?: "optimized" | "always"
    onPlaced?: () => void
  }

  type PopperContentElement = React.ElementRef<typeof el.div>

  const PopperContent = forwardRef<PopperContentElement, PopperContentProps>(
    (props, forwardedRef) => {
      const {
        strategy = "absolute",
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        avoidFlickeringArrow = false,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "always",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props

      const [arrowElem, setArrow] = useState<HTMLElement | null>(null)

      const arrowSize = useSize(arrowElem)
      const arrowWidth = arrowSize?.width ?? 0
      const arrowHeight = arrowSize?.height ?? 0

      const anchor = useContextSelector(PopperRootContext, ctx => ctx!.anchor)

      const collisionPadding =
        typeof collisionPaddingProp === "number"
          ? collisionPaddingProp
          : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp }
      const boundary = Array.isArray(collisionBoundary)
        ? collisionBoundary
        : collisionBoundary
          ? [collisionBoundary]
          : []

      const detectOverflowOptions: DetectOverflowOptions = {
        padding: collisionPadding,
        boundary,
        altBoundary: boundary.length > 0,
      }

      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        strategy,
        placement: align === "center" ? side : `${side}-${align}`,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always",
          })
          return cleanup
        },
        elements: {
          reference: anchor,
        },
        middleware: [
          offset({
            mainAxis: sideOffset + arrowHeight,
            crossAxis: alignOffset,
          }),
          avoidCollisions &&
            shift({
              mainAxis: true,
              crossAxis: false,
              limiter: sticky === "partial" ? limitShift() : undefined,
              ...detectOverflowOptions,
            }),
          avoidCollisions &&
            flip({
              ...detectOverflowOptions,
            }),
          size({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference
              const contentStyle = elements.floating.style
              contentStyle.setProperty(AvailableWidthVar, `${availableWidth}px`)
              contentStyle.setProperty(AvailableHeightVar, `${availableHeight}px`)
              contentStyle.setProperty(AnchorWidthVar, `${anchorWidth}px`)
              contentStyle.setProperty(AnchorHeightVar, `${anchorHeight}px`)
            },
          }),
          (avoidFlickeringArrow || arrowElem) &&
            arrow({
              element: arrowElem,
              padding: arrowPadding,
            }),
          transformOrigin({ arrowHeight, arrowWidth }),
          hideWhenDetached &&
            hide({
              strategy: "referenceHidden",
              ...detectOverflowOptions,
            }),
        ],
      })

      const handlePlaced = useCallbackRef(onPlaced)
      useLayoutEffect(() => {
        if (isPositioned) handlePlaced()
      }, [isPositioned])

      const { side: placedSide } = parsePlacement(placement)
      const arrowX = middlewareData.arrow?.x
      const arrowY = middlewareData.arrow?.y
      const shouldHideArrow = middlewareData.arrow?.centerOffset !== 0
      const arrowCxt = useMemo(
        () => ({
          side: placedSide,
          arrowX,
          arrowY,
          shouldHideArrow,
          setArrow,
        }),
        [placedSide, arrowX, arrowY, shouldHideArrow],
      )

      const [contentZIndex, setContentZIndex] = useState<string>("auto")
      const composedRef = useComposedRef(forwardedRef, node => {
        if (node) setContentZIndex(window.getComputedStyle(node).zIndex)
      })

      return (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            // avoid flickering
            transform:
              isPositioned && (!avoidFlickeringArrow || arrowElem)
                ? floatingStyles.transform
                : "translate(0, -200vw)",
            zIndex: contentZIndex,
            [TransformOriginVar as any]: `${middlewareData.transformOrigin?.x} ${middlewareData.transformOrigin?.y}`,
            ...(middlewareData.hide?.referenceHidden && {
              visibility: "hidden",
              pointerEvents: "none",
            }),
          }}
        >
          <PopperContentContext.Provider value={arrowCxt}>
            <el.div
              data-side={placedSide}
              data-align={align}
              {...contentProps}
              ref={composedRef}
              style={{
                ...contentProps.style,
                animation: !isPositioned ? "none" : undefined,
              }}
            />
          </PopperContentContext.Provider>
        </div>
      )
    },
  )

  PopperContent.displayName = `Popper.Content <${scope.description}>`

  /* ------------------------------ Popper Arrow ------------------------------ */

  const OppositeSide: Record<Side, Side> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }

  type PopperArrowElement = React.ElementRef<typeof el.svg>
  interface PopperArrowProps extends React.ComponentPropsWithoutRef<typeof el.svg> {}

  const PopperArrow = forwardRef<PopperArrowElement, PopperArrowProps>((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props
    const arrowCtx = useContext(PopperContentContext)!
    const popperSide = arrowCtx.side
    const arrowSide = OppositeSide[popperSide]
    const transformOrigin = {
      top: "",
      right: "0 0",
      bottom: "center 0",
      left: "100% 0",
    }[popperSide]
    const transform = {
      top: "translateY(100%)",
      right: "translateY(50%) rotate(90deg) translateX(-50%)",
      bottom: `rotate(180deg)`,
      left: "translateY(50%) rotate(-90deg) translateX(50%)",
    }[popperSide]

    return (
      <span
        ref={arrowCtx.setArrow}
        style={{
          position: "absolute",
          left: arrowCtx.arrowX,
          top: arrowCtx.arrowY,
          [arrowSide]: 0,
          transformOrigin,
          transform,
          visibility: arrowCtx.shouldHideArrow ? "hidden" : undefined,
        }}
      >
        <el.svg
          {...arrowProps}
          style={{
            ...arrowProps.style,
            display: "block",
          }}
          ref={forwardedRef}
          width={width}
          height={height}
          viewBox="0 0 30 10"
          preserveAspectRatio="none"
        >
          {props.asChild ? children : <polygon points="0,0 30,0 15,10" />}
        </el.svg>
      </span>
    )
  })

  PopperArrow.displayName = `Popper.Arrow <${scope.description}>`

  return { Root: PopperRoot, Anchor: PopperAnchor, Content: PopperContent, Arrow: PopperArrow }
}

const transformOrigin = (options: { arrowWidth: number; arrowHeight: number }): Middleware => ({
  name: "transformOrigin",
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0
    const isArrowHidden = cannotCenterArrow

    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight
    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2

    const { side, align } = parsePlacement(placement)
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[align]

    let x, y
    switch (side) {
      case "bottom":
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
        y = `-${arrowHeight}px`
        break
      case "top":
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
        y = `${rects.floating.height + arrowHeight}px`
        break
      case "right":
        x = `-${arrowHeight}px`
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
        break
      case "left":
        x = `${rects.floating.width + arrowHeight}px`
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
        break
    }
    return { data: { x, y } }
  },
})

function parsePlacement(placement: Placement) {
  const [side, align = "center"] = placement.split("-")
  return { side, align } as { side: Side; align: Align }
}
