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

const ComboboxScope = createScope("Combobox")

export const Combobox = createCombobox(ComboboxScope)

export function createCombobox(scope: Scope) {
  const Collection = createCollection<ComboboxItemElement, ComboboxItemData>(scope)

  /* ------------------------------ Combobox Root ----------------------------- */

  const ComboboxContext = createContext<ComboboxContextValue>("ComboboxContext")
  type ComboboxContextValue = {
    value: string
    setValue(value: string): void
    selectedId: string | null
    setSelectedId(id: string | null): void
    matcher: ComboboxMatcher
  }

  interface ComboboxRootProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    matcher?: ComboboxMatcher
  }

  const ComboboxRoot = (props: ComboboxRootProps) => {
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
      <ComboboxContext.Provider
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
      </ComboboxContext.Provider>
    )
  }

  ComboboxRoot.displayName = `Combobox.Root <${scope.description}>`

  /* ----------------------------- Combobox Input ----------------------------- */

  type ComboboxInputElement = React.ElementRef<typeof el.input>
  interface ComboboxInputProps
    extends Omit<React.ComponentPropsWithoutRef<typeof el.input>, "type" | "value" | "onChange"> {}

  const ComboboxInput = forwardRef<ComboboxInputElement, ComboboxInputProps>(
    (props, forwardedRef) => {
      const { value, setValue, selectedId, setSelectedId } = useContext(ComboboxContext)!
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

  ComboboxInput.displayName = `Combobox.Input <${scope.description}>`

  /* ---------------------------- Combobox Content ---------------------------- */

  type ComboboxContentElement = React.ElementRef<typeof el.div>
  interface ComboboxContentProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const ComboboxContent = forwardRef<ComboboxContentElement, ComboboxContentProps>(
    (props, forwardedRef) => {
      const getItems = Collection.useCollection()
      const value = useContextSelector(ComboboxContext, ctx => ctx!.value)
      const setSelectedId = useContextSelector(ComboboxContext, ctx => ctx!.setSelectedId)
      const matcher = useContextSelector(ComboboxContext, ctx => ctx!.matcher)
      const contentRef = useRef<ComboboxContentElement | null>(null)
      const composedRef = useComposedRef(forwardedRef, contentRef)

      useLayoutEffect(() => {
        const content = contentRef.current!
        const items = getItems({ ordered: true })
        const itemGroups = Array.from(
          Map.groupBy(items, item => item.groupId ?? GroupNoneId).values(),
        )
        let firstItem: (ComboboxItemData & { ref: React.RefObject<HTMLElement> }) | undefined
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

  ComboboxContent.displayName = `Combobox.Content <${scope.description}>`

  /* ----------------------------- Combobox Group ----------------------------- */

  const ComboboxGroupContext = createReactContext<ComboboxGroupContextValue | null>(null)
  type ComboboxGroupContextValue = {
    groupId: string
    groupRef: React.RefObject<ComboboxGroupElement>
  }
  const GroupNoneId = "GROUP_NONE"

  type ComboboxGroupElement = React.ElementRef<typeof el.div>
  interface ComboboxGroupProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  /**
   * `Combobox.Group` must have at least one `Combobox.Item` child.
   */
  const ComboboxGroup = forwardRef<ComboboxGroupElement, ComboboxGroupProps>(
    (props, forwardedRef) => {
      const id = useId()
      const groupRef = useRef<ComboboxGroupElement | null>(null)
      const composedRef = useComposedRef(forwardedRef, groupRef)
      return (
        <ComboboxGroupContext.Provider
          value={useMemo(
            () => ({
              groupId: id,
              groupRef,
            }),
            [],
          )}
        >
          <el.div {...props} ref={composedRef} />
        </ComboboxGroupContext.Provider>
      )
    },
  )

  ComboboxGroup.displayName = `Combobox.Group <${scope.description}>`

  /* ----------------------------- Combobox Label ----------------------------- */

  type ComboboxLabelElement = React.ElementRef<typeof el.div>
  interface ComboboxLabelProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const ComboboxLabel = forwardRef<ComboboxLabelElement, ComboboxLabelProps>(
    (props, forwardedRef) => {
      return <el.div {...props} ref={forwardedRef} />
    },
  )

  ComboboxLabel.displayName = `Combobox.Label <${scope.description}>`

  /* ------------------------------ Combobox Item ----------------------------- */

  type ComboboxItemElement = React.ElementRef<typeof el.div>
  interface ComboboxItemProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    value: string
  }
  interface ComboboxItemData {
    id: string
    value: string
    render: boolean
    groupId?: string
    groupRef?: React.RefObject<ComboboxGroupElement>
  }

  const ComboboxItem = forwardRef<ComboboxItemElement, ComboboxItemProps>((props, forwardedRef) => {
    const { value: itemValue, ...itemProps } = props
    const id = useId()
    const setValue = useContextSelector(ComboboxContext, ctx => ctx!.setValue)
    const render = useContextSelector(
      ComboboxContext,
      ctx => +ctx!.matcher(itemValue, processInput(ctx!.value)) > 0,
    )
    const selected = useContextSelector(ComboboxContext, ctx => ctx!.selectedId === id)
    const groupCtx = useReactContext(ComboboxGroupContext)

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
  })

  ComboboxItem.displayName = `Combobox.Item <${scope.description}>`

  /* --------------------------- Combobox Separator --------------------------- */

  type ComboboxSeparatorElement = React.ElementRef<typeof el.div>
  interface ComboboxSeparatorProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const ComboboxSeparator = forwardRef<ComboboxSeparatorElement, ComboboxSeparatorProps>(
    (props, forwardedRef) => {
      return <el.div {...props} ref={forwardedRef} />
    },
  )

  ComboboxSeparator.displayName = `Combobox.Separator <${scope.description}>`

  return {
    Root: ComboboxRoot,
    Input: ComboboxInput,
    Content: ComboboxContent,
    Group: ComboboxGroup,
    Label: ComboboxLabel,
    Item: ComboboxItem,
    Separator: ComboboxSeparator,
  }
}

export interface ComboboxMatcher {
  (value: string, input: string): number | boolean
}

export const processInput = (input: string) => input.toLowerCase().trim()

export const defaultMatcher: ComboboxMatcher = (value: string, input: string) => {
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
