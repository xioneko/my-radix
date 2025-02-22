import { useCallbackRef } from "../hooks/useCallbackRef"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { usePrevious } from "../hooks/usePrevious"
import { useSize } from "../hooks/useSize"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react"

const Scope = createScope("Checkbox")

export const Checkbox = createCheckbox(Scope)

export function createCheckbox(scope: Scope) {
  /* ------------------------------ Checkbox Root ----------------------------- */

  const CheckboxContext = createContext<CheckboxContextValue | null>(null)
  type CheckboxContextValue = {
    state: CheckedState
    disabled?: boolean
  }

  type CheckboxElement = React.ElementRef<typeof el.button>
  interface CheckboxProps
    extends Omit<React.ComponentPropsWithoutRef<typeof el.button>, "checked" | "defaultChecked"> {
    checked?: CheckedState
    defaultChecked?: CheckedState
    required?: boolean
    onCheckedChange?(checked: CheckedState): void
  }

  const CheckboxRoot = forwardRef<CheckboxElement, CheckboxProps>((props, forwardedRef) => {
    const {
      name,
      checked: checkedProp,
      defaultChecked = false,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...checkboxProps
    } = props
    const [button, setButton] = useState<HTMLButtonElement | null>(null)
    const composedRef = useComposedRef(forwardedRef, setButton)
    const [checked, setChecked] = useControllableState({
      controlled: [checkedProp, onCheckedChange],
      uncontrolled: useState(defaultChecked),
    })

    const isFormControl = form !== undefined || !!button?.closest("form") || false
    const isPropagationStoppedRef = useRef(false)
    const initialChecked = useRef(checked)

    return (
      <CheckboxContext.Provider
        value={useMemo(() => ({ state: checked, disabled }), [checked, disabled])}
      >
        <el.button
          type="button"
          data-state={displayCheckedState(checked)}
          data-disabled={disabled || undefined}
          disabled={disabled}
          value={value}
          {...checkboxProps}
          ref={composedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, event => {
            if (event.key === "Enter") event.preventDefault()
          })}
          onClick={composeEventHandlers(props.onClick, event => {
            setChecked(prev => (prev === "indeterminate" ? true : !prev))
            if (isFormControl) {
              isPropagationStoppedRef.current = event.isPropagationStopped()
              // CheckboxInput will handle the event propagation
              event.stopPropagation()
            }
          })}
        />
        {isFormControl && (
          <NativeCheckbox
            control={button}
            bubbles={!isPropagationStoppedRef.current}
            name={name}
            checked={checked}
            reset={() => {
              console.log("reset", initialChecked.current)
              setChecked(initialChecked.current)
            }}
            value={value}
            required={required}
            disabled={disabled}
            form={form}
            style={{ transform: "translateX(-100%)" }}
          />
        )}
      </CheckboxContext.Provider>
    )
  })

  CheckboxRoot.displayName = `Checkbox.Root <${scope.description}>`

  interface CheckboxInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "checked"> {
    checked: CheckedState
    control: CheckboxElement | null
    bubbles: boolean
    reset(): void
  }

  function NativeCheckbox(props: CheckboxInputProps) {
    const { checked, control, bubbles, reset, ...inputProps } = props
    const prevChecked = usePrevious(checked)
    const inputRef = useRef<HTMLInputElement>(null)
    const controlSize = useSize(control)
    const handleReset = useCallbackRef(reset)

    useEffect(() => {
      const input = inputRef.current!
      // in order to trigger the form change event
      const setChecked = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "checked",
      )!.set
      if (prevChecked !== checked && setChecked) {
        setChecked.call(input, checked === "indeterminate" ? false : checked)
        input.indeterminate = checked === "indeterminate"
        const event = new Event("click", { bubbles })
        input.dispatchEvent(event)
      }
    }, [checked, prevChecked, bubbles])

    useEffect(() => {
      const form = control?.form
      if (form) {
        form.addEventListener("reset", handleReset)
        return () => form.removeEventListener("reset", handleReset)
      }
    }, [control])

    return (
      <input
        type="checkbox"
        defaultChecked={checked === "indeterminate" ? false : checked}
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
      />
    )
  }

  /* --------------------------- Checkbox Indicator --------------------------- */

  type CheckboxIndicatorElement = React.ElementRef<typeof el.span>
  interface CheckboxIndicatorProps extends React.ComponentPropsWithoutRef<typeof el.span> {
    forceMount?: boolean
  }

  const CheckboxIndicator = forwardRef<CheckboxIndicatorElement, CheckboxIndicatorProps>(
    (props, forwardedRef) => {
      const { forceMount, ...indicatorProps } = props
      const { state, disabled } = useContext(CheckboxContext)!

      return (
        (forceMount || state !== false) && (
          <el.span
            data-state={displayCheckedState(state)}
            data-disabled={disabled || undefined}
            {...indicatorProps}
            ref={forwardedRef}
            style={{
              pointerEvents: "none",
              ...indicatorProps.style,
            }}
          />
        )
      )
    },
  )

  CheckboxIndicator.displayName = `Checkbox.Indicator <${scope.description}>`

  return { Root: CheckboxRoot, Indicator: CheckboxIndicator }
}

type CheckedState = boolean | "indeterminate"

function displayCheckedState(checked: CheckedState) {
  return checked === "indeterminate" ? "indeterminate" : checked ? "checked" : "unchecked"
}
