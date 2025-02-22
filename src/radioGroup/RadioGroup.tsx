import { createRovingFocusGroup } from "#rovingFocusGroup"
import { useComposedRef } from "../hooks/useComposedRef"
import { useControllableState } from "../hooks/useControllableState"
import { usePrevious } from "../hooks/usePrevious"
import { useSize } from "../hooks/useSize"
import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from "react"

const RadioGroupScope = createScope("RadioGroup")

export const RadioGroup = createRadioGroup(RadioGroupScope)

export function createRadioGroup(scope: Scope) {
  const RovingFocusGroup = createRovingFocusGroup(scope)
  /* ----------------------------- RadioGroup Root ---------------------------- */

  const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)
  type RadioGroupContextValue = {
    name?: string
    required: boolean
    disabled: boolean
    value?: string
    setValue: (value: string) => void
  }

  type RadioGroupElement = React.ElementRef<typeof el.div>
  interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
  }

  const RadioGroupRoot = forwardRef<RadioGroupElement, RadioGroupProps>((props, forwardedRef) => {
    const {
      name,
      required = false,
      disabled = false,
      orientation,
      loop = true,
      value: valueProp,
      defaultValue,
      onValueChange,
      ...groupProps
    } = props
    const [value, setValue] = useControllableState({
      // @ts-expect-error onValueChange will never be called with undefined
      controlled: [valueProp, onValueChange],
      uncontrolled: useState(defaultValue),
    })

    return (
      <RadioGroupContext.Provider
        value={useMemo(
          () => ({
            name,
            required,
            disabled,
            value,
            setValue,
          }),
          [name, required, disabled, value, setValue],
        )}
      >
        <RovingFocusGroup.Root
          data-disabled={disabled || undefined}
          {...groupProps}
          ref={forwardedRef}
          orientation={orientation}
          loop={loop}
        />
      </RadioGroupContext.Provider>
    )
  })

  RadioGroupRoot.displayName = `RadioGroup.Root <${scope.description}>`

  /* ----------------------------- RadioGroup Item ---------------------------- */

  type RadioGroupItemElement = React.ElementRef<typeof Radio>
  interface RadioGroupItemProps extends Omit<RadioProps, "onCheck" | "name"> {
    value: string
  }

  const RadioGroupItem = forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
    (props, forwardedRef) => {
      const { value: itemValue, disabled, ...radioProps } = props
      const ctx = useContext(RadioGroupContext)!
      const checked = ctx.value === itemValue
      const isFocusedByKeyboardRef = useRef(false)

      useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
            isFocusedByKeyboardRef.current = true
          }
        }
        const handleKeyUp = () => (isFocusedByKeyboardRef.current = false)
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        return () => {
          document.removeEventListener("keydown", handleKeyDown)
          document.removeEventListener("keyup", handleKeyUp)
        }
      }, [])

      return (
        <RovingFocusGroup.Item asChild focusable={!disabled} active={checked}>
          <Radio
            {...radioProps}
            ref={forwardedRef}
            name={ctx.name}
            checked={checked}
            required={ctx.required}
            disabled={ctx.disabled || disabled}
            value={itemValue}
            onCheck={() => ctx.setValue(itemValue)}
            onKeyDown={composeEventHandlers(radioProps.onKeyDown, event => {
              if (event.key === "Enter") event.preventDefault()
            })}
            onFocus={composeEventHandlers(radioProps.onFocus, event => {
              if (isFocusedByKeyboardRef.current) event.currentTarget.click()
            })}
          />
        </RovingFocusGroup.Item>
      )
    },
  )

  RadioGroupItem.displayName = `RadioGroup.Item <${scope.description}>`

  const RadioContext = createContext<RadioContextValue | null>(null)
  type RadioContextValue = {
    checked: boolean
    disabled?: boolean
  }

  type RadioElement = React.ElementRef<typeof el.button>
  interface RadioProps extends React.ComponentPropsWithoutRef<typeof el.button> {
    checked?: boolean
    required?: boolean
    onCheck?: () => void
  }

  const Radio = forwardRef<RadioElement, RadioProps>(function Radio(props, forwardedRef) {
    const {
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props
    const [button, setButton] = useState<HTMLButtonElement | null>(null)
    const composedRef = useComposedRef(forwardedRef, setButton)
    const isFormControl = form !== undefined || !!button?.closest("form") || false
    const isPropagationStoppedRef = useRef(false)

    return (
      <RadioContext.Provider value={useMemo(() => ({ checked, disabled }), [checked, disabled])}>
        <el.button
          type="button"
          data-state={checked ? "checked" : "unchecked"}
          data-disabled={disabled || undefined}
          disabled={disabled}
          value={value}
          {...radioProps}
          ref={composedRef}
          onClick={composeEventHandlers(radioProps.onClick, event => {
            if (!checked) onCheck?.()
            if (isFormControl) {
              isPropagationStoppedRef.current = event.isPropagationStopped()
              event.stopPropagation()
            }
          })}
        />
        {isFormControl && (
          <NativeRadio
            control={button}
            bubbles={!isPropagationStoppedRef.current}
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={disabled}
            form={form}
            style={{ transform: "translateX(-100%)" }}
          />
        )}
      </RadioContext.Provider>
    )
  })

  interface RadioInputProps extends React.ComponentPropsWithoutRef<"input"> {
    checked: boolean
    control: HTMLButtonElement | null
    bubbles: boolean
  }

  function NativeRadio(props: RadioInputProps) {
    const { checked, control, bubbles = true, ...inputProps } = props
    const inputRef = useRef<HTMLInputElement | null>(null)
    const prevChecked = usePrevious(checked)
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
        type="radio"
        defaultChecked={checked}
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

  /* -------------------------- RadioGroup Indicator -------------------------- */

  type RadioGroupIndicatorElement = React.ElementRef<typeof el.span>
  interface RadioGroupIndicatorProps extends React.ComponentPropsWithoutRef<typeof el.span> {
    forceMount?: boolean
  }

  const RadioGroupIndicator = forwardRef<RadioGroupIndicatorElement, RadioGroupIndicatorProps>(
    (props, forwardedRef) => {
      const { forceMount, ...indicatorProps } = props
      const { checked, disabled } = useContext(RadioContext)!
      return (
        (forceMount || checked) && (
          <el.span
            data-state={checked ? "checked" : "unchecked"}
            data-disabled={disabled || undefined}
            {...indicatorProps}
            ref={forwardedRef}
          />
        )
      )
    },
  )

  RadioGroupIndicator.displayName = `RadioGroup.Indicator <${scope.description}>`

  return { Root: RadioGroupRoot, Item: RadioGroupItem, Indicator: RadioGroupIndicator }
}
