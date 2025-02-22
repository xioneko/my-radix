import ToggleGroup from "."
import * as styles from "./ToggleGroup.stories.css"
import { useEffect, useState } from "react"

export default {
  title: "Components/ToggleGroup",
}

export const Single = () => {
  const [value, setValue] = useState<string>()
  useEffect(() => {
    console.log(value)
  })
  return (
    <>
      <h1>Uncontrolled</h1>
      <ToggleGroup.Root type="single" className={styles.root} aria-label="Options" defaultValue="1">
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <h1>Controlled</h1>
      <ToggleGroup.Root
        type="single"
        className={styles.root}
        aria-label="Options"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </>
  )
}

export const Vertical = () => {
  return (
    <ToggleGroup.Root
      type="single"
      orientation="vertical"
      className={styles.root}
      aria-label="Options"
      defaultValue="1"
    >
      <ToggleGroup.Item value="1" className={styles.item}>
        Option 1
      </ToggleGroup.Item>
      <ToggleGroup.Item value="2" className={styles.item}>
        Option 2
      </ToggleGroup.Item>
      <ToggleGroup.Item value="3" className={styles.item}>
        Option 3
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

export const Multiple = () => {
  const [value, setValue] = useState<string[]>([])
  useEffect(() => {
    console.log(value)
  })
  return (
    <>
      <h1>Uncontrolled</h1>
      <ToggleGroup.Root
        type="multiple"
        className={styles.root}
        aria-label="Options"
        defaultValue={["1"]}
      >
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>

      <h1>Controlled</h1>
      <ToggleGroup.Root
        type="multiple"
        className={styles.root}
        aria-label="Options"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroup.Item value="1" className={styles.item}>
          Option 1
        </ToggleGroup.Item>
        <ToggleGroup.Item value="2" className={styles.item}>
          Option 2
        </ToggleGroup.Item>
        <ToggleGroup.Item value="3" className={styles.item}>
          Option 3
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </>
  )
}