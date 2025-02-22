import { createCollection } from "#collection"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { composeEventHandlers, mergeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react"

type Orientation = "horizontal" | "vertical"

const RovingFocusGroupScope = createScope("RovingFocusGroup")

export const RovingFocusGroup = createRovingFocusGroup(RovingFocusGroupScope)

export function createRovingFocusGroup(scope: Scope) {
  const Collection = createCollection<HTMLSpanElement, RovingFocusGroupItemData>(scope)

  /* ---------------------------- RovingFocusGroup ---------------------------- */

  const RovingFocusGroupContext = createContext<RovingFocusGroupContextValue | null>(null)
  type RovingFocusGroupContextValue = {
    loop: boolean
    orientation?: Orientation
    tabStop: HTMLElement | null
    setTabStop: (tabStop: HTMLElement | null) => void
    setFocusableItemCount: React.Dispatch<React.SetStateAction<number>>
    preventScrollOnFocus: boolean
    onItemShiftTab: () => void
  }
  RovingFocusGroupContext.displayName = `RovingFocusGroupContext <${scope.description}>`

  type RovingFocusGroupElement = React.ElementRef<typeof el.div>
  interface RovingFocusGroupProps extends React.ComponentPropsWithRef<typeof el.div> {
    orientation?: Orientation
    tabStop?: HTMLElement | null
    onTabStopChange?: (tabStop: HTMLElement | null) => void
    loop?: boolean
    /**
     * return `true` to prevent auto focus on the first focusable item in the group
     */
    onFocusEnter?: (event: React.FocusEvent) => boolean | void
    preventScrollOnFocus?: boolean
  }

  const RovingFocusGroupRoot = forwardRef<RovingFocusGroupElement, RovingFocusGroupProps>(
    (props, forwardedRef) => {
      return (
        <Collection.Root>
          <RovingFocusGroupInner {...props} ref={forwardedRef} />
        </Collection.Root>
      )
    },
  )

  const RovingFocusGroupInner = forwardRef<RovingFocusGroupElement, RovingFocusGroupProps>(
    (props, forwardedRef) => {
      const {
        orientation,
        loop = false,
        tabStop: tabStopProp,
        onTabStopChange,
        onFocusEnter,
        preventScrollOnFocus = true,
        ...groupProps
      } = props
      const [tabStop, setTabStop] = useControllableState<HTMLElement | null>({
        controlled: [tabStopProp, onTabStopChange],
        uncontrolled: useState<HTMLElement | null>(null),
      })
      const [isTabbingBackOut, setIsTabbingBackOut] = useState(false)
      const [focusableItemCount, setFocusableItemCount] = useState(0)
      const isFocusedByKeyboardRef = useRef(true)
      const getItems = Collection.useCollection()

      return (
        <RovingFocusGroupContext.Provider
          value={useMemo(
            () => ({
              loop,
              orientation,
              tabStop,
              preventScrollOnFocus,
              setTabStop,
              setFocusableItemCount,
              onItemShiftTab: () => setIsTabbingBackOut(true),
            }),
            [loop, orientation, tabStop, setTabStop, preventScrollOnFocus],
          )}
        >
          <el.div
            data-orientation={orientation}
            tabIndex={isTabbingBackOut || focusableItemCount === 0 ? -1 : 0}
            {...groupProps}
            ref={forwardedRef}
            style={{ outline: "none", ...groupProps.style }}
            onMouseDown={mergeEventHandlers(groupProps.onMouseDown, () => {
              isFocusedByKeyboardRef.current = false
            })}
            onFocus={composeEventHandlers(groupProps.onFocus, event => {
              if (
                event.target === event.currentTarget &&
                isFocusedByKeyboardRef.current &&
                !isTabbingBackOut
              ) {
                if (onFocusEnter?.(event)) return
                const items = getItems({ ordered: true }).filter(item => item.focusable)
                const activeItem = items.find(item => item.active)
                const currentItem = items.find(item => item.ref.current === tabStop)
                const candidates = [activeItem, currentItem].filter(isNotNullable).concat(items)
                focusFirst(candidates, preventScrollOnFocus)
              }
              isFocusedByKeyboardRef.current = true
            })}
            onBlur={mergeEventHandlers(groupProps.onBlur, () => setIsTabbingBackOut(false))}
          />
        </RovingFocusGroupContext.Provider>
      )
    },
  )

  RovingFocusGroupRoot.displayName = `RovingFocusGroup.Root <${scope.description}>`

  /* -------------------------- RovingFocusGroupItem -------------------------- */

  interface RovingFocusGroupItemData {
    focusable: boolean
    active: boolean
  }
  type RovingFocusItemElement = React.ElementRef<typeof el.span>
  interface RovingFocusItemProps
    extends React.ComponentPropsWithRef<typeof el.span>,
      Partial<RovingFocusGroupItemData> {}

  const RovingFocusGroupItem = forwardRef<RovingFocusItemElement, RovingFocusItemProps>(
    (props, forwardedRef) => {
      const { focusable = true, active = false, ...itemProps } = props
      const getItems = Collection.useCollection()
      const ctx = useContext(RovingFocusGroupContext)!

      useEffect(() => {
        if (focusable) {
          ctx.setFocusableItemCount(count => count + 1)
          return () => {
            ctx.setFocusableItemCount(count => count - 1)
          }
        }
      }, [focusable])

      // useRenderCountEffect("RovingFocusGroupItem")

      const itemRef = useRef<HTMLElement | null>(null)
      const composedRef = useComposedRef(forwardedRef, itemRef)
      useLayoutEffect(() => {
        itemRef.current!.tabIndex = ctx.tabStop === itemRef.current ? 0 : -1
      }, [ctx.tabStop])

      return (
        <Collection.Item focusable={focusable} active={active}>
          <el.span
            data-orientation={ctx.orientation}
            {...itemProps}
            ref={composedRef}
            onMouseDown={composeEventHandlers(itemProps.onMouseDown, event => {
              if (!focusable) event.preventDefault()
              else ctx.setTabStop(itemRef.current)
            })}
            onFocus={composeEventHandlers(itemProps.onFocus, () => {
              ctx.setTabStop(itemRef.current)
            })}
            onKeyDown={composeEventHandlers(itemProps.onKeyDown, event => {
              if (event.key === "Tab" && event.shiftKey) {
                ctx.onItemShiftTab()
                return
              }
              if (event.target !== event.currentTarget) return
              if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return

              const focusIntent = getFocusIntent(event, ctx.orientation)
              if (focusIntent !== undefined) {
                event.preventDefault()
                const candidates = getItems({ ordered: true }).filter(item => item.focusable)
                if (focusIntent == "last" || focusIntent == "prev") candidates.reverse()
                if (focusIntent === "prev" || focusIntent === "next") {
                  const currentIndex = candidates.findIndex(
                    item => item.ref.current === itemRef.current,
                  )
                  focusFirst(
                    candidates,
                    ctx.preventScrollOnFocus,
                    ctx.loop ? (currentIndex + 1) % candidates.length : currentIndex + 1,
                  )
                } else {
                  focusFirst(candidates, ctx.preventScrollOnFocus)
                }
              }
            })}
          />
        </Collection.Item>
      )
    },
  )

  RovingFocusGroupItem.displayName = `RovingFocusGroup.Item <${scope.description}>`

  /* --------------------------- useRovingFocusGroup -------------------------- */

  function useRovingFocusGroup() {
    return Collection.useCollection()
  }

  return { Root: RovingFocusGroupRoot, Item: RovingFocusGroupItem, useRovingFocusGroup }
}

type FocusIntent = "first" | "last" | "prev" | "next"

// prettier-ignore
const MapKeyToFocusIntent: Record<string, FocusIntent> = {
  ArrowLeft: 'prev', ArrowUp: 'prev',
  ArrowRight: 'next', ArrowDown: 'next',
  PageUp: 'first', Home: 'first',
  PageDown: 'last', End: 'last',
}

function getFocusIntent(
  event: React.KeyboardEvent,
  orientation?: Orientation,
): FocusIntent | undefined {
  if (
    (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(event.key)) ||
    (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(event.key))
  )
    return undefined

  return MapKeyToFocusIntent[event.key]
}

export function focusFirst(
  candidates: { ref: React.RefObject<HTMLElement> }[],
  preventScroll: boolean,
  start = 0,
) {
  const size = candidates.length
  if (start >= size) return
  const prevActiveElement = document.activeElement
  const end = (start - 1 + size) % size
  for (let i = start; i !== end; i = (i + 1) % size) {
    const { ref } = candidates[i]
    if (ref.current === prevActiveElement) return
    ref.current?.focus({ preventScroll })
    if (document.activeElement === ref.current) return
  }
}

function isNotNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}
