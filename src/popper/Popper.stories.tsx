import Popper from "."
import { Portal } from "../portal"
import * as styles from "./Popper.stories.css"
import { useState, useEffect } from "react"

export default {
  title: "Base/Popper",
}

export const Styled = () => {
  const [open, setOpen] = useState(false)
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Popper.Content className={styles.content()} sideOffset={5}>
            <button type="button" onClick={() => setOpen(false)}>
              close
            </button>
            <Popper.Arrow className={styles.arrow()} width={20} height={10} />
          </Popper.Content>
        )}
      </Popper.Root>
    </Scrollable>
  )
}

export const WithCustomArrow = () => {
  const [open, setOpen] = useState(false)
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal asChild>
            <Popper.Content className={styles.content()} side="right" sideOffset={5}>
              <button type="button" onClick={() => setOpen(false)}>
                close
              </button>
              <Popper.Arrow asChild offset={20}>
                <div
                  style={{
                    width: 20,
                    height: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor: "tomato",
                  }}
                />
              </Popper.Arrow>
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </Scrollable>
  )
}

export const Animated = () => {
  const [open, setOpen] = useState(false)

  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal asChild>
            <Popper.Content className={styles.content({ animated: true })} sideOffset={5}>
              <button type="button" onClick={() => setOpen(false)}>
                close
              </button>
              <Popper.Arrow className={styles.arrow()} width={20} height={10} offset={25} />
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </Scrollable>
  )
}

export const WithPortal = () => {
  const [open, setOpen] = useState(false)
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor className={styles.anchor()} onClick={() => setOpen(true)}>
          open
        </Popper.Anchor>

        {open && (
          <Portal asChild>
            <Popper.Content className={styles.content()} sideOffset={5}>
              <button type="button" onClick={() => setOpen(false)}>
                close
              </button>
              <Popper.Arrow className={styles.arrow()} width={20} height={10} />
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </Scrollable>
  )
}

export const WithUpdatePositionStrategyAlways = () => {
  const [open, setOpen] = useState(false)
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLeft(prev => (prev + 50) % 300)
    }, 500)
    return () => clearInterval(intervalId)
  }, [])
  return (
    <Scrollable>
      <Popper.Root>
        <Popper.Anchor
          className={styles.anchor()}
          onClick={() => setOpen(true)}
          style={{ marginLeft: left }}
        >
          open
        </Popper.Anchor>

        {open && (
          <Portal asChild>
            <Popper.Content
              className={styles.content()}
              sideOffset={5}
              updatePositionStrategy="always"
            >
              <button type="button" onClick={() => setOpen(false)}>
                close
              </button>
              <Popper.Arrow className={styles.arrow()} width={20} height={10} />
            </Popper.Content>
          </Portal>
        )}
      </Popper.Root>
    </Scrollable>
  )
}

export const Chromatic = () => {
  const [scrollContainer1, setScrollContainer1] = useState<HTMLDivElement | null>(null)
  const [scrollContainer2, setScrollContainer2] = useState<HTMLDivElement | null>(null)

  return (
    <div style={{ paddingBottom: 500 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 150,

          position: "fixed",
          top: 0,
          left: 0,
          right: 0,

          backgroundColor: "grey",
          border: "1px solid black",
        }}
      >
        <h1>In fixed header</h1>
        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>1</Popper.Anchor>
          <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow()} width={10} height={5} />1
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>2</Popper.Anchor>
          <Portal asChild>
            <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow()} width={10} height={5} />2 (portalled)
            </Popper.Content>
          </Portal>
        </Popper.Root>
      </header>

      <div
        style={{
          marginTop: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 150,
          border: "1px solid black",
        }}
      >
        <h1>In normal page flow</h1>
        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>3</Popper.Anchor>
          <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow()} width={10} height={5} />3
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>4</Popper.Anchor>
          <Portal asChild>
            <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow()} width={10} height={5} />4 (portalled)
            </Popper.Content>
          </Portal>
        </Popper.Root>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 150,
          border: "1px solid black",
        }}
      >
        <h1>In relative parent</h1>
        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>5</Popper.Anchor>
          <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow()} width={10} height={5} />5
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>6</Popper.Anchor>
          <Portal asChild>
            <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow()} width={10} height={5} />6 (portalled)
            </Popper.Content>
          </Portal>
        </Popper.Root>
      </div>

      <div
        style={{
          marginTop: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 150,
          border: "1px solid black",
          transform: "translate3d(100px, 0, 0)",
        }}
      >
        <h1>In translated parent</h1>
        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>7</Popper.Anchor>
          <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
            <Popper.Arrow className={styles.arrow()} width={10} height={5} />7
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>8</Popper.Anchor>
          <Portal asChild>
            <Popper.Content className={styles.content({ size: "small" })} sideOffset={5}>
              <Popper.Arrow className={styles.arrow()} width={10} height={5} />8 (portalled)
            </Popper.Content>
          </Portal>
        </Popper.Root>
      </div>

      <div style={{ display: "flex", gap: 100 }}>
        <div>
          <h1>In scrolling container</h1>
          <div
            ref={setScrollContainer1}
            style={{ width: 400, height: 600, overflow: "auto", border: "1px solid black" }}
          >
            <div style={{ height: 2000 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 150,
                    paddingBottom: 100,
                  }}
                >
                  <Popper.Root>
                    <Popper.Anchor className={styles.anchor({ size: "small" })}>
                      9.{i + 1}
                    </Popper.Anchor>
                    <Popper.Content
                      className={styles.content({ size: "small" })}
                      sideOffset={5}
                      hideWhenDetached
                      collisionBoundary={scrollContainer1}
                    >
                      <Popper.Arrow className={styles.arrow()} width={10} height={5} />
                      9.{i + 1}
                    </Popper.Content>
                  </Popper.Root>

                  <Popper.Root>
                    <Popper.Anchor className={styles.anchor({ size: "small" })}>
                      10.{i + 1}
                    </Popper.Anchor>
                    <Portal asChild>
                      <Popper.Content
                        className={styles.content({ size: "small" })}
                        sideOffset={5}
                        hideWhenDetached
                        collisionBoundary={scrollContainer1}
                      >
                        <Popper.Arrow className={styles.arrow()} width={10} height={5} />
                        10.{i + 1} (portalled)
                      </Popper.Content>
                    </Portal>
                  </Popper.Root>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h1>With position sticky</h1>
          <div
            ref={setScrollContainer2}
            style={{ width: 400, height: 600, overflow: "auto", border: "1px solid black" }}
          >
            <div style={{ height: 2000 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 150,
                    paddingBottom: 100,
                    position: "sticky",
                    top: 0,
                  }}
                >
                  <Popper.Root>
                    <Popper.Anchor className={styles.anchor({ size: "small" })}>
                      9.{i + 1}
                    </Popper.Anchor>
                    <Popper.Content
                      className={styles.content({ size: "small" })}
                      sideOffset={5}
                      hideWhenDetached
                      collisionBoundary={scrollContainer2}
                    >
                      <Popper.Arrow className={styles.arrow()} width={10} height={5} />
                      9.{i + 1}
                    </Popper.Content>
                  </Popper.Root>

                  <Popper.Root>
                    <Popper.Anchor className={styles.anchor({ size: "small" })}>
                      10.{i + 1}
                    </Popper.Anchor>
                    <Portal asChild>
                      <Popper.Content
                        className={styles.content({ size: "small" })}
                        sideOffset={5}
                        hideWhenDetached
                        collisionBoundary={scrollContainer2}
                      >
                        <Popper.Arrow className={styles.arrow()} width={10} height={5} />
                        10.{i + 1} (portalled)
                      </Popper.Content>
                    </Portal>
                  </Popper.Root>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 150,
          border: "1px solid black",
        }}
      >
        <h1>Logical "start" alignment</h1>
        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>11</Popper.Anchor>
          <Popper.Content
            align="start"
            className={styles.content({ size: "small" })}
            sideOffset={5}
          >
            <Popper.Arrow className={styles.arrow()} width={10} height={5} />
            11
          </Popper.Content>
        </Popper.Root>

        <Popper.Root>
          <Popper.Anchor className={styles.anchor({ size: "small" })}>12</Popper.Anchor>
          <Portal asChild>
            <Popper.Content
              align="start"
              className={styles.content({ size: "small" })}
              sideOffset={5}
            >
              <Popper.Arrow className={styles.arrow()} width={10} height={5} />
              12 (portalled)
            </Popper.Content>
          </Portal>
        </Popper.Root>
      </div>
    </div>
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
