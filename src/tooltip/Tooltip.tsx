import { forwardRef } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Tooltip as ReactTooltip } from "react-tooltip"

export const Tooltip = createToolTip("dv-tooltip")

export function createToolTip(id?: string) {
  /* --------------------------------- Tooltip -------------------------------- */

  type TooltipElement = React.ElementRef<typeof ReactTooltip>
  interface TooltipProps extends Omit<React.ComponentPropsWithoutRef<typeof ReactTooltip>, "id"> {}

  const TooltipHost = forwardRef<TooltipElement, TooltipProps>(
    (props: TooltipProps, forwardedRef) => {
      return <ReactTooltip {...props} id={id} ref={forwardedRef} />
    },
  )

  TooltipHost.displayName = "Tooltip.Host"

  /* ----------------------------- Tooltip Anchor ----------------------------- */

  interface TooltipAnchorProps extends React.ComponentPropsWithoutRef<"a"> {
    content?: string
    node?: React.ReactNode
    delayHide?: number
    delayShow?: number
    offset?: number
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "end"
    variant?: "dark" | "light" | "success" | "warning" | "error" | "info"
    hidden?: boolean
  }

  const TooltipAnchor = forwardRef<HTMLAnchorElement, TooltipAnchorProps>((props, forwardedRef) => {
    const { content, node, delayHide, delayShow, offset, side, align, variant, hidden, ...anchorProps } =
      props
    return (
      <a
        data-tooltip-id={id}
        data-tooltip-content={content}
        data-tooltip-html={node ? renderToStaticMarkup(node) : undefined}
        data-tooltip-delay-hide={delayHide}
        data-tooltip-delay-show={delayShow}
        data-tooltip-offset={offset}
        data-tooltip-place={side ? (align ? `${side}-${align}` : side) : undefined}
        data-tooltip-variant={variant}
        data-tooltip-hidden={hidden}
        {...anchorProps}
        ref={forwardedRef}
      />
    )
  })

  TooltipAnchor.displayName = "Tooltip.Anchor"

  return { Anchor: TooltipAnchor, Host: TooltipHost }
}

// https://github.com/ReactTooltip/react-tooltip/blob/08bfc6f17789d9f06f10bc90a58d34521d5178de/src/tokens.css#L1-L11
/**
 * @default #fff
 */
export const TooltipColorWhiteCSSVar = "--rt-color-white"
/**
 * @default #222
 */
export const TooltipColorDarkCSSVar = "--rt-color-dark"
/**
 * @default #8dc572
 */
export const TooltipColorSuccessCSSVar = "--rt-color-success"
/**
 * @default #f0ad4e
 */
export const TooltipColorWarningCSSVar = "--rt-color-warning"
/**
 * @default #be6464
 */
export const TooltipColorErrorCSSVar = "--rt-color-error"
/**
 * @default #337ab7
 */
export const TooltipColorInfoCSSVar = "--rt-color-info"
/**
 * @default 0.9
 */
export const TooltipOpacityCSSVar = "--rt-opacity"
/**
 * @default 150ms
 */
export const TooltipTransitionShowDelayCSSVar = "--rt-transition-show-delay"
/**
 * @default 150ms
 */
export const TooltipTransitionHideDelayCSSVar = "--rt-transition-hide-delay"