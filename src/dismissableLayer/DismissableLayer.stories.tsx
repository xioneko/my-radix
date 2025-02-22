import Popper from "#popper"
import { Portal } from "#portal"
import { DismissableLayer } from "."
import { useCallback, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { AutoFocusInside, FocusOn } from "react-focus-on"

export default {
  title: "Base/DismissableLayer",
}

export const Basic = () => {
  const [open, setOpen] = useState(false)
  const openButtonRef = useRef(null)

  const [dismissOnEscape, setDismissOnEscape] = useState(false)
  const [dismissOnPointerDownOutside, setDismissOnPointerDownOutside] = useState(false)
  const [disabledOutsidePointerEvents, setDisableOutsidePointerEvents] = useState(false)

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>DismissableLayer</h1>

      <div style={{ display: "inline-block", textAlign: "left", marginBottom: 20 }}>
        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={dismissOnEscape}
            onChange={event => setDismissOnEscape(event.target.checked)}
          />{" "}
          Dismiss on escape?
        </label>

        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={dismissOnPointerDownOutside}
            onChange={event => setDismissOnPointerDownOutside(event.target.checked)}
          />{" "}
          Dismiss on pointer down outside?
        </label>

        <hr />

        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={disabledOutsidePointerEvents}
            onChange={event => setDisableOutsidePointerEvents(event.target.checked)}
          />{" "}
          Disable outside pointer events?
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button ref={openButtonRef} type="button" onClick={() => setOpen(open => !open)}>
          {open ? "Close" : "Open"} layer
        </button>
      </div>

      {open ? (
        <DismissableLayer
          onEscapeKeyDown={() => {
            return !dismissOnEscape
          }}
          onPointerDownOutside={event => {
            return dismissOnPointerDownOutside === false || event.target === openButtonRef.current
          }}
          disableOutsidePointerEvents={disabledOutsidePointerEvents}
          onDismiss={() => setOpen(false)}
          style={{
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            verticalAlign: "middle",
            width: 400,
            height: 300,
            backgroundColor: "black",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <input type="text" />
        </DismissableLayer>
      ) : null}

      <div style={{ marginBottom: 20 }}>
        <input type="text" defaultValue="hello" style={{ marginRight: 20 }} />
        <button type="button" onMouseDown={() => alert("hey!")}>
          hey!
        </button>
      </div>
    </div>
  )
}

export const Nested = () => {
  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>DismissableLayer (nested)</h1>
      <DismissableBox />
    </div>
  )
}

export const WithFocusOn = () => {
  const [open, setOpen] = useState(false)
  const openButtonRef = useRef(null)

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", height: "200vh" }}>
      <h1>DismissableLayer + FocusOn</h1>
      <div style={{ marginBottom: 20 }}>
        <button ref={openButtonRef} type="button" onClick={() => setOpen(open => !open)}>
          {open ? "Close" : "Open"} layer
        </button>
      </div>

      {open ? (
        <FocusOn preventScrollOnFocus noIsolation>
          <DismissableLayer
            onPointerDownOutside={event => {
              return event.target === openButtonRef.current
            }}
            disableOutsidePointerEvents
            onDismiss={() => setOpen(false)}
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              verticalAlign: "middle",
              width: 400,
              height: 300,
              backgroundColor: "black",
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <input type="text" />
          </DismissableLayer>
        </FocusOn>
      ) : null}

      <div style={{ marginBottom: 20 }}>
        <input type="text" defaultValue="hello" style={{ marginRight: 20 }} />
        <button type="button" onMouseDown={() => alert("hey!")}>
          hey!
        </button>
      </div>
    </div>
  )
}

export const PopoverSemiModal = () => {
  const [color, setColor] = useState("royalblue")
  const changeColorButtonRef = useRef(null)
  return (
    <div style={{ height: "200vh" }}>
      <h1>Popover (semi-modal example)</h1>
      <div style={{ display: "flex", gap: 10 }}>
        <DummyPopover
          shards={[changeColorButtonRef]}
          color={color}
          openLabel="Open Popover"
          closeLabel="Close Popover"
          onPointerDownOutside={event => {
            return event.target === changeColorButtonRef.current
          }}
        />
        <input type="text" defaultValue="some input" />
        <button type="button" onClick={() => window.alert("clicked!")}>
          Alert me
        </button>
        <button
          ref={changeColorButtonRef}
          type="button"
          onClick={() =>
            setColor(prevColor => (prevColor === "royalblue" ? "tomato" : "royalblue"))
          }
        >
          Change popover color when popover is open
        </button>
      </div>
    </div>
  )
}

export const PopoverNonModal = () => (
  <div style={{ height: "200vh" }}>
    <h1>Popover (non modal example)</h1>
    <div style={{ display: "flex", gap: 10 }}>
      <DummyPopover openLabel="Open Popover" closeLabel="Close Popover" focusLock={false} />
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert("clicked!")}>
        Alert me
      </button>
    </div>
  </div>
)

export const PopoverNested = () => (
  <div style={{ height: "200vh" }}>
    <h1>Popover (nested example)</h1>
    <ul style={{ listStyle: "none", padding: 0, marginBottom: 30 }}>
      <li>
        ✅ dismissing a `Popover` by pressing escape should only dismiss that given `Popover`, not
        its parents
      </li>
      <li>✅ Click outside the blue `Popover` should only dismiss itself</li>
      <li>✅ Click outside the red `Popover` should dismiss itself and the black one</li>
      <li>✅ unless the click wasn't outside the black one</li>
    </ul>

    <div style={{ display: "flex", gap: 10 }}>
      <DummyPopover disableOutsidePointerEvents>
        <DummyPopover color="tomato" openLabel="Open red" closeLabel="Close red">
          <DummyPopover
            color="royalblue"
            openLabel="Open blue"
            closeLabel="Close blue"
            disableOutsidePointerEvents
          ></DummyPopover>
        </DummyPopover>
      </DummyPopover>
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert("clicked!")}>
        Alert me
      </button>
    </div>
  </div>
)

export const InPopupWindow = () => {
  const handlePopupClick = useCallback(() => {
    const popupWindow = window.open(undefined, undefined, "width=300,height=300,top=100,left=100")
    if (!popupWindow) {
      console.error("Failed to open popup window, check your popup blocker settings")
      return
    }

    const containerNode = popupWindow.document.createElement("div")
    popupWindow.document.body.append(containerNode)

    createRoot(containerNode).render(<DismissableBox />)
  }, [])
  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center" }}>
      <button onClick={handlePopupClick}>Open Popup</button>
    </div>
  )
}

function DismissableBox(props: any) {
  const [open, setOpen] = useState(false)
  const openButtonRef = useRef(null)

  return (
    <DismissableLayer
      {...props}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 10,
        marginTop: 20,
        ...props.style,
      }}
    >
      <div>
        <button ref={openButtonRef} type="button" onClick={() => setOpen(open => !open)}>
          {open ? "Close" : "Open"} new layer
        </button>
      </div>

      {open ? (
        <DismissableBox
          onPointerDownOutside={(event: any) => {
            return event.target === openButtonRef.current
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </DismissableLayer>
  )
}

type DummyPopoverProps = React.ComponentPropsWithRef<typeof DismissableLayer> &
  Omit<React.ComponentPropsWithRef<typeof FocusOn>, "children"> & {
    children?: React.ReactNode
    openLabel?: string
    closeLabel?: string
    color?: string
  }

function DummyPopover({
  children,
  shards,
  focusLock = true,
  scrollLock = false,
  autoFocus = focusLock,
  openLabel = "Open",
  closeLabel = "Close",
  color = "#333",
  onEscapeKeyDown,
  onPointerDownOutside,
  disableOutsidePointerEvents = false,
}: DummyPopoverProps) {
  const [open, setOpen] = useState(false)
  const openButtonRef = useRef(null)

  return (
    <Popper.Root>
      <Popper.Anchor asChild>
        <button type="button" ref={openButtonRef} onClick={() => setOpen(prevOpen => !prevOpen)}>
          {openLabel}
        </button>
      </Popper.Anchor>
      {open ? (
        <Portal asChild>
          <FocusOn
            focusLock={focusLock}
            scrollLock={scrollLock}
            autoFocus={autoFocus}
            shards={shards}
            preventScrollOnFocus
          >
            <DismissableLayer
              asChild
              disableOutsidePointerEvents={disableOutsidePointerEvents}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={event => {
                return event.target === openButtonRef.current || !!onPointerDownOutside?.(event)
              }}
              onDismiss={() => setOpen(false)}
            >
              <Popper.Content
                style={{
                  filter: "drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  background: "white",
                  minWidth: 200,
                  minHeight: 150,
                  padding: 20,
                  borderRadius: 4,
                  backgroundColor: color,
                }}
                side="bottom"
                sideOffset={10}
              >
                {children}
                <button type="button" onClick={() => setOpen(false)}>
                  {closeLabel}
                </button>
                {autoFocus ? (
                  <AutoFocusInside>
                    <input type="text" defaultValue="auto focus in" />
                  </AutoFocusInside>
                ) : (
                  <input type="text" defaultValue="hello world" />
                )}

                <Popper.Arrow width={10} height={4} style={{ fill: color }} offset={20} />
              </Popper.Content>
            </DismissableLayer>
          </FocusOn>
        </Portal>
      ) : null}
    </Popper.Root>
  )
}
