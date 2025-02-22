import { createCheckbox } from "#checkbox"
import { createRovingFocusGroup } from "#rovingFocusGroup"
import { useControllableState } from "../hooks/useControllableState"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { createContext, forwardRef, useContext, useMemo, useState } from "react"

const CheckboxGroupScope = createScope("CheckboxGroup")

export const CheckboxGroup = createCheckboxGroup(CheckboxGroupScope)

export function createCheckboxGroup(scope: Scope) {
  const Checkbox = createCheckbox(scope)
  const RovingFocusGroup = createRovingFocusGroup(scope)

  /* --------------------------- CheckboxGroup Root --------------------------- */

  const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)
  type CheckboxGroupContextValue = {
    name?: string
    required: boolean
    disabled: boolean
    value?: string[]
    onItemCheck: (value: string) => void
    onItemUncheck: (value: string) => void
  }

  type CheckboxGroupElement = React.ElementRef<typeof el.div>
  interface CheckboxGroupProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    defaultValue?: string[]
    value?: string[]
    onValueChange?: (value: string[]) => void
  }

  const CheckboxGroupRoot = forwardRef<CheckboxGroupElement, CheckboxGroupProps>(
    (props, forwardedRef) => {
      const {
        name,
        defaultValue = [],
        value: valueProp,
        required = false,
        disabled = false,
        orientation,
        loop = false,
        onValueChange,
        ...groupProps
      } = props
      const [value, setValue] = useControllableState({
        controlled: [valueProp, onValueChange],
        uncontrolled: useState(defaultValue),
      })

      return (
        <CheckboxGroupContext.Provider
          value={useMemo(
            () => ({
              name,
              required,
              disabled,
              value,
              onItemCheck: value => setValue(prev => [...prev, value]),
              onItemUncheck: value => setValue(prev => prev.filter(v => v !== value)),
            }),
            [name, required, disabled, value, setValue],
          )}
        >
          <RovingFocusGroup.Root
            data-disabled={disabled || undefined}
            orientation={orientation}
            loop={loop}
            {...groupProps}
            ref={forwardedRef}
          />
        </CheckboxGroupContext.Provider>
      )
    },
  )

  CheckboxGroupRoot.displayName = `CheckboxGroup.Root <${scope.description}>`

  /* --------------------------- CheckboxGroup Item --------------------------- */

  type CheckboxGroupItemElement = React.ElementRef<typeof Checkbox.Root>
  interface CheckboxGroupItemProps
    extends Omit<
      React.ComponentPropsWithoutRef<typeof Checkbox.Root>,
      "checked" | "defaultChecked" | "onCheckedChange" | "name"
    > {
    value: string
  }

  const CheckboxGroupItem = forwardRef<CheckboxGroupItemElement, CheckboxGroupItemProps>(
    (props, forwardedRef) => {
      const { disabled: itemDisabled, value: itemValue, ...itemProps } = props
      const ctx = useContext(CheckboxGroupContext)!
      const checked = ctx.value?.includes(itemValue) ?? false
      const disabled = ctx.disabled || itemDisabled

      return (
        <RovingFocusGroup.Item focusable={!disabled} active={checked} asChild>
          <Checkbox.Root
            name={ctx.name}
            disabled={disabled}
            required={ctx.required}
            checked={checked}
            value={itemValue}
            {...itemProps}
            ref={forwardedRef}
            onCheckedChange={checked => {
              if (checked) {
                ctx.onItemCheck(itemValue)
              } else {
                ctx.onItemUncheck(itemValue)
              }
            }}
          />
        </RovingFocusGroup.Item>
      )
    },
  )

  CheckboxGroupItem.displayName = `CheckboxGroup.Item <${scope.description}>`

  /* ------------------------- CheckboxGroup Indicator ------------------------ */

  type CheckboxGroupIndicatorElement = React.ElementRef<typeof Checkbox.Indicator>
  interface CheckboxGroupIndicatorProps
    extends React.ComponentPropsWithoutRef<typeof Checkbox.Indicator> {}

  const CheckboxGroupIndicator = forwardRef<
    CheckboxGroupIndicatorElement,
    CheckboxGroupIndicatorProps
  >((props, forwardedRef) => {
    return <Checkbox.Indicator {...props} ref={forwardedRef} />
  })

  CheckboxGroupIndicator.displayName = `CheckboxGroup.Indicator <${scope.description}>`

  return { Root: CheckboxGroupRoot, Item: CheckboxGroupItem, Indicator: CheckboxGroupIndicator }
}
