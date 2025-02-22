import { createMenu } from "#menu"
import { useCallbackRef } from "../hooks/useCallbackRef"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import type React from "react"
import { forwardRef, useMemo, useRef, useState } from "react"
import { createContext, useContextSelector } from "use-context-selector"

const ContextMenuScope = createScope("ContextMenu")

export const ContextMenu = createContextMenu(ContextMenuScope)

export function createContextMenu(scope: Scope) {
  const Menu = createMenu(scope)

  /* ---------------------------- ContextMenu Root ---------------------------- */

  const ContextMenuContext = createContext<ContextMenuContextValue | null>(null)
  type ContextMenuContextValue = {
    open: boolean
    onOpenChange: (open: boolean) => void
  }

  interface ContextMenuProps {
    children: React.ReactNode
    modal?: boolean
    onOpenChange?: (open: boolean) => void
  }

  const ContextMenuRoot = (props: ContextMenuProps) => {
    const { children, modal = true, onOpenChange } = props
    const [open, setOpen] = useState(false)
    const handleOpenChange = useCallbackRef(open => {
      setOpen(open)
      onOpenChange?.(open)
    })
    return (
      <ContextMenuContext.Provider
        value={useMemo(
          () => ({
            open,
            onOpenChange: handleOpenChange,
          }),
          [open],
        )}
      >
        <Menu.Root open={open} onOpenChange={handleOpenChange} modal={modal}>
          {children}
        </Menu.Root>
      </ContextMenuContext.Provider>
    )
  }

  ContextMenuRoot.displayName = `ContextMenu.Root <${scope.description}>`

  /* --------------------------- ContextMenu Trigger -------------------------- */

  type ContextMenuTriggerElement = React.ElementRef<typeof el.span>
  interface ContextMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof el.span> {
    disabled?: boolean
  }

  const ContextMenuTrigger = forwardRef<ContextMenuTriggerElement, ContextMenuTriggerProps>(
    (props, forwardedRef) => {
      const { disabled = false, ...triggerProps } = props
      const pointRef = useRef({ x: 0, y: 0 })
      const virtualRef = useRef({
        getBoundingClientRect: () => DOMRect.fromRect({ ...pointRef.current, width: 0, height: 0 }),
      })
      const open = useContextSelector(ContextMenuContext, ctx => ctx!.open)
      const onOpenChange = useContextSelector(ContextMenuContext, ctx => ctx!.onOpenChange)

      return (
        <>
          <Menu.Anchor virtualRef={virtualRef} />
          <el.span
            data-state={open ? "open" : "closed"}
            data-disabled={disabled || undefined}
            {...triggerProps}
            ref={forwardedRef}
            onContextMenu={
              disabled
                ? props.onContextMenu
                : composeEventHandlers(props.onContextMenu, event => {
                    pointRef.current = { x: event.clientX, y: event.clientY }
                    onOpenChange(true)
                    event.preventDefault()
                  })
            }
          />
        </>
      )
    },
  )

  ContextMenuTrigger.displayName = `ContextMenu.Trigger <${scope.description}>`

  /* --------------------------- ContextMenu Portal --------------------------- */

  interface ContextMenuPortalProps extends React.ComponentPropsWithoutRef<typeof Menu.Portal> {}

  const ContextMenuPortal = (props: ContextMenuPortalProps) => {
    return <Menu.Portal {...props} />
  }

  ContextMenuPortal.displayName = `ContextMenu.Portal <${scope.description}>`

  /* --------------------------- ContextMenu Content -------------------------- */

  type ContextMenuContentElement = React.ElementRef<typeof Menu.Content>
  interface ContextMenuContentProps
    extends Omit<
      React.ComponentPropsWithoutRef<typeof Menu.Content>,
      "onFocusInto" | "side" | "sideOffset" | "align"
    > {}

  const ContextMenuContent = forwardRef<ContextMenuContentElement, ContextMenuContentProps>(
    (props, forwardedRef) => {
      return (
        <Menu.Content {...props} ref={forwardedRef} side="right" align="start" sideOffset={2} />
      )
    },
  )

  ContextMenuContent.displayName = `ContextMenu.Content <${scope.description}>`

  /* ---------------------------- ContextMenu Item ---------------------------- */

  type ContextMenuItemElement = React.ElementRef<typeof Menu.Item>
  interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof Menu.Item> {}

  const ContextMenuItem = forwardRef<ContextMenuItemElement, ContextMenuItemProps>(
    (props, forwardedRef) => {
      return <Menu.Item {...props} ref={forwardedRef} />
    },
  )

  ContextMenuItem.displayName = `ContextMenu.Item <${scope.description}>`

  /* ------------------------ ContextMenu CheckboxItem ------------------------ */

  type ContextMenuCheckboxItemElement = React.ElementRef<typeof Menu.CheckboxItem>
  interface ContextMenuCheckboxItemProps
    extends React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem> {}

  const ContextMenuCheckboxItem = forwardRef<
    ContextMenuCheckboxItemElement,
    ContextMenuCheckboxItemProps
  >((props, forwardedRef) => {
    return <Menu.CheckboxItem {...props} ref={forwardedRef} />
  })

  ContextMenuCheckboxItem.displayName = `ContextMenu.CheckboxItem <${scope.description}>`

  /* ------------------------- ContextMenu RadioGroup ------------------------- */

  type ContextMenuRadioGroupElement = React.ElementRef<typeof Menu.RadioGroup>
  interface ContextMenuRadioGroupProps
    extends React.ComponentPropsWithoutRef<typeof Menu.RadioGroup> {}

  const ContextMenuRadioGroup = forwardRef<
    ContextMenuRadioGroupElement,
    ContextMenuRadioGroupProps
  >((props, forwardedRef) => {
    return <Menu.RadioGroup {...props} ref={forwardedRef} />
  })

  ContextMenuRadioGroup.displayName = `ContextMenu.RadioGroup <${scope.description}>`

  /* -------------------------- ContextMenu RadioItem ------------------------- */

  type ContextMenuRadioItemElement = React.ElementRef<typeof Menu.RadioItem>
  interface ContextMenuRadioItemProps
    extends React.ComponentPropsWithoutRef<typeof Menu.RadioItem> {}

  const ContextMenuRadioItem = forwardRef<ContextMenuRadioItemElement, ContextMenuRadioItemProps>(
    (props, forwardedRef) => {
      return <Menu.RadioItem {...props} ref={forwardedRef} />
    },
  )

  ContextMenuRadioItem.displayName = `ContextMenu.RadioItem <${scope.description}>`

  /* ------------------------ ContextMenu ItemIndicator ----------------------- */

  type ContextMenuItemIndicatorElement = React.ElementRef<typeof Menu.ItemIndicator>
  interface ContextMenuItemIndicatorProps
    extends React.ComponentPropsWithoutRef<typeof Menu.ItemIndicator> {}

  const ContextMenuItemIndicator = forwardRef<
    ContextMenuItemIndicatorElement,
    ContextMenuItemIndicatorProps
  >((props, forwardedRef) => {
    return <Menu.ItemIndicator {...props} ref={forwardedRef} />
  })

  ContextMenuItemIndicator.displayName = `ContextMenu.ItemIndicator <${scope.description}>`

  /* ----------------------------- ContextMenu Sub ---------------------------- */

  interface ContextMenuSubProps extends React.ComponentPropsWithoutRef<typeof Menu.Sub> {}

  const ContextMenuSub = (props: ContextMenuSubProps) => {
    return <Menu.Sub {...props} />
  }

  ContextMenuSub.displayName = `ContextMenu.Sub <${scope.description}>`

  /* ------------------------- ContextMenu SubTrigger ------------------------- */

  type ContextMenuSubTriggerElement = React.ElementRef<typeof Menu.SubTrigger>
  interface ContextMenuSubTriggerProps
    extends React.ComponentPropsWithoutRef<typeof Menu.SubTrigger> {}

  const ContextMenuSubTrigger = forwardRef<
    ContextMenuSubTriggerElement,
    ContextMenuSubTriggerProps
  >((props, forwardedRef) => {
    return <Menu.SubTrigger {...props} ref={forwardedRef} />
  })

  ContextMenuSubTrigger.displayName = `ContextMenu.SubTrigger <${scope.description}>`

  /* ------------------------- ContextMenu SubContent ------------------------- */

  type ContextMenuSubContentElement = React.ElementRef<typeof Menu.SubContent>
  interface ContextMenuSubContentProps
    extends React.ComponentPropsWithoutRef<typeof Menu.SubContent> {}

  const ContextMenuSubContent = forwardRef<
    ContextMenuSubContentElement,
    ContextMenuSubContentProps
  >((props, forwardedRef) => {
    return <Menu.SubContent {...props} ref={forwardedRef} />
  })

  ContextMenuSubContent.displayName = `ContextMenu.SubContent <${scope.description}>`

  /* -------------------------- ContextMenu Separator ------------------------- */

  type ContextMenuSeparatorElement = React.ElementRef<typeof Menu.Separator>
  interface ContextMenuSeparatorProps
    extends React.ComponentPropsWithoutRef<typeof Menu.Separator> {}

  const ContextMenuSeparator = forwardRef<ContextMenuSeparatorElement, ContextMenuSeparatorProps>(
    (props, forwardedRef) => {
      return <Menu.Separator {...props} ref={forwardedRef} />
    },
  )

  ContextMenuSeparator.displayName = `ContextMenu.Separator <${scope.description}>`

  /* ---------------------------- ContextMenu Group --------------------------- */

  type ContextMenuGroupElement = React.ElementRef<typeof Menu.Group>
  interface ContextMenuGroupProps extends React.ComponentPropsWithoutRef<typeof Menu.Group> {}

  const ContextMenuGroup = forwardRef<ContextMenuGroupElement, ContextMenuGroupProps>(
    (props, forwardedRef) => {
      return <Menu.Group {...props} ref={forwardedRef} />
    },
  )

  ContextMenuGroup.displayName = `ContextMenu.Group <${scope.description}>`

  /* ---------------------------- ContextMenu Label --------------------------- */

  type ContextMenuLabelElement = React.ElementRef<typeof Menu.Label>
  interface ContextMenuLabelProps extends React.ComponentPropsWithoutRef<typeof Menu.Label> {}

  const ContextMenuLabel = forwardRef<ContextMenuLabelElement, ContextMenuLabelProps>(
    (props, forwardedRef) => {
      return <Menu.Label {...props} ref={forwardedRef} />
    },
  )

  ContextMenuLabel.displayName = `ContextMenu.Label <${scope.description}>`

  /* ---------------------------- ContextMenu Arrow --------------------------- */

  type ContextMenuArrowElement = React.ElementRef<typeof Menu.Arrow>
  interface ContextMenuArrowProps extends React.ComponentPropsWithoutRef<typeof Menu.Arrow> {}

  const ContextMenuArrow = forwardRef<ContextMenuArrowElement, ContextMenuArrowProps>(
    (props, forwardedRef) => {
      return <Menu.Arrow {...props} ref={forwardedRef} />
    },
  )

  ContextMenuArrow.displayName = `ContextMenu.Arrow <${scope.description}>`

  return {
    Root: ContextMenuRoot,
    Trigger: ContextMenuTrigger,
    Portal: ContextMenuPortal,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    CheckboxItem: ContextMenuCheckboxItem,
    RadioGroup: ContextMenuRadioGroup,
    RadioItem: ContextMenuRadioItem,
    ItemIndicator: ContextMenuItemIndicator,
    Sub: ContextMenuSub,
    SubTrigger: ContextMenuSubTrigger,
    SubContent: ContextMenuSubContent,
    Separator: ContextMenuSeparator,
    Group: ContextMenuGroup,
    Label: ContextMenuLabel,
    Arrow: ContextMenuArrow,
  }
}
