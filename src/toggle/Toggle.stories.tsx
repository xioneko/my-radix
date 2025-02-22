import Toggle from "."
import * as styles from "./Toggle.stories.css"
import { useState } from "react"

export default {
  title: "Components/Toggle",
}

export const Styled = () => <Toggle className={styles.root}>Toggle</Toggle>

export const Controlled = () => {
  const [pressed, setPressed] = useState(true)

  return (
    <Toggle className={styles.root} pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "On" : "Off"}
    </Toggle>
  )
}
