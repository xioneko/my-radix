import Label from "#label"
import CheckboxGroup from "."
import * as styles from "./CheckboxGroup.stories.css"
import { useEffect, useState } from "react"

export default {
  title: "Components/CheckboxGroup",
}

export const Styled = () => (
  <CheckboxGroup.Root className={styles.root} defaultValue={["1"]} name="example">
    <CheckboxGroupItem value="1">Fun</CheckboxGroupItem>
    <CheckboxGroupItem value="2" disabled>
      Serious
    </CheckboxGroupItem>
    <CheckboxGroupItem value="3">Smart</CheckboxGroupItem>
  </CheckboxGroup.Root>
)

export const Controlled = () => {
  const [value, setValue] = useState<string[]>([])
  useEffect(() => {
    console.log("Value:", value)
  })
  return (
    <CheckboxGroup.Root
      className={styles.root}
      value={value}
      onValueChange={setValue}
      name="example"
    >
      <CheckboxGroupItem value="1">Fun</CheckboxGroupItem>
      <CheckboxGroupItem value="2">Serious</CheckboxGroupItem>
      <CheckboxGroupItem value="3">Smart</CheckboxGroupItem>
    </CheckboxGroup.Root>
  )
}

export const WithinForm = () => (
  <form
    onSubmit={event => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      for (const [name, value] of formData) {
        console.log(name, value)
      }
    }}
  >
    <fieldset>
      <legend>Custom</legend>
      <CheckboxGroup.Root className={styles.root} defaultValue={["1", "2"]} name="custom">
        <CheckboxGroupItem value="1">Fun</CheckboxGroupItem>
        <CheckboxGroupItem value="2">Serious</CheckboxGroupItem>
        <CheckboxGroupItem value="3">Smart</CheckboxGroupItem>
      </CheckboxGroup.Root>
    </fieldset>
    <br />
    <fieldset>
      <legend>Native</legend>
      <label>
        Fun <input type="checkbox" name="native" value="1" defaultChecked />
      </label>
      <label>
        Serious <input type="checkbox" name="native" value="2" defaultChecked />
      </label>
      <label>
        Smart <input type="checkbox" name="native" value="3" />
      </label>
    </fieldset>
    <button type="submit">Submit</button>
  </form>
)

const CheckboxGroupItem = ({
  children,
  value,
  disabled,
}: {
  children: React.ReactNode
  value: string
  disabled?: true
}) => {
  return (
    <Label className={styles.label}>
      {children}
      <CheckboxGroup.Item className={styles.item} value={value} disabled={disabled}>
        <CheckboxGroup.Indicator className={styles.indicator} />
      </CheckboxGroup.Item>
    </Label>
  )
}
