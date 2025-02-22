import RovingFocusGroup from "."
import { mergeEventHandlers } from "../shared/mergeProps"
import { createContext, useContext, useState } from "react"

export default {
  title: "Base/RovingFocusGroup",
}

export const Basic = () => {
  return (
    <div>
      <h2>no orientation (both) + no looping</h2>
      <ButtonGroup defaultValue="two">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>no orientation (both) + looping</h2>
      <ButtonGroup loop>
        <Button value="hidden" style={{ display: "none" }}>
          Hidden
        </Button>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>horizontal orientation + no looping</h2>
      <ButtonGroup orientation="horizontal">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>horizontal orientation + looping</h2>
      <ButtonGroup orientation="horizontal" loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>vertical orientation + no looping</h2>
      <ButtonGroup orientation="vertical">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>vertical orientation + looping</h2>
      <ButtonGroup orientation="vertical" loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>
    </div>
  )
}

export const Nested = () => (
  <ButtonGroup orientation="vertical" loop>
    <Button value="1">1</Button>

    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button value="2" style={{ marginBottom: 10 }}>
        2
      </Button>

      <ButtonGroup orientation="horizontal" loop>
        <Button value="2.1">2.1</Button>
        <Button value="2.2">2.2</Button>
        <Button disabled value="2.3">
          2.3
        </Button>
        <Button value="2.4">2.4</Button>
      </ButtonGroup>
    </div>

    <Button value="3" disabled>
      3
    </Button>
    <Button value="4">4</Button>
  </ButtonGroup>
)

export const EdgeCases = () => {
  const [extra, setExtra] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [disabled3To5, setDisabled3To5] = useState(false)

  return (
    <>
      <button onClick={() => setExtra(x => !x)}>Add/remove extra</button>
      <button onClick={() => setDisabled(x => !x)}>Disable/Enable "One"</button>
      <button onClick={() => setHidden(x => !x)}>Hide/show "One"</button>
      <button onClick={() => setDisabled3To5(x => !x)}>Disable/Enable "Three" to "Five"</button>
      <hr />

      <ButtonGroup>
        {extra ? <Button value="extra">Extra</Button> : null}
        <Button value="one" disabled={disabled} style={{ display: hidden ? "none" : undefined }}>
          One
        </Button>
        <Button value="two" disabled>
          Two
        </Button>
        <Button value="three" disabled={disabled3To5}>
          Three
        </Button>
        <Button value="four" disabled={disabled3To5} style={{ display: "none" }}>
          Four
        </Button>
        <Button value="five" disabled={disabled3To5}>
          Five
        </Button>
      </ButtonGroup>

      <hr />
      <button type="button">Focusable outside of group</button>
    </>
  )
}

const ButtonGroupContext = createContext<{
  value?: string
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>
}>({} as any)

type ButtonGroupProps = Omit<React.ComponentPropsWithRef<"div">, "defaultValue"> & {
  defaultValue?: string
  orientation?: "horizontal" | "vertical"
  loop?: boolean
}

const ButtonGroup = ({ defaultValue, ...props }: ButtonGroupProps) => {
  const [value, setValue] = useState(defaultValue)
  return (
    <ButtonGroupContext.Provider value={{ value, setValue }}>
      <RovingFocusGroup.Root
        {...props}
        style={{
          ...props.style,
          display: "inline-flex",
          flexDirection: props.orientation === "vertical" ? "column" : "row",
          gap: 10,
        }}
      />
    </ButtonGroupContext.Provider>
  )
}

type ButtonProps = Omit<React.ComponentPropsWithRef<"button">, "value"> & { value?: string }

const Button = (props: ButtonProps) => {
  const { value: contextValue, setValue } = useContext(ButtonGroupContext)
  const isSelected =
    contextValue !== undefined && props.value !== undefined && contextValue === props.value

  return (
    <RovingFocusGroup.Item asChild active={isSelected} focusable={!props.disabled}>
      <button
        {...props}
        style={{
          ...props.style,
          border: "1px solid",
          borderColor: "#ccc",
          padding: "5px 10px",
          borderRadius: 5,
          outlineColor: "red",
          ...(isSelected
            ? {
                borderColor: "black",
                backgroundColor: "black",
                color: "white",
              }
            : {}),
        }}
        onClick={props.disabled ? undefined : () => setValue(props.value)}
        onFocus={mergeEventHandlers(props.onFocus, event => {
          if (contextValue !== undefined) {
            event.target.click()
          }
        })}
      />
    </RovingFocusGroup.Item>
  )
}
