import Label from "#label"
import Checkbox from "."
import * as styles from "./Checkbox.stories.css"
import { useState } from "react"
import { animated, useTransition } from "react-spring"

export default {
  title: "Components/Checkbox",
}

export const Styled = () => (
  <>
    <p>This checkbox is nested inside a label. The state is uncontrolled.</p>

    <h1>Custom label</h1>
    <Label className={styles.label}>
      Label{" "}
      <Checkbox.Root className={styles.root}>
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Root>
    </Label>

    <br />
    <br />

    <h1>Native label</h1>
    <label>
      Label{" "}
      <Checkbox.Root className={styles.root}>
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Root>
    </label>

    <h1>Native label + native checkbox</h1>
    <label>
      Label <input type="checkbox" />
    </label>

    <h1>Custom label + htmlFor</h1>
    <Label htmlFor="one">Label</Label>
    <Checkbox.Root className={styles.root} id="one">
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <br />
    <br />

    <h1>Native label + htmlFor</h1>
    <label htmlFor="two">Label</label>
    <Checkbox.Root className={styles.root} id="two">
      <Checkbox.Indicator className={styles.indicator} />
    </Checkbox.Root>

    <h1>Native label + native checkbox</h1>
    <label htmlFor="three">Label</label>
    <input type="checkbox" id="three" />
  </>
)

export const Controlled = () => {
  const [checked, setChecked] = useState<boolean | "indeterminate">(true)

  return (
    <>
      <p>This checkbox is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">Label</Label>
      <Checkbox.Root
        className={styles.root}
        checked={checked}
        onCheckedChange={setChecked}
        id="randBox"
      >
        <Checkbox.Indicator className={styles.indicator} />
      </Checkbox.Root>
    </>
  )
}

export const Indeterminate = () => {
  const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate")

  return (
    <>
      <p>
        <Checkbox.Root className={styles.root} checked={checked} onCheckedChange={setChecked}>
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.Root>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked(prevIsChecked => (prevIsChecked === "indeterminate" ? false : "indeterminate"))
        }
      >
        Toggle indeterminate
      </button>
    </>
  )
}

export const WithinForm = () => {
  const [data, setData] = useState({ optional: false, required: false, stopprop: false })
  const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate")

  return (
    <form
      onSubmit={event => event.preventDefault()}
      onChange={event => {
        const input = event.target as HTMLInputElement
        setData(prevData => ({ ...prevData, [input.name]: input.checked }))
      }}
    >
      <fieldset>
        <legend>optional checked: {String(data.optional)}</legend>
        <label className={styles.label}>
          <Checkbox.Root
            className={styles.root}
            name="optional"
            checked={checked}
            onCheckedChange={setChecked}
          >
            <Checkbox.Indicator className={styles.indicator} />
          </Checkbox.Root>
          with label
        </label>
        <br />
        <br />

        <button
          type="button"
          onClick={() => {
            setChecked(prevChecked => {
              return prevChecked === "indeterminate" ? false : "indeterminate"
            })
          }}
        >
          Toggle indeterminate
        </button>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required checked: {String(data.required)}</legend>
        <Checkbox.Root className={styles.root} name="required" required>
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation checked: {String(data.stopprop)}</legend>
        <Checkbox.Root
          className={styles.root}
          name="stopprop"
          onClick={event => event.stopPropagation()}
        >
          <Checkbox.Indicator className={styles.indicator} />
        </Checkbox.Root>
      </fieldset>

      <br />
      <br />

      <button type="reset">Reset</button>
      <button>Submit</button>
    </form>
  )
}

export const Animated = () => {
  const [checked, setChecked] = useState<boolean | "indeterminate">("indeterminate")
  const transition = useTransition(!!checked, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  return (
    <>
      <p>
        <Checkbox.Root className={styles.root} checked={checked} onCheckedChange={setChecked}>
          {transition(
            (style, checked) =>
              checked && (
                <AnimatedCheckboxIndicator
                  style={{
                    ...style,
                    transition: "height 300ms",
                  }}
                  className={styles.indicator}
                  forceMount
                />
              ),
          )}
        </Checkbox.Root>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked(prevIsChecked => (prevIsChecked === "indeterminate" ? false : "indeterminate"))
        }
      >
        Toggle indeterminate
      </button>
    </>
  )
}

const AnimatedCheckboxIndicator = animated(Checkbox.Indicator)
