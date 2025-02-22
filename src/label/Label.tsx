import { composeEventHandlers } from "../shared/mergeProps"
import el from "../shared/polymorphic"
import { forwardRef } from "react"

type LabelElement = React.ElementRef<typeof el.label>
interface LabelProps extends React.ComponentPropsWithoutRef<typeof el.label> {}

export const Label = forwardRef<LabelElement, LabelProps>((props, forwardedRef) => {
  return (
    <el.label
      {...props}
      ref={forwardedRef}
      onMouseDown={composeEventHandlers(props.onMouseDown, event => {
        const target = event.target as HTMLElement
        if (target.closest("button, input, select, textarea")) return
        // prevent text selection
        if (event.detail > 1) event.preventDefault()
      })}
    />
  )
})
