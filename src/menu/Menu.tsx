import { DismissableLayer, type DismissReason } from "#dismissableLayer"
import { createPopper } from "#popper"
import { Portal } from "#portal"
import { createRovingFocusGroup, focusFirst } from "#rovingFocusGroup"
import { useCallbackRef } from "../hooks/useCallbackRef"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { composeEventHandlers, mergeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import type { ReactFocusLockProps } from "react-focus-lock"
import { FocusOn } from "react-focus-on"
import { createContext, useContext, useContextSelector } from "use-context-selector"

const MenuScope = createScope("Menu")

export const Menu = createMenu(MenuScope)

export function createMenu(scope: Scope) {
  const Popper = createPopper(scope)
  const RovingFocusGroup = createRovingFocusGroup(scope)

  /* -------------------------------- Menu Root ------------------------------- */

  const MenuRootContext = createContext<MenuRootContextValue | null>(null)
  type MenuRootContextValue = {
    modal: boolean
    isTriggeredByKeyboardRef: React.RefObject<boolean>
  }

  const MenuContext = createContext<MenuContextValue | null>(null)
  type MenuContextValue = {
    open: boolean
    setOpen: (open: boolean) => void
    openedSubId: string | null
    setOpenedSubId: (id: string | null) => void
    contentRef: React.RefObject<MenuContentElement>
  }

  interface MenuRootProps {
    modal?: boolean
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
  }

  const MenuRoot = (props: MenuRootProps) => {
    const { modal = false, open = false, onOpenChange, children } = props
    const isTriggeredByKeyboardRef = useRef(false)
    const [openedSubId, setOpenedSubId] = useState<string | null>(null)
    const contentRef = useRef<MenuContentElement>(null)
    const handleOpenChange = useCallbackRef(onOpenChange)

    useEffect(() => {
      const handleKeyDown = () => {
        isTriggeredByKeyboardRef.current = true
        document.addEventListener("pointerdown", handlePointer, { capture: true, once: true })
        document.addEventListener("pointermove", handlePointer, { capture: true, once: true })
      }
      const handlePointer = () => (isTriggeredByKeyboardRef.current = false)
      document.addEventListener("keydown", handleKeyDown, { capture: true })
      return () => {
        document.removeEventListener("keydown", handleKeyDown, { capture: true })
        document.removeEventListener("pointerdown", handlePointer, { capture: true })
        document.removeEventListener("pointermove", handlePointer, { capture: true })
      }
    }, [])

    return (
      <Popper.Root>
        <MenuRootContext.Provider
          value={useMemo(() => ({ modal, isTriggeredByKeyboardRef }), [modal])}
        >
          <MenuContext.Provider
            value={useMemo(
              () => ({ open, setOpen: handleOpenChange, openedSubId, setOpenedSubId, contentRef }),
              [open, openedSubId],
            )}
          >
            {children}
          </MenuContext.Provider>
        </MenuRootContext.Provider>
      </Popper.Root>
    )
  }

  MenuRoot.displayName = `Menu.Root <${scope.description}>`

  /* ------------------------------- Menu Anchor ------------------------------ */

  type MenuAnchorElement = React.ElementRef<typeof Popper.Anchor>
  interface MenuAnchorProps extends React.ComponentPropsWithoutRef<typeof Popper.Anchor> {}

  const MenuAnchor = forwardRef<MenuAnchorElement, MenuAnchorProps>((props, forwardedRef) => {
    const { ...anchorProps } = props
    return <Popper.Anchor {...anchorProps} ref={forwardedRef} />
  })

  MenuAnchor.displayName = `Menu.Anchor <${scope.description}>`

  /* ------------------------------- Menu Portal ------------------------------ */

  interface MenuPortalProps {
    children: React.ReactNode
    container?: Element | DocumentFragment | null
  }

  const MenuPortal = (props: MenuPortalProps) => {
    const { children, container } = props
    return (
      <Portal container={container} asChild>
        {children}
      </Portal>
    )
  }

  MenuPortal.displayName = `Menu.Portal <${scope.description}>`

  /* ------------------------------ Menu Content ------------------------------ */

  const MenuContentContext = createContext<MenuContentContextValue | null>(null)
  type MenuContentContextValue = {
    onItemEnter: (event: React.MouseEvent<HTMLElement>) => void
    onItemLeave: () => void
  }

  type MenuContentElement = React.ElementRef<typeof Popper.Content>
  interface MenuContentProps extends BaseMenuContentProps {}

  const MenuContent = forwardRef<MenuContentElement, MenuContentProps>((props, forwardedRef) => {
    const modal = useContextSelector(MenuRootContext, ctx => ctx!.modal)
    const setOpen = useContextSelector(MenuContext, ctx => ctx!.setOpen)

    return (
      <BaseMenuContent
        {...props}
        ref={forwardedRef}
        autoFocus={true}
        focusLock={modal}
        scrollLock={modal}
        disableOutsidePointerEvents={modal}
        onDismiss={() => setOpen(false)}
      />
    )
  })

  MenuContent.displayName = `Menu.Content <${scope.description}>`

  interface BaseMenuContentProps extends PopperContentProps {
    forceMount?: true
    loop?: boolean
    returnFocus?: ReactFocusLockProps["returnFocus"]
    preventScrollOnFocus?: boolean
    onFocusEnter?: (event: React.FocusEvent) => boolean | void
    onEscapeKeyDown?: (event: KeyboardEvent) => boolean | void
    onPointerDownOutside?: (event: PointerEvent) => boolean | void
    onFocusOutside?: (event: FocusEvent) => boolean | void
  }

  interface PrivateMenuContentProps {
    autoFocus: boolean
    focusLock: boolean
    scrollLock: boolean
    disableOutsidePointerEvents: boolean
    onDismiss?: (reason: DismissReason) => void
  }

  const BaseMenuContent = forwardRef<
    MenuContentElement,
    BaseMenuContentProps & PrivateMenuContentProps
  >((props, forwardedRef) => {
    const {
      forceMount,
      returnFocus = true,
      loop = false,
      preventScrollOnFocus,
      onFocusEnter,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      autoFocus,
      focusLock,
      scrollLock,
      disableOutsidePointerEvents,
      onDismiss,
      ...contentProps
    } = props

    const open = useContextSelector(MenuContext, ctx => ctx!.open)
    const contentRef = useContextSelector(MenuContext, ctx => ctx!.contentRef)
    const composedRef = useComposedRef(forwardedRef, contentRef)
    const isTriggeredByKeyboardRef = useContextSelector(
      MenuRootContext,
      ctx => ctx!.isTriggeredByKeyboardRef,
    )

    const contentCtx = useMemo(
      () => ({
        onItemEnter: (event: React.MouseEvent<HTMLElement>) => {
          event.currentTarget.focus({ preventScroll: true })
        },
        onItemLeave: () => {
          contentRef.current?.focus({ preventScroll: true })
        },
      }),
      [],
    )

    useEffect(() => {
      if (open && autoFocus) {
        contentRef.current?.focus({ preventScroll: true })
      }
    }, [open])

    return (
      (forceMount || open) && (
        <MenuContentContext.Provider value={contentCtx}>
          <FocusOn
            enabled={open}
            focusLock={focusLock}
            scrollLock={scrollLock}
            autoFocus={false /* we handle focus manually */}
            returnFocus={returnFocus}
            preventScrollOnFocus={preventScrollOnFocus}
            noIsolation
          >
            <DismissableLayer
              asChild
              disableOutsidePointerEvents={open && disableOutsidePointerEvents}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onFocusOutside={onFocusOutside}
              onDismiss={onDismiss}
            >
              <RovingFocusGroup.Root
                asChild
                orientation="vertical"
                loop={loop}
                onFocusEnter={event => {
                  // only focus first focusable item when using keyboard
                  return onFocusEnter?.(event) || !isTriggeredByKeyboardRef.current
                }}
              >
                <BaseMenuContentInner {...contentProps} ref={composedRef} />
              </RovingFocusGroup.Root>
            </DismissableLayer>
          </FocusOn>
        </MenuContentContext.Provider>
      )
    )
  })

  BaseMenuContent.displayName = `BaseMenuContent <${scope.description}>`

  type PopperContentProps = React.ComponentPropsWithoutRef<typeof Popper.Content>

  const BaseMenuContentInner = forwardRef<MenuContentElement, PopperContentProps>(
    (props, forwardedRef) => {
      const getItems = RovingFocusGroup.useRovingFocusGroup()

      return (
        <Popper.Content
          {...props}
          ref={forwardedRef}
          style={{ outline: "none", ...props.style }}
          onKeyDown={composeEventHandlers(props.onKeyDown, event => {
            if (event.target !== event.currentTarget) return
            if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
            if (event.key === "Tab") return event.preventDefault()
            // when the focus is on the content, we can use some keys to focus the menu items
            const intent = MapKeyToFocusIntent[event.key]
            if (intent !== undefined) {
              event.preventDefault()
              const candidates = getItems().filter(item => item.focusable)
              if (intent === "last") candidates.reverse()
              focusFirst(candidates, false)
            }
          })}
        />
      )
    },
  )

  /* -------------------------------- Menu Item ------------------------------- */

  type MenuItemElement = React.ElementRef<typeof el.div>
  interface MenuItemProps extends BaseMenuItemProps {
    /**
     * return `true` to prevent dismiss
     */
    onSelect?: (event: React.PointerEvent | React.KeyboardEvent) => boolean | void
  }

  const MenuItem = forwardRef<MenuItemElement, MenuItemProps>((props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props
    const setOpen = useContextSelector(MenuContext, ctx => ctx!.setOpen)

    return (
      <BaseMenuItem
        {...itemProps}
        ref={forwardedRef}
        disabled={disabled}
        onPointerUp={composeEventHandlers(itemProps.onPointerUp, event => {
          if (!disabled && !onSelect?.(event)) setOpen(false)
        })}
        onKeyDown={composeEventHandlers(itemProps.onKeyDown, event => {
          if (event.key === "Tab") event.preventDefault()
          if (event.key === "Enter" || event.key === " ") {
            if (!disabled && !onSelect?.(event)) setOpen(false)
            event.preventDefault()
          }
        })}
      />
    )
  })

  MenuItem.displayName = `Menu.Item <${scope.description}>`

  interface BaseMenuItemProps
    extends Omit<React.ComponentPropsWithoutRef<typeof el.div>, "onSelect"> {
    disabled?: boolean
  }

  const BaseMenuItem = forwardRef<MenuItemElement, BaseMenuItemProps>((props, forwardedRef) => {
    const { disabled, ...itemProps } = props
    const [isFocused, setIsFocused] = useState(false)
    const { onItemEnter, onItemLeave } = useContext(MenuContentContext)!

    return (
      <RovingFocusGroup.Item asChild focusable={!disabled}>
        <el.div
          data-highlighted={isFocused || undefined}
          data-disabled={disabled || undefined}
          {...itemProps}
          ref={forwardedRef}
          onMouseEnter={mergeEventHandlers(itemProps.onMouseEnter, event => {
            if (disabled) {
              onItemLeave()
            } else {
              onItemEnter(event)
            }
          })}
          onMouseLeave={mergeEventHandlers(itemProps.onMouseLeave, onItemLeave)}
          onFocus={composeEventHandlers(itemProps.onFocus, () => setIsFocused(true))}
          onBlur={composeEventHandlers(itemProps.onBlur, () => setIsFocused(false))}
        />
      </RovingFocusGroup.Item>
    )
  })

  BaseMenuItem.displayName = `BaseMenuItem <${scope.description}>`

  /* ---------------------------- Menu CheckboxItem --------------------------- */

  type CheckedState = boolean | "indeterminate"

  type MenuCheckboxItemElement = MenuItemElement

  interface MenuCheckboxItemProps extends MenuItemProps {
    checked?: CheckedState
    onCheckedChange?: (checked: boolean) => void
  }

  const MenuCheckboxItem = forwardRef<MenuCheckboxItemElement, MenuCheckboxItemProps>(
    (props, forwardedRef) => {
      const { checked = false, onCheckedChange, ...itemProps } = props
      return (
        <MenuItemIndicatorContext.Provider value={checked}>
          <MenuItem
            data-state={displayCheckedState(checked)}
            {...itemProps}
            ref={forwardedRef}
            onSelect={event => {
              return (
                itemProps.onSelect?.(event) ||
                onCheckedChange?.(checked === "indeterminate" ? true : !checked)
              )
            }}
          />
        </MenuItemIndicatorContext.Provider>
      )
    },
  )

  MenuCheckboxItem.displayName = `Menu.CheckboxItem <${scope.description}>`

  /* ----------------------------- Menu RadioGroup ---------------------------- */

  const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null)
  type MenuRadioGroupContextValue = {
    value: string | undefined
    onValueChange?: (value: string) => void
  }

  type MenuRadioGroupElement = MenuGroupElement
  interface MenuRadioGroupProps extends MenuGroupProps {
    value?: string
    onValueChange?: (value: string) => void
  }

  const MenuRadioGroup = forwardRef<MenuRadioGroupElement, MenuRadioGroupProps>(
    (props, forwardedRef) => {
      const { value, onValueChange, ...groupProps } = props
      return (
        <MenuRadioGroupContext.Provider
          value={useMemo(() => ({ value, onValueChange }), [value, onValueChange])}
        >
          <MenuGroup {...groupProps} ref={forwardedRef} />
        </MenuRadioGroupContext.Provider>
      )
    },
  )

  MenuRadioGroup.displayName = `Menu.RadioGroup <${scope.description}>`

  /* ----------------------------- Menu RadioItem ----------------------------- */

  type MenuRadioItemElement = MenuItemElement
  interface MenuRadioItemProps extends MenuItemProps {
    value: string
  }

  const MenuRadioItem = forwardRef<MenuRadioItemElement, MenuRadioItemProps>(
    (props, forwardedRef) => {
      const { value, ...itemProps } = props
      const { value: groupValue, onValueChange } = useContext(MenuRadioGroupContext)!
      const checked = value === groupValue

      return (
        <MenuItemIndicatorContext.Provider value={checked}>
          <MenuItem
            data-state={displayCheckedState(checked)}
            {...itemProps}
            ref={forwardedRef}
            onSelect={event => {
              return itemProps.onSelect?.(event) || onValueChange?.(value)
            }}
          />
        </MenuItemIndicatorContext.Provider>
      )
    },
  )

  MenuRadioItem.displayName = `Menu.RadioItem <${scope.description}>`

  /* --------------------------- Menu ItemIndicator --------------------------- */

  const MenuItemIndicatorContext = createContext<CheckedState | null>(null)

  type MenuItemIndicatorElement = React.ElementRef<typeof el.span>
  interface MenuItemIndicatorProps extends React.ComponentPropsWithoutRef<typeof el.span> {
    forceMount?: true
  }

  const MenuItemIndicator = forwardRef<MenuItemIndicatorElement, MenuItemIndicatorProps>(
    (props, forwardedRef) => {
      const { forceMount, ...indicatorProps } = props
      const checkState = useContext(MenuItemIndicatorContext)!

      return (
        (forceMount || checkState !== false) && (
          <el.span
            data-state={displayCheckedState(checkState)}
            {...indicatorProps}
            ref={forwardedRef}
          />
        )
      )
    },
  )

  MenuItemIndicator.displayName = `MenuItemIndicator <${scope.description}>`

  /* -------------------------------- Menu Sub -------------------------------- */

  const MenuSubContext = createContext<MenuSubContextValue | null>(null)
  type MenuSubContextValue = {
    triggerRef: React.RefObject<MenuSubTriggerElement>
    openTimerRef: React.MutableRefObject<number | undefined>
    closeTimerRef: React.MutableRefObject<number | undefined>
    isSubActive: boolean
    setSubActive: (active: boolean) => void
  }

  interface MenuSubProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
  }

  const MenuSub = (props: MenuSubProps) => {
    const { open: openProp, onOpenChange, children } = props
    const subId = useId()
    const { open: parentOpen, openedSubId, setOpenedSubId } = useContext(MenuContext)!
    const [childOpenedSubId, setChildOpenedSubId] = useState<string | null>(null)
    const triggerRef = useRef<MenuSubTriggerElement>(null)
    const openTimerRef = useRef<number | undefined>(undefined)
    const closeTimerRef = useRef<number | undefined>(undefined)
    const contentRef = useRef<MenuSubContentElement>(null)
    const [isSubActive, setSubActive] = useState(false)

    const [open, setOpen] = useControllableState({
      controlled: [
        openProp,
        useCallback(
          (open: boolean) => {
            onOpenChange?.(open)
            setOpenedSubId(open ? subId : null)
          },
          [subId],
        ),
      ],
      uncontrolled: [
        parentOpen && openedSubId === subId,
        useCallback((open: boolean) => setOpenedSubId(open ? subId : null), [subId]),
      ],
    })

    return (
      <Popper.Root>
        <MenuSubContext.Provider
          value={useMemo(
            () => ({
              triggerRef,
              openTimerRef,
              closeTimerRef,
              isSubActive,
              setSubActive,
            }),
            [isSubActive],
          )}
        >
          <MenuContext.Provider
            value={useMemo(
              () => ({
                open,
                setOpen,
                openedSubId: childOpenedSubId,
                setOpenedSubId: setChildOpenedSubId,
                contentRef,
              }),
              [open, setOpen, childOpenedSubId],
            )}
          >
            {children}
          </MenuContext.Provider>
        </MenuSubContext.Provider>
      </Popper.Root>
    )
  }

  MenuSub.displayName = `Menu.Sub <${scope.description}>`

  /* ----------------------------- Menu SubTrigger ---------------------------- */

  const OpenCloseDelay = 200

  type MenuSubTriggerElement = MenuItemElement
  interface MenuSubTriggerProps extends BaseMenuItemProps {}

  const MenuSubTrigger = forwardRef<MenuSubTriggerElement, MenuSubTriggerProps>(
    (props, forwardedRef) => {
      const { disabled = false, ...itemProps } = props
      const { triggerRef, openTimerRef, closeTimerRef, isSubActive } = useContext(MenuSubContext)!
      const contentRef = useContextSelector(MenuContext, ctx => ctx!.contentRef)
      const composedRef = useComposedRef(forwardedRef, triggerRef)

      const open = useContextSelector(MenuContext, ctx => ctx!.open)
      const setOpen = useContextSelector(MenuContext, ctx => ctx!.setOpen)
      const setOpenDebounce = (open: boolean) => {
        resetTimer(openTimerRef)
        resetTimer(closeTimerRef)
        const timerRef = open ? openTimerRef : closeTimerRef
        timerRef.current = window.setTimeout(() => {
          setOpen(open)
          timerRef.current = undefined
        }, OpenCloseDelay)
      }

      return (
        <MenuAnchor asChild>
          <BaseMenuItem
            data-state={open ? "open" : "closed"}
            data-active={isSubActive || undefined}
            {...itemProps}
            ref={composedRef}
            disabled={disabled}
            onMouseEnter={() => {
              if (disabled) return
              resetTimer(closeTimerRef)
              setOpenDebounce(true)
            }}
            onMouseLeave={event => {
              resetTimer(openTimerRef)
              if (!contentRef.current) return
              const itemReact = event.currentTarget.getBoundingClientRect()
              if (event.clientX <= itemReact.left || event.clientX >= itemReact.right) {
                const contentRect = contentRef.current.getBoundingClientRect()
                const contentSide = contentRect.right > itemReact.right ? "right" : "left"
                const mouseSide = event.clientX > itemReact.right ? "right" : "left"
                if (contentSide === mouseSide) return
              }
              setOpenDebounce(false)
            }}
            onKeyDown={event => {
              if (event.key === "Tab") event.preventDefault()
              if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
                setOpen(true)
                event.preventDefault()
              }
            }}
          />
        </MenuAnchor>
      )
    },
  )

  MenuSubTrigger.displayName = `Menu.SubTrigger <${scope.description}>`

  /* ----------------------------- Menu SubContent ---------------------------- */

  type MenuSubContentElement = MenuContentElement
  interface MenuSubContentProps
    extends Omit<
      BaseMenuContentProps,
      "side" | "align" | "returnFocus" | "autofocus" | "preventScrollOnFocus"
    > {}

  const MenuSubContent = forwardRef<MenuSubContentElement, MenuSubContentProps>(
    (props, forwardedRef) => {
      const { onFocusOutside, onPointerDownOutside, ...contentProps } = props
      const isTriggeredByKeyboardRef = useContextSelector(
        MenuRootContext,
        ctx => ctx!.isTriggeredByKeyboardRef,
      )
      const setOpen = useContextSelector(MenuContext, ctx => ctx!.setOpen)
      const triggerRef = useContextSelector(MenuSubContext, ctx => ctx!.triggerRef)
      const closeTimerRef = useContextSelector(MenuSubContext, ctx => ctx!.closeTimerRef)
      const setSubActive = useContextSelector(MenuSubContext, ctx => ctx!.setSubActive)

      return (
        <BaseMenuContent
          {...contentProps}
          ref={forwardedRef}
          align="start"
          side="right"
          autoFocus={isTriggeredByKeyboardRef.current === true}
          focusLock={false}
          scrollLock={false}
          disableOutsidePointerEvents={false}
          returnFocus={false}
          onKeyDown={composeEventHandlers(props.onKeyDown, event => {
            if (!event.currentTarget.contains(event.target as Node)) return
            if (event.key === "ArrowLeft") {
              setOpen(false)
              triggerRef.current?.focus({ preventScroll: true })
              event.preventDefault()
            }
          })}
          onMouseEnter={mergeEventHandlers(props.onMouseEnter, () => {
            setSubActive(true)
            resetTimer(closeTimerRef)
          })}
          onPointerDownOutside={event => {
            return onPointerDownOutside?.(event) || event.target === triggerRef.current
          }}
          onFocusOutside={event => {
            return onFocusOutside?.(event) || event.target === triggerRef.current
          }}
          onDismiss={reason => {
            setSubActive(false)
            switch (reason) {
              case "focus":
                if (closeTimerRef.current !== undefined) return
                closeTimerRef.current = window.setTimeout(() => {
                  setOpen(false)
                  closeTimerRef.current = undefined
                }, OpenCloseDelay)
                break
              default:
                setOpen(false)
            }
          }}
        />
      )
    },
  )

  MenuSubContent.displayName = `Menu.SubContent <${scope.description}>`

  /* ----------------------------- Menu Separator ----------------------------- */

  type MenuSeparatorElement = React.ElementRef<typeof el.div>
  interface MenuSeparatorProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const MenuSeparator = forwardRef<MenuSeparatorElement, MenuSeparatorProps>(
    (props, forwardedRef) => {
      return <el.div {...props} ref={forwardedRef} />
    },
  )

  MenuSeparator.displayName = `Menu.Separator <${scope.description}>`

  /* ------------------------------- Menu Group ------------------------------- */

  type MenuGroupElement = React.ElementRef<typeof el.div>
  interface MenuGroupProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const MenuGroup = forwardRef<MenuGroupElement, MenuGroupProps>((props, forwardedRef) => {
    return <el.div {...props} ref={forwardedRef} />
  })

  MenuGroup.displayName = `Menu.Group <${scope.description}>`

  /* ------------------------------- Menu label ------------------------------- */

  type MenuLabelElement = React.ElementRef<typeof el.div>
  interface MenuLabelProps extends React.ComponentPropsWithoutRef<typeof el.div> {}

  const MenuLabel = forwardRef<MenuLabelElement, MenuLabelProps>((props, forwardedRef) => {
    return <el.div {...props} ref={forwardedRef} />
  })

  MenuLabel.displayName = `Menu.Label <${scope.description}>`

  /* ------------------------------- Menu Arrow ------------------------------- */

  type MenuArrowElement = React.ElementRef<typeof Popper.Arrow>
  interface MenuArrowProps extends React.ComponentPropsWithoutRef<typeof Popper.Arrow> {}

  const MenuArrow = forwardRef<MenuArrowElement, MenuArrowProps>((props, forwardedRef) => {
    return <Popper.Arrow {...props} ref={forwardedRef} />
  })

  MenuArrow.displayName = `Menu.Arrow <${scope.description}>`

  return {
    Root: MenuRoot,
    Anchor: MenuAnchor,
    Portal: MenuPortal,
    Content: MenuContent,
    Item: MenuItem,
    CheckboxItem: MenuCheckboxItem,
    RadioGroup: MenuRadioGroup,
    RadioItem: MenuRadioItem,
    ItemIndicator: MenuItemIndicator,
    Sub: MenuSub,
    SubTrigger: MenuSubTrigger,
    SubContent: MenuSubContent,
    Separator: MenuSeparator,
    Group: MenuGroup,
    Label: MenuLabel,
    Arrow: MenuArrow,
  }
}

type FocusIntent = "first" | "last"


const MapKeyToFocusIntent: Record<string, FocusIntent | undefined> = {
  ArrowDown: "first", PageUp: "first", Home: "first",
  ArrowUp: "last", PageDown: "last", End: "last",
}

type CheckedState = boolean | "indeterminate"

function displayCheckedState(checked: CheckedState) {
  return checked === "indeterminate" ? "indeterminate" : checked ? "checked" : "unchecked"
}

function resetTimer(timerRef: React.MutableRefObject<number | undefined>) {
  window.clearTimeout(timerRef.current)
  timerRef.current = undefined
}
