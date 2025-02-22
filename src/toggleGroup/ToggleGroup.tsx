import { createRovingFocusGroup } from "#rovingFocusGroup"
import Toggle from "#toggle"
import { useControllableState } from "../hooks/useControllableState"
import el from "../shared/polymorphic"
import { createScope, type Scope } from "../shared/scope"
import { createContext, forwardRef, useContext, useMemo, useState } from "react"

const ToggleGroupScope = createScope("ToggleGroup")

export const ToggleGroup = createToggleGroup(ToggleGroupScope)

export function createToggleGroup(scope: Scope) {
  const RovingFocusGroup = createRovingFocusGroup(scope)

  /* ---------------------------- ToggleGroup Root ---------------------------- */

  const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)
  type ToggleGroupContextValue = {
    value: string[]
    onItemActivate(value: string): void
    onItemDeactivate(value: string): void
  }

  type ToggleGroupRootElement = React.ElementRef<typeof el.div>
  type ToggleGroupRootProps = React.ComponentPropsWithoutRef<typeof el.div> &
    (SingleTypeToggleGroupRootProps | MultipleTypeToggleGroupRootProps)

  interface SingleTypeToggleGroupRootProps extends BaseToggleGroupRootProps {
    type: "single"
    value?: string
    defaultValue?: string
    onValueChange?(value: string): void
  }
  interface MultipleTypeToggleGroupRootProps extends BaseToggleGroupRootProps {
    type: "multiple"
    value?: string[]
    defaultValue?: string[]
    onValueChange?(value: string[]): void
  }
  interface BaseToggleGroupRootProps extends React.ComponentPropsWithoutRef<typeof el.div> {
    loop?: boolean
    orientation?: "horizontal" | "vertical"
  }

  const ToggleGroupRoot = forwardRef<ToggleGroupRootElement, ToggleGroupRootProps>(
    (props, forwardedRef) => {
      if (props.type === "single") {
        return <SingleTypeToggleGroupRoot {...props} ref={forwardedRef} />
      } else if (props.type === "multiple") {
        return <MultipleTypeToggleGroupRoot {...props} ref={forwardedRef} />
      }
      throw new Error(`Invalid ToggleGroup type prop: ${(props as any).type}`)
    },
  )

  ToggleGroupRoot.displayName = `ToggleGroup.Root <${scope.description}>`

  const SingleTypeToggleGroupRoot = forwardRef<
    ToggleGroupRootElement,
    SingleTypeToggleGroupRootProps
  >(function SingleType(props, forwardedRef) {
    const {
      value: valueProp,
      defaultValue = "",
      onValueChange,
      loop = true,
      orientation,
      ...toggleGroupProps
    } = props
    const [value, setValue] = useControllableState({
      controlled: [valueProp, onValueChange],
      uncontrolled: useState(defaultValue),
    })

    return (
      <ToggleGroupContext.Provider
        value={useMemo(
          () => ({
            value: value === "" ? [] : [value],
            onItemActivate: setValue,
            onItemDeactivate: () => setValue(""),
          }),
          [value, setValue],
        )}
      >
        <RovingFocusGroup.Root
          {...toggleGroupProps}
          ref={forwardedRef}
          orientation={orientation}
          loop={loop}
        />
      </ToggleGroupContext.Provider>
    )
  })

  const MultipleTypeToggleGroupRoot = forwardRef<
    ToggleGroupRootElement,
    MultipleTypeToggleGroupRootProps
  >(function MultipleType(props, forwardedRef) {
    const {
      value: valueProp,
      defaultValue = [],
      onValueChange,
      loop = true,
      orientation,
      ...toggleGroupProps
    } = props
    const [value, setValue] = useControllableState({
      controlled: [valueProp, onValueChange],
      uncontrolled: useState(defaultValue),
    })

    return (
      <ToggleGroupContext.Provider
        value={useMemo(
          () => ({
            type: "multiple",
            value,
            onItemActivate: value => setValue(prev => [...prev, value]),
            onItemDeactivate: value => setValue(prev => prev.filter(v => v !== value)),
          }),
          [value, setValue],
        )}
      >
        <RovingFocusGroup.Root
          {...toggleGroupProps}
          ref={forwardedRef}
          orientation={orientation}
          loop={loop}
        />
      </ToggleGroupContext.Provider>
    )
  })

  /* --------------------------- ToggleGroup Item ---------------------------- */

  type ToggleGroupItemElement = React.ElementRef<typeof Toggle>
  interface ToggleGroupItemProps
    extends Omit<
      React.ComponentPropsWithoutRef<typeof Toggle>,
      "defaultPressed" | "onPressedChange"
    > {
    value: string
  }

  const ToggleGroupItem = forwardRef<ToggleGroupItemElement, ToggleGroupItemProps>(
    (props, forwardedRef) => {
      const { disabled = false, value: itemValue, ...itemProps } = props
      const { value, onItemActivate, onItemDeactivate } = useContext(ToggleGroupContext)!
      return (
        <RovingFocusGroup.Item focusable={!disabled} active={value.includes(itemValue)} asChild>
          <Toggle
            {...itemProps}
            ref={forwardedRef}
            onPressedChange={pressed => {
              if (pressed) {
                onItemActivate(itemValue)
              } else {
                onItemDeactivate(itemValue)
              }
            }}
          />
        </RovingFocusGroup.Item>
      )
    },
  )

  ToggleGroupItem.displayName = `ToggleGroup.Item <${scope.description}>`

  return { Root: ToggleGroupRoot, Item: ToggleGroupItem }
}
