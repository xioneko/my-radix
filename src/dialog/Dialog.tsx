import { DismissableLayer } from "#dismissableLayer"
import { Portal } from "#portal"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { Children, forwardRef, useMemo, useRef, useState } from "react"
import { FocusOn } from "react-focus-on"
import type { ReactFocusOnProps } from "react-focus-on/dist/es5/types"
import { createContext, useContext, useContextSelector } from "use-context-selector"

const DialogScope = createScope("Dialog")

export const Dialog = createDialog(DialogScope)

export function createDialog(scope: Scope) {
  /* ------------------------------- Dialog Root ------------------------------ */

  const DialogContext = createContext<DialogContextValue | null>(null)
  type DialogContextValue = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    modal: boolean
    triggerRef: React.RefObject<HTMLButtonElement>
    overlayRef: React.RefObject<DialogContentElement>
  }

  interface DialogRootProps {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    modal?: boolean
    children?: React.ReactNode
  }

  const DialogRoot = (props: DialogRootProps) => {
    const { children, open: openProp, defaultOpen = false, onOpenChange, modal = true } = props
    const triggerRef = useRef<HTMLButtonElement>(null)
    const overlayRef = useRef<DialogContentElement>(null)
    const [open, setOpen] = useControllableState({
      controlled: [openProp, onOpenChange],
      uncontrolled: useState(defaultOpen),
    })

    return (
      <DialogContext.Provider
        value={useMemo(
          () => ({
            open,
            setOpen,
            modal,
            triggerRef,
            overlayRef,
          }),
          [open, setOpen, modal],
        )}
      >
        {children}
      </DialogContext.Provider>
    )
  }

  DialogRoot.displayName = `Dialog.Root <${scope.description}>`

  /* ----------------------------- Dialog Trigger ----------------------------- */

  type DialogTriggerElement = React.ElementRef<typeof el.button>
  interface DialogTriggerProps extends React.ComponentPropsWithoutRef<typeof el.button> {}

  const DialogTrigger = forwardRef<DialogTriggerElement, DialogTriggerProps>(
    (props, forwardedRef) => {
      const triggerRef = useContextSelector(DialogContext, ctx => ctx!.triggerRef)
      const composedRef = useComposedRef(forwardedRef, triggerRef)
      const open = useContextSelector(DialogContext, ctx => ctx!.open)
      const setOpen = useContextSelector(DialogContext, ctx => ctx!.setOpen)

      return (
        <el.button
          data-state={open ? "open" : "closed"}
          {...props}
          ref={composedRef}
          onClick={composeEventHandlers(props.onClick, () => {
            setOpen(open => !open)
          })}
        />
      )
    },
  )

  DialogTrigger.displayName = `Dialog.Trigger <${scope.description}>`

  /* ------------------------------ Dialog Portal ----------------------------- */

  interface DialogPortalProps {
    container?: Element | DocumentFragment | null
    children: React.ReactNode
  }

  const DialogPortal = (props: DialogPortalProps) => {
    const { children, container } = props
    // eslint-disable-next-line react/jsx-key
    return Children.map(children, child => {
      return (
        <Portal container={container} asChild>
          {child}
        </Portal>
      )
    })
  }

  DialogPortal.displayName = `Dialog.Portal <${scope.description}>`

  /* ----------------------------- Dialog Overlay ----------------------------- */

  type DialogOverlayElement = React.ElementRef<typeof el.div>
  interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    forceMount?: boolean
  }

  const DialogOverlay = forwardRef<DialogOverlayElement, DialogOverlayProps>(
    (props, forwardedRef) => {
      const { forceMount, ...overlayProps } = props
      const open = useContextSelector(DialogContext, ctx => ctx!.open)
      const modal = useContextSelector(DialogContext, ctx => ctx!.modal)
      const overlayRef = useContextSelector(DialogContext, ctx => ctx!.overlayRef)
      const composedRef = useComposedRef(forwardedRef, overlayRef)

      return modal
        ? (forceMount || open) && (
            <el.div
              {...overlayProps}
              style={{
                pointerEvents: "auto", // allow scrolling inside overlay
                ...overlayProps.style,
              }}
              ref={composedRef}
            />
          )
        : null
    },
  )

  DialogOverlay.displayName = `Dialog.Overlay <${scope.description}>`

  /* ----------------------------- Dialog Content ----------------------------- */

  type DialogContentElement = React.ElementRef<typeof DismissableLayer>
  interface DialogContentProps
    extends Omit<React.ComponentPropsWithoutRef<typeof DismissableLayer>, "onDismiss"> {
    forceMount?: boolean
    autoFocus?: boolean
    returnFocus?: ReactFocusOnProps["returnFocus"]
    preventScrollOnFocus?: boolean
  }

  const DialogContent = forwardRef<DialogContentElement, DialogContentProps>(
    (props, forwardedRef) => {
      const {
        forceMount,
        autoFocus = true,
        returnFocus = true,
        preventScrollOnFocus,
        ...contentProps
      } = props
      const { open, modal, setOpen, overlayRef, triggerRef } = useContext(DialogContext)!

      return (
        (forceMount || open) && (
          <FocusOn
            enabled={open}
            focusLock={modal}
            scrollLock={modal}
            autoFocus={autoFocus}
            returnFocus={returnFocus}
            preventScrollOnFocus={preventScrollOnFocus}
            shards={[overlayRef]}
          >
            <DismissableLayer
              {...contentProps}
              ref={forwardedRef}
              disableOutsidePointerEvents={modal}
              onPointerDownOutside={event => {
                const isRightClick = event.button === 2 || (event.ctrlKey && event.button === 0)
                return (
                  contentProps.onPointerDownOutside?.(event) ||
                  (modal ? isRightClick : triggerRef.current?.contains(event.target as Node))
                )
              }}
              onFocusOutside={event => {
                return (
                  contentProps.onFocusOutside?.(event) ||
                  modal ||
                  triggerRef.current?.contains(event.target as Node)
                )
              }}
              onDismiss={() => setOpen(false)}
            />
          </FocusOn>
        )
      )
    },
  )

  DialogContent.displayName = `Dialog.Content <${scope.description}>`

  /* ------------------------------ Dialog Title ------------------------------ */

  type DialogTitleElement = React.ElementRef<typeof el.h2>
  interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof el.h2> {}

  const DialogTitle = forwardRef<DialogTitleElement, DialogTitleProps>((props, forwardedRef) => {
    return <el.h2 {...props} ref={forwardedRef} />
  })

  DialogTitle.displayName = `Dialog.Title <${scope.description}>`

  /* --------------------------- Dialog Description --------------------------- */

  type DialogDescriptionElement = React.ElementRef<typeof el.p>
  interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof el.p> {}

  const DialogDescription = forwardRef<DialogDescriptionElement, DialogDescriptionProps>(
    (props, forwardedRef) => {
      return <el.p {...props} ref={forwardedRef} />
    },
  )

  DialogDescription.displayName = `Dialog.Description <${scope.description}>`

  /* ------------------------------ Dialog Close ------------------------------ */

  type DialogCloseElement = React.ElementRef<typeof el.button>
  interface DialogCloseProps extends React.ComponentPropsWithoutRef<typeof el.button> {}

  const DialogClose = forwardRef<DialogCloseElement, DialogCloseProps>((props, forwardedRef) => {
    const setOpen = useContextSelector(DialogContext, ctx => ctx!.setOpen)
    return (
      <el.button
        {...props}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => setOpen(false))}
      />
    )
  })

  DialogClose.displayName = `Dialog.Close <${scope.description}>`

  return {
    Root: DialogRoot,
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
  }
}
