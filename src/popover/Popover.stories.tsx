import Popover from "#popover"
import * as styles from "./Popover.stories.css"
import { useEffect, useRef, useState } from "react"
import { useTransition, animated, config } from "react-spring"

export default {
  title: "Components/Popover",
}

export const Styled = () => {
  return (
    <Scrollable>
      <Popover.Root>
        <Popover.Trigger className={styles.trigger()}>open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.content()} sideOffset={5}>
            <Popover.Close className={styles.close()}>close</Popover.Close>
            <Popover.Arrow className={styles.arrow()} width={20} height={10} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <input />
    </Scrollable>
  )
}

export const Boundary = () => {
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null)

  return (
    <Scrollable>
      <div
        style={{
          border: "3px dashed red",
          width: "200px",
          height: "200px",
        }}
        ref={setBoundary}
      >
        <Popover.Root>
          <Popover.Trigger asChild>
            <button>open</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              style={{
                boxSizing: "border-box",
                borderRadius: "8px",
                padding: "8px",
                color: "white",
                backgroundColor: "black",
                width: "var(--popper-available-width)",
                height: "var(--popper-available-height)",
              }}
              sideOffset={5}
              collisionBoundary={boundary}
            >
              out of bound out of bound out of bound out of bound out of bound out of bound out of
              bound out of bound out of bound
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </Scrollable>
  )
}

export const Modality = () => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "110vh" }}
    >
      <div style={{ display: "grid", gap: 50 }}>
        <div style={{ display: "inline-flex", alignItems: "center", flexDirection: "column" }}>
          <h1>Non modal (default)</h1>
          <Popover.Root>
            <Popover.Trigger className={styles.trigger()}>open</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className={styles.content()} sideOffset={5}>
                <Popover.Close className={styles.close()}>close</Popover.Close>
                <Popover.Arrow className={styles.arrow()} width={20} height={10} offset={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", flexDirection: "column" }}>
          <h1>Modal</h1>
          <Popover.Root modal>
            <Popover.Trigger className={styles.trigger()}>open</Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className={styles.content()} sideOffset={5}>
                <Popover.Close className={styles.close()}>close</Popover.Close>
                <Popover.Arrow className={styles.arrow()} width={20} height={10} offset={10} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <textarea
            style={{ width: 500, height: 100, marginTop: 10 }}
            defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
          />
        </div>
      </div>
    </div>
  )
}

export const Controlled = () => {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className={styles.trigger()}>{open ? "close" : "open"}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={styles.content()}>
            <Popover.Close className={styles.close()}>close</Popover.Close>
            <Popover.Arrow className={styles.arrow()} width={20} height={10} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

export const Animated = () => {
  const [open, setOpen] = useState(false)
  const transitions = useTransition(open, {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -10 },
    config: config.stiff,
  })
  return (
    <Scrollable>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className={styles.trigger()}>open</Popover.Trigger>
        <Popover.Portal>
          {transitions((transition, open) => {
            return (
              open && (
                <Popover.Content className={styles.content()} sideOffset={10} forceMount asChild>
                  <animated.div style={transition}>
                    <Popover.Close className={styles.close()}>close</Popover.Close>
                    <Popover.Arrow className={styles.arrow()} width={20} height={10} />
                  </animated.div>
                </Popover.Content>
              )
            )
          })}
        </Popover.Portal>
      </Popover.Root>
    </Scrollable>
  )
}

export const Nested = () => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div
      style={{
        height: "300vh",
        width: "300vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        style={{ position: "fixed", top: 10, left: 10 }}
        onClick={() => buttonRef.current?.focus()}
      >
        Focus popover button
      </button>

      <Popover.Root>
        <Popover.Trigger className={styles.trigger()} ref={buttonRef}>
          Open popover
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={styles.content()}
            sideOffset={5}
            style={{ backgroundColor: "crimson" }}
          >
            <Popover.Root>
              <Popover.Trigger className={styles.trigger()}>Open nested popover</Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className={styles.content()}
                  side="top"
                  align="center"
                  sideOffset={5}
                  style={{ backgroundColor: "green" }}
                >
                  <Popover.Close className={styles.close()}>close</Popover.Close>
                  <Popover.Arrow
                    className={styles.arrow()}
                    width={20}
                    height={10}
                    offset={20}
                    style={{ fill: "green" }}
                  />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Close className={styles.close()} style={{ marginLeft: 10 }}>
              close
            </Popover.Close>
            <Popover.Arrow
              className={styles.arrow()}
              width={20}
              height={10}
              offset={20}
              style={{ fill: "crimson" }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

export const CustomAnchor = () => {
  return (
    <Scrollable>
      <Popover.Root>
        <Popover.Anchor
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: 250,
            padding: 20,
            margin: 100,
            backgroundColor: "#eee",
          }}
        >
          Item <Popover.Trigger className={styles.trigger()}>open</Popover.Trigger>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            className={styles.content()}
            side="right"
            sideOffset={1}
            align="start"
            style={{ borderRadius: 0, width: 200, height: 100 }}
          >
            <Popover.Close>close</Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </Scrollable>
  )
}

export const WithSlottedTrigger = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.trigger()} onClick={() => console.log("StyledTrigger click")}>
          open
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content()} sideOffset={5}>
          <Popover.Close className={styles.close()}>close</Popover.Close>
          <Popover.Arrow className={styles.arrow()} width={20} height={10} offset={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}


const Scrollable = (props: any) => {
  useEffect(() => {
    window.scrollTo({
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
    })
  }, [])
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "200vh",
        width: "200vw",
      }}
      {...props}
    />
  )
}
