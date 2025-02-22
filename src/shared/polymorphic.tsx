import { composeRefs } from "../hooks/useComposedRef"
import { mergeProps } from "./mergeProps"
import { Children, cloneElement, forwardRef, isValidElement, version as ReactVersion } from "react"

const Tags = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul",
] as const

type PolymorphicProps<E extends React.ElementType> = React.ComponentPropsWithRef<E> & {
  asChild?: boolean
}

type PolymorphicElements = {
  [T in (typeof Tags)[number]]: React.ForwardRefExoticComponent<PolymorphicProps<T>>
}

const elements: PolymorphicElements = Tags.reduce((acc, tag) => {
  const Elem = forwardRef(
    (props: PolymorphicProps<typeof tag>, forwardedRef: React.Ref<typeof tag>) => {
      const { asChild, ...elemProps } = props
      const Elem: any = asChild ? AsChild : tag

      return <Elem ref={forwardedRef} {...elemProps} />
    },
  )
  Elem.displayName = `El.${tag}`
  return { ...acc, [tag]: Elem }
}, {} as PolymorphicElements)

export default elements

export const AsChild = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, forwardedRef) => {
    const { children, ...parentProps } = props
    const child = Children.only(children)

    if (!isValidElement(child)) {
      throw new Error("Expected a valid element when using `asChild`")
    }

    const childRef = ReactVersion.startsWith("19") ? child.props.ref : (child as any).ref
    const composedRef = forwardedRef ? composeRefs(forwardedRef, childRef) : childRef

    return cloneElement(child, {
      ...mergeProps(parentProps, child.props),
      // @ts-ignore
      ref: composedRef,
    })
  },
)
