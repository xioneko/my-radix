import el from "../shared/polymorphic"
import { forwardRef } from "react"
import { createPortal } from "react-dom"

type PortalElement = React.ElementRef<typeof el.div>

interface PortalProps extends React.ComponentPropsWithoutRef<typeof el.div> {
  container?: Element | DocumentFragment | null
}

export const Portal = forwardRef<PortalElement, PortalProps>((props, forwardedRef) => {
  const { container, ...portalProps } = props
  return createPortal(<el.div {...portalProps} ref={forwardedRef} />, container ?? document.body)
})

Portal.displayName = "Portal"
