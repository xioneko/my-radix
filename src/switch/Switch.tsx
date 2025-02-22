import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { usePrevious } from "../hooks/usePrevious"
import { useSize } from "../hooks/useSize"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react"

const SwitchScope = createScope("Switch")

export const Switch = createSwitch(SwitchScope)

export function createSwitch(scope: Scope) {
  /* ------------------------------- Switch Root ------------------------------ */

  const SwitchContext = createContext<SwitchContextValue | null>(null)
  type SwitchContextValue = {
    checked: boolean
    disabled?: boolean
  }

  type SwitchElement = React.ElementRef<typeof el.button>
  interface SwitchProps extends React.ComponentPropsWithoutRef<typeof el.button> {
    checked?: boolean
    defaultChecked?: boolean
    required?: boolean
    onCheckedChange?(checked: boolean): void
  }

  const SwitchRoot = forwardRef<SwitchElement, SwitchProps>((props, forwardedRef) => {
    const {
      name,
      checked: checkedProp,
      defaultChecked = false,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props
    const [button, setButton] = useState<HTMLButtonElement | null>(null)
    const composedRef = useComposedRef(forwardedRef, setButton)
    const [checked, setChecked] = useControllableState({
      controlled: [checkedProp, onCheckedChange],
      uncontrolled: useState(defaultChecked),
    })
    const isFormControl = form !== undefined || !!button?.closest("form") || false
    const isPropagationStoppedRef = useRef(false)

    return (
      <SwitchContext.Provider value={useMemo(() => ({ checked, disabled }), [checked, disabled])}>
        <el.button
          type="button"
          data-state={checked ? "checked" : "unchecked"}
          data-disabled={disabled || undefined}
          disabled={disabled}
          {...switchProps}
          ref={composedRef}
          onClick={composeEventHandlers(props.onClick, event => {
            setChecked(!checked)
            if (isFormControl) {
              isPropagationStoppedRef.current = event.isPropagationStopped()
              event.stopPropagation()
            }
          })}
        />
        {isFormControl && (
          <NativeSwitch
            control={button}
            bubbles={!isPropagationStoppedRef.current}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            required={required}
            disabled={disabled}
            form={form}
            style={{ transform: "translateX(-100%)" }}
          />
        )}
      </SwitchContext.Provider>
    )
  })

  SwitchRoot.displayName = `Switch.Root <${scope.description}>`

  interface SwitchInputProps extends React.ComponentPropsWithoutRef<"input"> {
    checked: boolean
    defaultChecked: boolean
    control: SwitchElement | null
    bubbles: boolean
  }

  function NativeSwitch(props: SwitchInputProps) {
    const { checked, control, bubbles = true, defaultChecked, ...inputProps } = props
    const prevChecked = usePrevious(checked)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const controlSize = useSize(control)

    useEffect(() => {
      const input = inputRef.current!
      // in order to trigger the form change event
      const setChecked = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "checked",
      )!.set
      if (prevChecked !== checked && setChecked) {
        setChecked.call(input, checked)
        const event = new Event("click", { bubbles })
        input.dispatchEvent(event)
      }
    }, [checked, prevChecked, bubbles])

    return (
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        tabIndex={-1}
        {...inputProps}
        ref={inputRef}
        style={{
          ...inputProps.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
        }}
        onClick={() => {
          console.log("onClick")
        }}
        onChange={() => {
          console.log("onChange")
        }}
      />
    )
  }

  /* ------------------------------ Switch Thumb ------------------------------ */

  type SwitchThumbElement = React.ElementRef<typeof el.span>
  interface SwitchThumbProps extends React.ComponentPropsWithoutRef<typeof el.span> {}

  const SwitchThumb = forwardRef<SwitchThumbElement, SwitchThumbProps>((props, forwardedRef) => {
    const { checked, disabled } = useContext(SwitchContext)!
    return (
      <el.span
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        {...props}
        ref={forwardedRef}
      />
    )
  })

  SwitchThumb.displayName = `Switch.Thumb <${scope.description}>`

  return { Root: SwitchRoot, Thumb: SwitchThumb }
}
