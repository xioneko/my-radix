import Dialog from "."
import * as styles from "./Dialog.stories.css"
import { useRef, useState } from "react"
import { animated, useTransition } from "react-spring"

export default {
  title: "Components/Dialog",
}

export const Styled = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content({ default: true })}>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const Nested = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content({ default: true })}>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>
          Please enter the info for your booking below.
          <Dialog.Root>
            <Dialog.Trigger>open another dialog</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={styles.overlay} />
              <Dialog.Content className={styles.content({ default: true })}>
                <Dialog.Title>Booking info</Dialog.Title>
                <Dialog.Description>This is a nested dialog.</Dialog.Description>
                <Dialog.Close>close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const NonModal = () => (
  <>
    <Dialog.Root modal={false}>
      <Dialog.Trigger>open (non-modal)</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content({ sheet: true })}
          onFocusOutside={() => true}
          onPointerDownOutside={() => true}
        >
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Close>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} style={{ marginTop: 20 }}>
        <textarea
          style={{ width: 800, height: 400 }}
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet, minima expedita alias et fugit voluptate laborum placeat odio dolore ab!"
        />
      </div>
    ))}
  </>
)

export const Controlled = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{open ? "close" : "open"}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content({ default: true })}>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Close>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export const FocusTrap = () => (
  <>
    <Dialog.Root>
      <Dialog.Trigger>open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content({ default: true })}>
          <Dialog.Close>close</Dialog.Close>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="John" />

            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Doe" />

            <button type="submit">Send</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    <p>These elements can't be focused when the dialog is opened.</p>
    <button type="button">A button</button>
    <input type="text" placeholder="Another focusable element" />
  </>
)

export const CustomFocus = () => {
  // const firstNameRef = useRef<HTMLInputElement>(null)
  const searchFieldRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content
            className={styles.content({ default: true })}
            returnFocus={() => {
              searchFieldRef.current?.focus()
              return false
            }}
          >
            <Dialog.Close>close</Dialog.Close>

            <div>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>
                The first name input will receive the focus after opening the dialog.
              </Dialog.Description>
              <label htmlFor="firstName">First Name</label>
              <input autoFocus type="text" id="firstName" placeholder="John" />

              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Doe" />

              <button type="submit">Send</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div>
        <p>The search input will receive the focus after closing the dialog.</p>
        <input type="text" placeholder="Search…" ref={searchFieldRef} />
      </div>
    </>
  )
}

export const NoEscapeDismiss = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content({ default: true })} onEscapeKeyDown={() => true}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>
          The first name input will receive the focus after opening the dialog.
        </Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const NoPointerDownOutsideDismiss = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content
        className={styles.content({ default: true })}
        onPointerDownOutside={() => true}
      >
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const WithPortalContainer = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>open</Dialog.Trigger>
        <Dialog.Portal container={portalContainer}>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.content({ default: true })}>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Description</Dialog.Description>
            <Dialog.Close>close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div data-portal-container="" ref={setPortalContainer} />
    </>
  )
}

export const Animated = () => {
  const [open, setOpen] = useState(false)
  const transition = useTransition(open, {
    from: {
      scale: 0.9,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
    },
    leave: {
      scale: 0.9,
      opacity: 0,
    },
  })
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>open</Dialog.Trigger>
      <Dialog.Portal>
        {transition(
          (style, open) =>
            open && (
              <>
                <AnimatedOverlay
                  style={{ opacity: style.opacity }}
                  className={styles.overlay}
                  forceMount
                />
                <AnimatedContent
                  style={style}
                  className={styles.content({ default: true })}
                  forceMount
                >
                  <Dialog.Title>Title</Dialog.Title>
                  <Dialog.Description>Description</Dialog.Description>
                  <Dialog.Close>close</Dialog.Close>
                </AnimatedContent>
              </>
            ),
        )}
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const AnimatedOverlay = animated(Dialog.Overlay)
const AnimatedContent = animated(Dialog.Content)

export const ForcedMount = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} forceMount />
      <Dialog.Content className={styles.content({ default: true })} forceMount>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const InnerScrollable = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content({ scrollable: "content" })} preventScrollOnFocus>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
        <div style={{ backgroundColor: "#eee", height: 500 }} />
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const OuterScrollable = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <div style={{ backgroundColor: "#eee", width: 300, height: 1000 }} />
    <Dialog.Portal>
      <Dialog.Overlay className={styles.scrollableOverlay}>
        <Dialog.Content className={styles.content({ scrollable: "overlay" })} preventScrollOnFocus>
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
          <div style={{ backgroundColor: "#eee", height: 500 }} />
          <Dialog.Close>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
)
