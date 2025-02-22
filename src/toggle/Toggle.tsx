import { useControllableState } from "../hooks/useControllableState"
import el from "../shared/polymorphic"
import { forwardRef, useState } from "react"

type ToggleElement = React.ElementRef<typeof el.button>
interface ToggleProps extends React.ComponentPropsWithoutRef<typeof el.button> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?(pressed: boolean): void
}

export const Toggle = forwardRef<ToggleElement, ToggleProps>((props, forwardedRef) => {
  const {
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    disabled,
    ...toggleProps
  } = props

  const [pressed, setPressed] = useControllableState({
    controlled: [pressedProp, onPressedChange],
    uncontrolled: useState(defaultPressed),
  })

  return (
    <el.button
      data-state={pressed ? "on" : "off"}
      data-disabled={disabled || undefined}
      disabled={disabled}
      {...toggleProps}
      ref={forwardedRef}
      onClick={() => setPressed(!pressed)}
    />
  )
})

Toggle.displayName = "Toggle"
