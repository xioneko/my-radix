import Label from "#label"
import Switch from "."
import * as styles from "./Switch.stories.css"
import { useState } from "react"

export default {
  title: "Components/Switch",
}

export const Styled = () => (
  <>
    <p>This switch is nested inside a label. The state is uncontrolled.</p>
    <Label className={styles.label}>
      This is the label{" "}
      <Switch.Root className={styles.root}>
        <Switch.Thumb className={styles.thumb} />
      </Switch.Root>
    </Label>
  </>
)

export const Controlled = () => {
  const [checked, setChecked] = useState(true)

  return (
    <>
      <p>This switch is placed adjacent to its label. The state is controlled.</p>
      <Label className={styles.label} htmlFor="randBox">
        This is the label
      </Label>{" "}
      <Switch.Root
        className={styles.root}
        checked={checked}
        onCheckedChange={setChecked}
        id="randBox"
      >
        <Switch.Thumb className={styles.thumb} />
      </Switch.Root>
    </>
  )
}

export const WithinForm = () => {
  const [data, setData] = useState({ optional: false, required: false, stopprop: false })
  const [checked, setChecked] = useState(false)

  return (
    <form
      onSubmit={event => event.preventDefault()}
      onChange={event => {
        const input = event.target as HTMLInputElement
        console.log(input.name, input.checked)
        setData(prevData => ({ ...prevData, [input.name]: input.checked }))
      }}
    >
      <fieldset>
        <legend>optional checked: {String(data.optional)}</legend>
        <label>
          <Switch.Root
            className={styles.root}
            name="optional"
            checked={checked}
            onCheckedChange={setChecked}
          >
            <Switch.Thumb className={styles.thumb} />
          </Switch.Root>{" "}
          with label
        </label>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required checked: {String(data.required)}</legend>
        <Switch.Root className={styles.root} name="required" required>
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation checked: {String(data.stopprop)}</legend>
        <Switch.Root
          className={styles.root}
          name="stopprop"
          onClick={event => event.stopPropagation()}
        >
          <Switch.Thumb className={styles.thumb} />
        </Switch.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  )
}
