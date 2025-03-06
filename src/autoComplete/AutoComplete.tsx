import { createCollection } from "#collection"
import { useCallbackRef } from "../hooks/useCallbackRef"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { createContext, useContext, useContextSelector } from "../shared/createContext"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import {
  forwardRef,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  createContext as createReactContext,
  useContext as useReactContext,
} from "react"

const AutoCompleteScope = createScope("AutoComplete")

export const AutoComplete = createAutoComplete(AutoCompleteScope)

export function createAutoComplete(scope: Scope) {
  const Collection = createCollection<AutoCompleteItemElement, AutoCompleteItemData>(scope)

  /* ------------------------------ AutoComplete Root ----------------------------- */

  const AutoCompleteContext = createContext<AutoCompleteContextValue>("AutoCompleteContext")
  type AutoCompleteContextValue = {
    value: string
    setValue(value: string): void
    selectedId: string | null
    setSelectedId(id: string | null): void
    matcher: AutoCompleteMatcher
  }

  interface AutoCompleteRootProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    matcher?: AutoCompleteMatcher
  }

  const AutoCompleteRoot = (props: AutoCompleteRootProps) => {
    const {
      children,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      matcher: matcherProp = defaultMatcher,
    } = props
    const [value, setValue] = useControllableState({
      controlled: [valueProp, onValueChange],
      uncontrolled: useState(defaultValue),
    })
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const handleValueChange = useCallbackRef(setValue)
    const matcher = useCallbackRef(matcherProp)

    return (
      <AutoCompleteContext.Provider
        value={useMemo(
          () => ({
            value,
            setValue: handleValueChange,
            selectedId,
            setSelectedId,
            matcher,
          }),
          [value, selectedId],
        )}
      >
        <Collection.Root>{children}</Collection.Root>
      </AutoCompleteContext.Provider>
    )
  }

  AutoCompleteRoot.displayName = `AutoComplete.Root <${scope.description}>`

  /* ----------------------------- AutoComplete Input ----------------------------- */

  type AutoCompleteInputElement = React.ElementRef<typeof el.input>
  interface AutoCompleteInputProps
    extends Omit<React.ComponentPropsWithoutRef<typeof el.input>, "type" | "value" | "onChange"> {}

  const AutoCompleteInput = forwardRef<AutoCompleteInputElement, AutoCompleteInputProps>(
    (props, forwardedRef) => {
      const { value, setValue, selectedId, setSelectedId } = useContext(AutoCompleteContext)!
      const getItems = Collection.useCollection()
      const handleItemSelection = (item: ReturnType<typeof getItems>[number]) => {
        setSelectedId(item.id)
        item.ref.current?.scrollIntoView({ block: "nearest" })
      }

      return (
        <el.input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          {...props}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, event => {
            if (event.target !== event.currentTarget) return
            if (selectedId === null) return
            if (["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
              const items = getItems({ ordered: true }).filter(item => item.render)
              const index = items.findIndex(item => item.id === selectedId)
              if (index === -1) return
              event.preventDefault()
              switch (event.key) {
                case "ArrowDown":
                  handleItemSelection(items[(index + 1) % items.length])
                  break
                case "ArrowUp":
                  handleItemSelection(items[(index - 1 + items.length) % items.length])
                  break
                case "Enter":
                  setValue(items[index].value)
              }
            }
          })}
        />
      )
    },
  )

  AutoCompleteInput.displayName = `AutoComplete.Input <${scope.description}>`

  /* ---------------------------- AutoComplete Content ---------------------------- */

  type AutoCompleteContentElement = React.ElementRef<typeof el.div>
  interface AutoCompleteContentProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const AutoCompleteContent = forwardRef<AutoCompleteContentElement, AutoCompleteContentProps>(
    (props, forwardedRef) => {
      const getItems = Collection.useCollection()
      const value = useContextSelector(AutoCompleteContext, ctx => ctx!.value)
      const setSelectedId = useContextSelector(AutoCompleteContext, ctx => ctx!.setSelectedId)
      const matcher = useContextSelector(AutoCompleteContext, ctx => ctx!.matcher)
      const contentRef = useRef<AutoCompleteContentElement | null>(null)
      const composedRef = useComposedRef(forwardedRef, contentRef)

      useLayoutEffect(() => {
        const content = contentRef.current!
        const items = getItems({ ordered: true })
        const itemGroups = Array.from(
          Map.groupBy(items, item => item.groupId ?? GroupNoneId).values(),
        )
        let firstItem: (AutoCompleteItemData & { ref: React.RefObject<HTMLElement> }) | undefined
        for (const items of itemGroups) {
          const groupRef = items[0].groupRef
          const sortedItems = filterAndSort(items, processInput(value), matcher)
          if (sortedItems.length > 0) {
            if (!firstItem) firstItem = sortedItems[0]
            if (groupRef) {
              groupRef.current!.append(...sortedItems.map(item => item.ref.current!))
              // content.append(groupRef.current!)
              groupRef.current!.style.display = ""
            } else {
              content.append(...items.map(item => item.ref.current!))
            }
          } else if (groupRef) {
            groupRef.current!.style.display = "none"
          }
        }
        if (firstItem) {
          setSelectedId(firstItem.id)
          firstItem.ref.current?.scrollIntoView({ block: "nearest" })
        } else {
          setSelectedId(null)
        }
      }, [value])

      return (
        <el.div
          {...props}
          style={{
            overflow: "hidden auto",
            ...props.style,
          }}
          ref={composedRef}
        />
      )
    },
  )

  AutoCompleteContent.displayName = `AutoComplete.Content <${scope.description}>`

  /* ----------------------------- AutoComplete Group ----------------------------- */

  const AutoCompleteGroupContext = createReactContext<AutoCompleteGroupContextValue | null>(null)
  type AutoCompleteGroupContextValue = {
    groupId: string
    groupRef: React.RefObject<AutoCompleteGroupElement>
  }
  const GroupNoneId = "GROUP_NONE"

  type AutoCompleteGroupElement = React.ElementRef<typeof el.div>
  interface AutoCompleteGroupProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  /**
   * `AutoComplete.Group` must have at least one `AutoComplete.Item` child.
   */
  const AutoCompleteGroup = forwardRef<AutoCompleteGroupElement, AutoCompleteGroupProps>(
    (props, forwardedRef) => {
      const id = useId()
      const groupRef = useRef<AutoCompleteGroupElement | null>(null)
      const composedRef = useComposedRef(forwardedRef, groupRef)
      return (
        <AutoCompleteGroupContext.Provider
          value={useMemo(
            () => ({
              groupId: id,
              groupRef,
            }),
            [],
          )}
        >
          <el.div {...props} ref={composedRef} />
        </AutoCompleteGroupContext.Provider>
      )
    },
  )

  AutoCompleteGroup.displayName = `AutoComplete.Group <${scope.description}>`

  /* ----------------------------- AutoComplete Label ----------------------------- */

  type AutoCompleteLabelElement = React.ElementRef<typeof el.div>
  interface AutoCompleteLabelProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const AutoCompleteLabel = forwardRef<AutoCompleteLabelElement, AutoCompleteLabelProps>(
    (props, forwardedRef) => {
      return <el.div {...props} ref={forwardedRef} />
    },
  )

  AutoCompleteLabel.displayName = `AutoComplete.Label <${scope.description}>`

  /* ------------------------------ AutoComplete Item ----------------------------- */

  type AutoCompleteItemElement = React.ElementRef<typeof el.div>
  interface AutoCompleteItemProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    value: string
  }
  interface AutoCompleteItemData {
    id: string
    value: string
    render: boolean
    groupId?: string
    groupRef?: React.RefObject<AutoCompleteGroupElement>
  }

  const AutoCompleteItem = forwardRef<AutoCompleteItemElement, AutoCompleteItemProps>(
    (props, forwardedRef) => {
      const { value: itemValue, ...itemProps } = props
      const id = useId()
      const setValue = useContextSelector(AutoCompleteContext, ctx => ctx!.setValue)
      const render = useContextSelector(
        AutoCompleteContext,
        ctx => +ctx!.matcher(itemValue, processInput(ctx!.value)) > 0,
      )
      const selected = useContextSelector(AutoCompleteContext, ctx => ctx!.selectedId === id)
      const groupCtx = useReactContext(AutoCompleteGroupContext)

      return (
        <Collection.Item
          id={id}
          value={itemValue}
          render={render}
          groupRef={groupCtx?.groupRef}
          groupId={groupCtx?.groupId}
        >
          <el.div
            data-selected={selected || undefined}
            {...itemProps}
            style={{
              display: render ? undefined : "none",
              ...itemProps.style,
            }}
            ref={forwardedRef}
            onClick={composeEventHandlers(itemProps.onClick, () => {
              setValue(itemValue)
            })}
          />
        </Collection.Item>
      )
    },
  )

  AutoCompleteItem.displayName = `AutoComplete.Item <${scope.description}>`

  /* --------------------------- AutoComplete Separator --------------------------- */

  type AutoCompleteSeparatorElement = React.ElementRef<typeof el.div>
  interface AutoCompleteSeparatorProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const AutoCompleteSeparator = forwardRef<
    AutoCompleteSeparatorElement,
    AutoCompleteSeparatorProps
  >((props, forwardedRef) => {
    return <el.div {...props} ref={forwardedRef} />
  })

  AutoCompleteSeparator.displayName = `AutoComplete.Separator <${scope.description}>`

  return {
    Root: AutoCompleteRoot,
    Input: AutoCompleteInput,
    Content: AutoCompleteContent,
    Group: AutoCompleteGroup,
    Label: AutoCompleteLabel,
    Item: AutoCompleteItem,
    Separator: AutoCompleteSeparator,
  }
}

export interface AutoCompleteMatcher {
  (value: string, input: string): number | boolean
}

export const processInput = (input: string) => input.toLowerCase().trim()

export const defaultMatcher: AutoCompleteMatcher = (value: string, input: string) => {
  if (input === "") return true
  const itemValue_ = value.toLowerCase()
  let i = 0,
    j = 0,
    p = 0
  let s!: number, n!: number
  while (j < itemValue_.length) {
    if (input[i] === itemValue_[j]) {
      i += 1
      p += (j + 1) ** 2 // prefer prefix matches
      if (i === 1) s = j
      if (i === input.length) {
        n = j
        break
      }
    }
    j += 1
  }
  if (i < input.length) return false // input must be a subsequence of value
  const gapPenalty = input.length / (n - s + 1)
  return gapPenalty * ((itemValue_.length * input.length) / p)
}

export function filterAndSort<
  T extends { ref: React.RefObject<HTMLElement>; value: string; render: boolean },
>(items: T[], input: string, matcher: (value: string, input: string) => number | boolean): T[] {
  if (input === "") return items
  const filtered: [T, weight: number][] = []
  for (const item of items) {
    if (!item.render) continue
    const weight = +matcher(item.value, input)
    if (weight > 0) {
      filtered.push([item, weight])
    }
  }
  filtered.sort((a, b) => b[1] - a[1])
  return filtered.map(([item]) => item)
}
