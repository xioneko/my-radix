import { createCollection } from "#collection"
import { DismissableLayer } from "#dismissableLayer"
import { createPopper } from "#popper"
import { Portal } from "#portal"
import { focusFirst } from "#rovingFocusGroup"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { usePrevious } from "../hooks/usePrevious"
import { useRenderCountEffect } from "../hooks/useRenderCountEffect"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { createPortal } from "react-dom"
import { AutoFocusInside, FocusOn } from "react-focus-on"
import { createContext, useContext, useContextSelector } from "use-context-selector"

// import { useRenderCountEffect } from "../hooks/useRenderCountEffect"

const SelectScope = createScope("Select")

export const Select = createSelect(SelectScope)

export function createSelect(scope: Scope) {
  const Popper = createPopper(scope)
  const Collection = createCollection<SelectItemElement, SelectItemData>(scope)

  /* ------------------------------- Select Root ------------------------------ */

  const SelectContext = createContext<SelectContextValue | null>(null)
  type SelectContextValue = {
    trigger: SelectTriggerElement | null
    setTrigger: (trigger: SelectTriggerElement | null) => void
    triggerPointDownPosRef: React.MutableRefObject<{ x: number; y: number } | null>
    value?: string
    setValue: (value: string) => void
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    disabled?: boolean
    valueNode: SelectValueElement | null
    setValueNode: (valueNode: SelectValueElement | null) => void
    valueNodeHasChildren: boolean
    setValueNodeHasChildren: (hasChildren: boolean) => void
    onItemAdd: (item: React.RefObject<SelectItemElement>, itemData: SelectItemData) => void
    onItemRemove: (item: React.RefObject<SelectItemElement>) => void
  }
  SelectContext.displayName = `SelectContext <${scope.description}>`

  interface SelectRootProps {
    children: React.ReactNode
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    name?: string
    autoComplete?: string
    disabled?: boolean
    required?: boolean
    form?: string
  }

  const SelectRoot = (props: SelectRootProps) => {
    const {
      children,
      value: valueProp,
      defaultValue,
      onValueChange,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      name,
      autoComplete,
      disabled,
      required,
      form,
    } = props
    const [open, setOpen] = useControllableState({
      controlled: [openProp, onOpenChange],
      uncontrolled: useState(defaultOpen),
    })
    const [value, setValue] = useControllableState({
      // @ts-expect-error onValueChange will never be called with undefined
      controlled: [valueProp, onValueChange],
      uncontrolled: useState(defaultValue),
    })
    const [trigger, setTrigger] = useState<SelectTriggerElement | null>(null)
    const [itemsMap, setItemsMap] = useState<
      Map<React.RefObject<SelectItemElement>, SelectItemData>
    >(new Map())
    const [valueNode, setValueNode] = useState<SelectValueElement | null>(null)
    const [valueNodeHasChildren, setValueNodeHasChildren] = useState(false)
    const triggerPointDownPosRef = useRef<{ x: number; y: number } | null>(null)
    const isFormControl = form !== undefined || !!trigger?.closest("form") || false

    const handleItemAdd = useCallback(
      (ref: React.RefObject<SelectItemElement>, itemData: SelectItemData) => {
        setItemsMap(prevItemsMap => {
          const nextItemsMap = new Map(prevItemsMap)
          nextItemsMap.set(ref, itemData)
          return nextItemsMap
        })
      },
      [],
    )
    const handleItemRemove = useCallback((ref: React.RefObject<SelectItemElement>) => {
      setItemsMap(prevItemsMap => {
        const nextItemsMap = new Map(prevItemsMap)
        nextItemsMap.delete(ref)
        return nextItemsMap
      })
    }, [])

    return (
      <Popper.Root>
        <SelectContext.Provider
          value={useMemo(
            // prettier-ignore
            () => ({
              trigger, setTrigger,
              triggerPointDownPosRef,
              value, setValue,
              valueNode, setValueNode,
              valueNodeHasChildren, setValueNodeHasChildren,
              open, setOpen,
              disabled,
              onItemAdd: handleItemAdd,
              onItemRemove: handleItemRemove,
            }),
            // prettier-ignore
            [
              trigger,
              value, setValue,
              open, setOpen,
              valueNode,
              valueNodeHasChildren,
              disabled,
            ],
          )}
        >
          {children}
          {isFormControl && (
            <NativeSelect
              tabIndex={-1}
              name={name}
              value={value}
              required={required}
              autoComplete={autoComplete}
              disabled={disabled}
              onChange={event => setValue(event.target.value)}
              form={form}
            >
              {value === undefined && <option value="" />}
              {Array.from(itemsMap.values()).map(item => {
                return (
                  <option key={item.value} value={item.value} disabled={item.disabled}>
                    {item.textContent}
                  </option>
                )
              })}
            </NativeSelect>
          )}
        </SelectContext.Provider>
      </Popper.Root>
    )
  }

  SelectRoot.displayName = `Select.Root <${scope.description}>`

  function NativeSelect(props: React.ComponentPropsWithoutRef<"select">) {
    const { value, ...selectProps } = props
    const selectRef = useRef<HTMLSelectElement>(null)
    const prevValue = usePrevious(value)

    useEffect(() => {
      const select = selectRef.current!
      // in order to trigger the form change event
      const setValue = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype,
        "value",
      )!.set
      if (prevValue !== value && setValue) {
        setValue.call(select, value)
        const event = new Event("change", { bubbles: true })
        select.dispatchEvent(event)
      }
    }, [prevValue, value])

    return (
      <select
        defaultValue={value}
        {...selectProps}
        ref={selectRef}
        style={{
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          wordWrap: "normal",
        }}
      />
    )
  }

  /* ----------------------------- Select Trigger ----------------------------- */

  type SelectTriggerElement = React.ElementRef<typeof el.button>
  interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof el.button> {}

  const SelectTrigger = forwardRef<SelectTriggerElement, SelectTriggerProps>(
    (props, forwardedRef) => {
      const { disabled: disabledProp = false, ...triggerProps } = props
      const disabled = useContextSelector(SelectContext, ctx => ctx!.disabled) || disabledProp
      const open = useContextSelector(SelectContext, ctx => ctx!.open)
      const setOpen = useContextSelector(SelectContext, ctx => ctx!.setOpen)
      const value = useContextSelector(SelectContext, ctx => ctx!.value)
      const setTrigger = useContextSelector(SelectContext, ctx => ctx!.setTrigger)
      const composedRef = useComposedRef(forwardedRef, setTrigger)
      const triggerPointDownPosRef = useContextSelector(
        SelectContext,
        ctx => ctx!.triggerPointDownPosRef,
      )

      return (
        <Popper.Anchor asChild>
          <el.button
            type="button"
            data-state={open ? "open" : "closed"}
            data-disabled={disabled || undefined}
            data-placeholder={value === undefined || value === "" || undefined}
            disabled={disabled}
            {...triggerProps}
            ref={composedRef}
            onPointerDown={composeEventHandlers(props.onPointerDown, event => {
              const target = event.target as HTMLElement
              if (target.hasPointerCapture(event.pointerId)) {
                // prevent trigger from capturing pointer
                target.releasePointerCapture(event.pointerId)
              }
              if (event.button === 0 && event.ctrlKey === false) {
                if (!disabled) setOpen(!open)
                triggerPointDownPosRef.current = { x: event.pageX, y: event.pageY }
              }
            })}
            onKeyDown={composeEventHandlers(props.onKeyDown, event => {
              if (["Enter", " ", "ArrowDown"].includes(event.key)) {
                if (!disabled) setOpen(!open)
                event.preventDefault() // prevent scroll
              }
            })}
          />
        </Popper.Anchor>
      )
    },
  )

  SelectTrigger.displayName = `Select.Trigger <${scope.description}>`

  /* ------------------------------ Select Value ------------------------------ */

  type SelectValueElement = React.ElementRef<typeof el.span>
  interface SelectValueProps extends React.ComponentPropsWithoutRef<typeof el.span> {
    placeholder?: React.ReactNode
  }

  const SelectValue = forwardRef<SelectValueElement, SelectValueProps>((props, forwardRef) => {
    const {
      placeholder = "",
      className: _className,
      style: _style,
      children,
      ...valueProps
    } = props
    const value = useContextSelector(SelectContext, ctx => ctx!.value)
    const setValueNode = useContextSelector(SelectContext, ctx => ctx!.setValueNode)
    const setValueNodeHasChildren = useContextSelector(
      SelectContext,
      ctx => ctx!.setValueNodeHasChildren,
    )
    const composedRef = useComposedRef(forwardRef, setValueNode)

    useLayoutEffect(() => {
      setValueNodeHasChildren(children !== undefined)
    }, [children, setValueNodeHasChildren])

    return (
      <el.span {...valueProps} ref={composedRef} style={{ pointerEvents: "none" }}>
        {value ? children : placeholder}
      </el.span>
    )
  })

  SelectValue.displayName = `Select.Value <${scope.description}>`

  /* ------------------------------- Select Icon ------------------------------ */

  type SelectIconElement = React.ElementRef<typeof el.span>
  interface SelectIconProps extends React.ComponentPropsWithoutRef<typeof el.span> {}

  const SelectIcon = forwardRef<SelectIconElement, SelectIconProps>((props, ref) => {
    const { children, ...iconProps } = props
    return (
      <el.span {...iconProps} ref={ref}>
        {children || "▼"}
      </el.span>
    )
  })

  SelectIcon.displayName = `Select.Icon <${scope.description}>`

  /* ------------------------------ Select Portal ----------------------------- */

  interface SelectPortalProps {
    children?: React.ReactNode
    container?: Element | DocumentFragment | null
  }

  const SelectPortal = (props: SelectPortalProps) => {
    const { children, container } = props
    return (
      <Portal container={container} asChild>
        {children}
      </Portal>
    )
  }

  SelectPortal.displayName = `Select.Portal <${scope.description}>`

  /* ----------------------------- Select Content ----------------------------- */

  const SelectContentContext = createContext<SelectContentContextValue | null>(null)
  type SelectContentContextValue = {
    onItemLeave: () => void
    onItemEnter: (event: React.MouseEvent<HTMLElement>) => void
  }
  SelectContentContext.displayName = `SelectContentContext <${scope.description}>`

  type SelectContentElement = React.ElementRef<typeof Popper.Content>
  interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof Popper.Content> {
    loop?: boolean
    onEscapeKeyDown?: (event: KeyboardEvent) => boolean | void
    onPointerDownOutside?: (event: PointerEvent) => boolean | void
  }

  const SelectContent = forwardRef<SelectContentElement, SelectContentProps>(
    (props, forwardedRef) => {
      const fragment = useRef(document.createDocumentFragment())
      const open = useContextSelector(SelectContext, ctx => ctx!.open)

      return open ? (
        <SelectContentInner {...props} ref={forwardedRef} />
      ) : (
        createPortal(
          <SelectContentContext.Provider value={null}>
            {props.children}
          </SelectContentContext.Provider>,
          fragment.current,
        )
      )
    },
  )

  SelectContent.displayName = `Select.Content <${scope.description}>`

  const SelectContentInner = forwardRef<SelectContentElement, SelectContentProps>(
    function SelectContentInner(props, forwardedRef) {
      const { onEscapeKeyDown, onPointerDownOutside, ...contentProps } = props
      const open = useContextSelector(SelectContext, ctx => ctx!.open)
      const setOpen = useContextSelector(SelectContext, ctx => ctx!.setOpen)
      const contentRef = useRef<SelectContentElement>(null)
      const composedRef = useComposedRef(forwardedRef, contentRef)

      const handleItemLeave = useCallback(() => {
        contentRef.current?.focus()
      }, [])
      const handleItemEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.currentTarget.focus()
      }, [])

      return (
        <SelectContentContext.Provider
          value={useMemo(
            () => ({
              onItemLeave: handleItemLeave,
              onItemEnter: handleItemEnter,
            }),
            [],
          )}
        >
          <FocusOn enabled={open} noIsolation preventScrollOnFocus>
            <DismissableLayer
              asChild
              disableOutsidePointerEvents
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onDismiss={() => setOpen(false)}
            >
              <Collection.Root>
                <BaseSelectContent {...contentProps} ref={composedRef} />
              </Collection.Root>
            </DismissableLayer>
          </FocusOn>
        </SelectContentContext.Provider>
      )
    },
  )

  interface BaseSelectContentProps extends React.ComponentPropsWithoutRef<typeof Popper.Content> {
    loop?: boolean
  }

  const BaseSelectContent = forwardRef<SelectContentElement, BaseSelectContentProps>(
    function BaseSelectContent(props, forwardedRef) {
      const { loop = false, ...contentProps } = props
      const contentRef = useRef<SelectContentElement>(null)
      const composedRef = useComposedRef(forwardedRef, contentRef)
      const open = useContextSelector(SelectContext, ctx => ctx!.open)
      const setOpen = useContextSelector(SelectContext, ctx => ctx!.setOpen)
      const triggerPointDownPosRef = useContextSelector(
        SelectContext,
        ctx => ctx!.triggerPointDownPosRef,
      )
      const isFirstFocusEnter = useRef(true)
      const getItems = Collection.useCollection()
      useRenderCountEffect("BaseSelectContent")

      useEffect(() => {
        if (!open) isFirstFocusEnter.current = true
      }, [open])

      useEffect(() => {
        const content = contentRef.current!
        let pointerMoveDelta = { x: 0, y: 0 }

        const handlePointerMove = (event: PointerEvent) => {
          pointerMoveDelta = {
            x: Math.abs(event.pageX - (triggerPointDownPosRef.current?.x ?? 0)),
            y: Math.abs(event.pageY - (triggerPointDownPosRef.current?.y ?? 0)),
          }
        }

        const handlePointerUp = (event: PointerEvent) => {
          if (pointerMoveDelta.x < 10 && pointerMoveDelta.y < 10) {
            // if the pointer moved less than threshold, prevent item being selected
            event.preventDefault()
          } else {
            if (!content.contains(event.target as Node)) {
              // if the pointer moved outside the content, close
              setOpen(false)
            }
          }
          document.removeEventListener("pointermove", handlePointerMove)
          triggerPointDownPosRef.current = null
        }

        if (triggerPointDownPosRef.current) {
          document.addEventListener("pointermove", handlePointerMove)
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true })
        }

        return () => {
          document.removeEventListener("pointermove", handlePointerMove)
          document.removeEventListener("pointerup", handlePointerUp, { capture: true })
        }
      }, [setOpen])

      useEffect(() => {
        const close = () => setOpen(false)
        window.addEventListener("blur", close)
        window.addEventListener("resize", close)
        return () => {
          window.removeEventListener("blur", close)
          window.removeEventListener("resize", close)
        }
      }, [setOpen])

      return (
        <Popper.Content
          tabIndex={-1}
          {...contentProps}
          ref={composedRef}
          style={{
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            ...props.style,
          }}
          onContextMenu={event => event.preventDefault()}
          onKeyDown={composeEventHandlers(props.onKeyDown, event => {
            if (event.key === "Tab") return event.preventDefault()
            const focusIntent = MapKeyToFocusIntent[event.key]
            if (focusIntent !== undefined) {
              event.preventDefault()
              const candidates = getItems({ ordered: true }).filter(item => !item.disabled)
              if (focusIntent == "last" || focusIntent == "prev") candidates.reverse()
              if (focusIntent === "prev" || focusIntent === "next") {
                const currentIndex = candidates.findIndex(item => item.ref.current === event.target)
                focusFirst(
                  candidates,
                  false,
                  loop ? (currentIndex + 1) % candidates.length : currentIndex + 1,
                )
              } else {
                focusFirst(candidates, false)
              }
            }
          })}
        />
      )
    },
  )

  /* ----------------------------- Select ViewPort ---------------------------- */

  type SelectViewPortElement = React.ElementRef<typeof el.div>
  interface SelectViewPortProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const SelectViewport = forwardRef<SelectViewPortElement, SelectViewPortProps>(
    (props, forwardedRef) => {
      return (
        <el.div
          {...props}
          style={{
            flex: 1,
            overflow: "hidden auto",
            ...props.style,
          }}
          ref={forwardedRef}
        />
      )
    },
  )

  SelectViewport.displayName = `Select.Viewport <${scope.description}>`

  /* ------------------------------ Select Group ------------------------------ */

  type SelectGroupElement = React.ElementRef<typeof el.div>
  interface SelectGroupProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const SelectGroup = forwardRef<SelectGroupElement, SelectGroupProps>((props, forwardedRef) => {
    return <el.div {...props} ref={forwardedRef} />
  })

  SelectGroup.displayName = `Select.Group <${scope.description}>`

  /* ------------------------------ Select Label ------------------------------ */

  type SelectLabelElement = React.ElementRef<typeof el.div>
  interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const SelectLabel = forwardRef<SelectLabelElement, SelectLabelProps>((props, forwardedRef) => {
    return <el.div {...props} ref={forwardedRef} />
  })

  SelectLabel.displayName = `Select.Label <${scope.description}>`

  /* ------------------------------- Select Item ------------------------------ */

  const SelectItemContext = createContext<SelectItemContextValue | null>(null)
  type SelectItemContextValue = {
    selected: boolean
    setItemTextNode: (node: SelectItemTextElement | null) => void
  }
  SelectItemContext.displayName = `SelectItemContext <${scope.description}>`

  type SelectItemElement = React.ElementRef<typeof el.div>
  interface SelectItemProps
    extends React.ComponentPropsWithoutRef<typeof el.div>,
      Partial<SelectItemData> {
    value: string
  }
  interface SelectItemData {
    /**
     * value must be a non-empty string, and must be unique among all items in the same select
     */
    value: string
    disabled: boolean
    selected?: boolean
    textContent?: string | null
  }

  const SelectItem = forwardRef<SelectItemElement, SelectItemProps>((props, forwardedRef) => {
    const { value: itemValue, disabled = false, ...itemProps } = props
    const value = useContextSelector(SelectContext, ctx => ctx!.value)
    const selected = value === itemValue
    const setValue = useContextSelector(SelectContext, ctx => ctx!.setValue)
    const setOpen = useContextSelector(SelectContext, ctx => ctx!.setOpen)
    const onItemAdd = useContextSelector(SelectContext, ctx => ctx!.onItemAdd)
    const onItemRemove = useContextSelector(SelectContext, ctx => ctx!.onItemRemove)
    const contentCtx = useContext(SelectContentContext)
    const itemRef = useRef<SelectItemElement>(null)
    const composedRef = useComposedRef(forwardedRef, itemRef)
    const [isFocused, setIsFocused] = useState(false)

    const handleItemTextNodeChange = useCallback((node: SelectItemTextElement | null) => {
      const textContent = node?.textContent
      if (node === null) {
        onItemRemove(itemRef)
      } else {
        onItemAdd(itemRef, { value: itemValue, disabled, textContent })
      }
    }, [])
    const handleSelect = () => {
      if (!disabled) {
        setValue(itemValue)
        setOpen(false)
      }
    }

    const ItemInner = (
      <Collection.Item value={itemValue} disabled={disabled} selected={selected}>
        <el.div
          data-highlighted={isFocused || undefined}
          data-disabled={disabled || undefined}
          data-state={selected ? "checked" : "unchecked"}
          tabIndex={disabled ? undefined : -1}
          {...itemProps}
          ref={composedRef}
          onPointerUp={composeEventHandlers(itemProps.onPointerUp, handleSelect)}
          onMouseEnter={composeEventHandlers(itemProps.onMouseEnter, event => {
            if (disabled) contentCtx!.onItemLeave()
            else contentCtx!.onItemEnter(event)
          })}
          onMouseLeave={composeEventHandlers(itemProps.onMouseLeave, () => {
            contentCtx!.onItemLeave()
          })}
          onKeyDown={composeEventHandlers(itemProps.onKeyDown, event => {
            if (event.key === "Enter" || event.key === " ") {
              handleSelect()
              event.preventDefault()
            }
          })}
          onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
          onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
        />
      </Collection.Item>
    )

    return (
      <SelectItemContext.Provider
        value={useMemo(
          () => ({
            selected,
            setItemTextNode: handleItemTextNodeChange,
          }),
          [selected, handleItemTextNodeChange],
        )}
      >
        {selected ? <AutoFocusInside>{ItemInner}</AutoFocusInside> : ItemInner}
      </SelectItemContext.Provider>
    )
  })

  SelectItem.displayName = `Select.Item <${scope.description}>`

  /* ----------------------------- Select ItemText ---------------------------- */

  type SelectItemTextElement = React.ElementRef<typeof el.span>
  interface SelectItemTextProps extends React.ComponentPropsWithoutRef<typeof el.span> {}

  const SelectItemText = forwardRef<SelectItemTextElement, SelectItemTextProps>(
    (props, forwardedRef) => {
      const { className: _className, style: _style, ...itemTextProps } = props
      const { selected, setItemTextNode } = useContext(SelectItemContext)!
      const composedRef = useComposedRef(forwardedRef, setItemTextNode)
      const valueNodeHasChildren = useContextSelector(
        SelectContext,
        ctx => ctx!.valueNodeHasChildren,
      )
      const valueNode = useContextSelector(SelectContext, ctx => ctx!.valueNode)

      return (
        <>
          <el.span {...itemTextProps} ref={composedRef} />
          {selected &&
            !valueNodeHasChildren &&
            valueNode &&
            createPortal(itemTextProps.children, valueNode)}
        </>
      )
    },
  )

  SelectItemText.displayName = `Select.ItemText <${scope.description}>`

  /* -------------------------- Select ItemIndicator -------------------------- */

  type SelectItemIndicatorElement = React.ElementRef<typeof el.span>
  interface SelectItemIndicatorProps extends React.ComponentPropsWithoutRef<typeof el.span> {}

  const SelectItemIndicator = forwardRef<SelectItemIndicatorElement, SelectItemIndicatorProps>(
    (props, forwardedRef) => {
      const selected = useContextSelector(SelectItemContext, ctx => ctx!.selected)
      return selected && <el.span {...props} ref={forwardedRef} />
    },
  )

  SelectItemIndicator.displayName = `Select.ItemIndicator <${scope.description}>`

  /* ---------------------------- Select Separator ---------------------------- */

  type SelectSeparatorElement = React.ElementRef<typeof el.div>
  interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const SelectSeparator = forwardRef<SelectSeparatorElement, SelectSeparatorProps>(
    (props, forwardedRef) => {
      return <el.div {...props} ref={forwardedRef} />
    },
  )

  SelectSeparator.displayName = `Select.Separator <${scope.description}>`

  /* ------------------------------ Select Arrow ------------------------------ */

  type SelectArrowElement = React.ElementRef<typeof Popper.Arrow>
  interface SelectArrowProps extends React.ComponentPropsWithoutRef<typeof Popper.Arrow> {}

  const SelectArrow = forwardRef<SelectArrowElement, SelectArrowProps>((props, forwardedRef) => {
    const open = useContextSelector(SelectContext, ctx => ctx!.open)
    return open && <Popper.Arrow {...props} ref={forwardedRef} />
  })

  SelectArrow.displayName = `Select.Arrow <${scope.description}>`

  return {
    Root: SelectRoot,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Icon: SelectIcon,
    Portal: SelectPortal,
    Content: SelectContent,
    Viewport: SelectViewport,
    Group: SelectGroup,
    Label: SelectLabel,
    Item: SelectItem,
    ItemText: SelectItemText,
    ItemIndicator: SelectItemIndicator,
    Separator: SelectSeparator,
    Arrow: SelectArrow,
  }
}

type FocusIntent = "first" | "last" | "prev" | "next"

// prettier-ignore
const MapKeyToFocusIntent: Record<string, FocusIntent> = {
  ArrowUp: 'prev',
  ArrowDown: 'next',
  PageUp: 'first', Home: 'first',
  PageDown: 'last', End: 'last',
}
