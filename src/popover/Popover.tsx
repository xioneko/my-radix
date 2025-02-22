import { DismissableLayer } from "#dismissableLayer"
import { createPopper } from "#popper"
import { Portal } from "#portal"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import type { ReactFocusLockProps } from "react-focus-lock"
import { FocusOn } from "react-focus-on"
import { createContext, useContextSelector } from "use-context-selector"

const PopoverScope = createScope("Popover")

export const Popover = createPopover(PopoverScope)

function createPopover(scope: Scope) {
  const Popper = createPopper(scope)

  /* ------------------------------ Popover Root ------------------------------ */

  type PopoverRootContextValue = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    modal: boolean
    hasCustomAnchor: boolean
    setHasCustomAnchor: (hasCustomAnchor: boolean) => void
    triggerRef: React.RefObject<HTMLButtonElement>
  }

  const PopoverRootContext = createContext<PopoverRootContextValue | null>(null)

  interface PopoverRootProps {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    modal?: boolean
    children?: React.ReactNode
  }

  const PopoverRoot = (props: PopoverRootProps) => {
    const { children, open: openProp, defaultOpen = false, onOpenChange, modal = false } = props
    const [open, setOpen] = useControllableState({
      controlled: [openProp, onOpenChange],
      uncontrolled: useState(defaultOpen),
    })
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [hasCustomAnchor, setHasCustomAnchor] = useState(false)
    return (
      <Popper.Root>
        <PopoverRootContext.Provider
          value={useMemo(
            () => ({
              open,
              setOpen,
              modal,
              hasCustomAnchor,
              setHasCustomAnchor,
              triggerRef,
            }),
            [open, setOpen, modal, hasCustomAnchor],
          )}
        >
          {children}
        </PopoverRootContext.Provider>
      </Popper.Root>
    )
  }

  PopoverRoot.displayName = `Popover.Root <${scope.description}>`

  /* ----------------------------- Popover Anchor ----------------------------- */

  type PopoverAnchorElement = React.ElementRef<typeof Popper.Anchor>
  interface PopoverAnchorProps extends React.ComponentPropsWithoutRef<typeof Popper.Anchor> {}

  const PopoverAnchor = forwardRef<PopoverAnchorElement, PopoverAnchorProps>(
    (props, forwardedRef) => {
      const setHasCustomAnchor = useContextSelector(
        PopoverRootContext,
        ctx => ctx!.setHasCustomAnchor,
      )
      useEffect(() => {
        setHasCustomAnchor(true)
        return () => setHasCustomAnchor(false)
      }, [])
      return <Popper.Anchor {...props} ref={forwardedRef} />
    },
  )

  PopoverAnchor.displayName = `Popover.Anchor <${scope.description}>`

  /* ----------------------------- Popover Trigger ----------------------------- */

  type PopoverTriggerElement = React.ElementRef<typeof el.button>
  interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<typeof el.button> {}

  const PopoverTrigger = forwardRef<PopoverTriggerElement, PopoverTriggerProps>(
    (props, forwardedRef) => {
      const triggerRef = useContextSelector(PopoverRootContext, ctx => ctx!.triggerRef)
      const composedRef = useComposedRef(forwardedRef, triggerRef)
      const isOpen = useContextSelector(PopoverRootContext, ctx => ctx!.open)
      const setOpen = useContextSelector(PopoverRootContext, ctx => ctx!.setOpen)
      const hasCustomAnchor = useContextSelector(PopoverRootContext, ctx => ctx!.hasCustomAnchor)

      const Trigger = (
        <el.button
          {...props}
          data-state={isOpen ? "open" : "closed"}
          ref={composedRef}
          onClick={composeEventHandlers(props.onClick, () => setOpen(!isOpen))}
        />
      )

      return hasCustomAnchor ? Trigger : <Popper.Anchor asChild>{Trigger}</Popper.Anchor>
    },
  )

  PopoverTrigger.displayName = `Popover.Trigger <${scope.description}>`

  /* ----------------------------- Popover Portal ----------------------------- */

  interface PopoverPortalProps {
    children?: React.ReactNode
    container?: Element | DocumentFragment | null
  }

  const PopoverPortal = (props: PopoverPortalProps) => {
    const { children, container } = props
    return (
      <Portal asChild container={container}>
        {children}
      </Portal>
    )
  }

  PopoverPortal.displayName = `Popover.Portal <${scope.description}>`

  /* ----------------------------- Popover Content ---------------------------- */

  type PopoverContentElement = React.ElementRef<typeof Popper.Content>
  interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof Popper.Content> {
    forceMount?: boolean
    autoFocus?: boolean
    returnFocus?: ReactFocusLockProps["returnFocus"]
    onPointDownOutside?: (event: PointerEvent) => boolean | void
    onEscapeKeyDown?: (event: KeyboardEvent) => boolean | void
    onFocusOutside?: (event: FocusEvent) => boolean | void
  }

  const PopoverContent = forwardRef<PopoverContentElement, PopoverContentProps>(
    (props, forwardedRef) => {
      const {
        forceMount = false,
        autoFocus = true,
        returnFocus = true,
        onPointDownOutside,
        onEscapeKeyDown,
        onFocusOutside,
        ...contentProps
      } = props
      const isOpen = useContextSelector(PopoverRootContext, ctx => ctx!.open)
      const setOpen = useContextSelector(PopoverRootContext, ctx => ctx!.setOpen)
      const modal = useContextSelector(PopoverRootContext, ctx => ctx!.modal)
      const triggerRef = useContextSelector(PopoverRootContext, ctx => ctx!.triggerRef)
      return (
        (forceMount || isOpen) && (
          <FocusOn
            enabled={isOpen}
            focusLock={modal}
            scrollLock={modal}
            autoFocus={autoFocus}
            returnFocus={returnFocus}
            preventScrollOnFocus={!modal}
            noIsolation
          >
            <DismissableLayer
              asChild
              disableOutsidePointerEvents={modal}
              onPointerDownOutside={event => {
                const targetIsTrigger = triggerRef.current?.contains(event.target as Node)
                // Trigger will handle the click
                if (targetIsTrigger) return true
                return !!onPointDownOutside?.(event)
              }}
              onEscapeKeyDown={onEscapeKeyDown}
              onFocusOutside={onFocusOutside}
              onDismiss={() => setOpen(false)}
            >
              <Popper.Content {...contentProps} ref={forwardedRef} />
            </DismissableLayer>
          </FocusOn>
        )
      )
    },
  )

  PopoverContent.displayName = `Popover.Content <${scope.description}>`

  /* ----------------------------- Popover Close ------------------------------ */

  type PopoverCloseElement = React.ElementRef<typeof el.button>
  interface PopoverCloseProps extends React.ComponentPropsWithoutRef<typeof el.button> {}

  const PopoverClose = forwardRef<PopoverCloseElement, PopoverCloseProps>((props, forwardedRef) => {
    const setOpen = useContextSelector(PopoverRootContext, ctx => ctx!.setOpen)
    return (
      <el.button
        {...props}
        onClick={composeEventHandlers(props.onClick, () => setOpen(false))}
        ref={forwardedRef}
      />
    )
  })

  PopoverClose.displayName = `Popover.Close <${scope.description}>`

  /* ------------------------------ Popover Arrow ----------------------------- */

  type PopoverArrowElement = React.ElementRef<typeof Popper.Arrow>
  interface PopoverArrowProps extends React.ComponentPropsWithoutRef<typeof Popper.Arrow> {}

  const PopoverArrow = forwardRef<PopoverArrowElement, PopoverArrowProps>((props, forwardedRef) => {
    return <Popper.Arrow {...props} ref={forwardedRef} />
  })

  PopoverArrow.displayName = `Popover.Arrow <${scope.description}>`

  return {
    Root: PopoverRoot,
    Anchor: PopoverAnchor,
    Trigger: PopoverTrigger,
    Portal: PopoverPortal,
    Content: PopoverContent,
    Close: PopoverClose,
    Arrow: PopoverArrow,
  }
}
