import Label from "#label"
import RadioGroup from "."
import * as styles from "./RadioGroup.stories.css"
import { useEffect, useState } from "react"
import { animated, useTransition } from "react-spring"

export default {
  title: "Components/RadioGroup",
}

export const Styled = () => (
  <Label className={styles.label}>
    Favourite pet
    <RadioGroup.Root className={styles.root} defaultValue="1">
      <Label className={styles.label}>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Cat
      </Label>
      <Label className={styles.label}>
        <RadioGroup.Item className={styles.item} value="2">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Dog
      </Label>
      <Label className={styles.label}>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
)

export const Controlled = () => {
  const [value, setValue] = useState("2")

  return (
    <RadioGroup.Root className={styles.root} value={value} onValueChange={setValue}>
      <RadioGroup.Item className={styles.item} value="1">
        <RadioGroup.Indicator className={styles.indicator} />
      </RadioGroup.Item>
      <RadioGroup.Item className={styles.item} value="2">
        <RadioGroup.Indicator className={styles.indicator} />
      </RadioGroup.Item>
      <RadioGroup.Item className={styles.item} value="3">
        <RadioGroup.Indicator className={styles.indicator} />
      </RadioGroup.Item>
    </RadioGroup.Root>
  )
}

export const Unset = () => (
  <Label className={styles.label}>
    Favourite pet
    <RadioGroup.Root className={styles.root}>
      <Label className={styles.label}>
        <RadioGroup.Item className={styles.item} value="1">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Cat
      </Label>
      <Label className={styles.label}>
        <RadioGroup.Item className={styles.item} value="2" disabled>
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Dog
      </Label>
      <Label className={styles.label}>
        <RadioGroup.Item className={styles.item} value="3">
          <RadioGroup.Indicator className={styles.indicator} />
        </RadioGroup.Item>
        Rabbit
      </Label>
    </RadioGroup.Root>
  </Label>
)

export const WithinForm = () => {
  const [data, setData] = useState({ optional: "", required: "", stopprop: "" })
  useEffect(() => {
    console.log(data)
  })
  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        console.log(Object.fromEntries(new FormData(event.currentTarget).entries()))
      }}
      onChange={event => {
        const radio = event.target as HTMLInputElement
        console.log(radio.name, radio.value)
        setData(prevData => ({ ...prevData, [radio.name]: radio.value }))
      }}
    >
      <fieldset>
        <legend>optional value: {data.optional}</legend>
        <RadioGroup.Root className={styles.root} name="optional">
          <RadioGroup.Item className={styles.item} value="1">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="2">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="3">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation value: {data.stopprop}</legend>
        <RadioGroup.Root className={styles.root} name="stopprop">
          <RadioGroup.Item
            className={styles.item}
            value="1"
            onClick={event => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item
            className={styles.item}
            value="2"
            onClick={event => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item
            className={styles.item}
            value="3"
            onClick={event => event.stopPropagation()}
          >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required value: {data.required}</legend>
        <RadioGroup.Root className={styles.root} name="required" required>
          <RadioGroup.Item className={styles.item} value="1">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="2" >
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          <RadioGroup.Item className={styles.item} value="3">
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
        </RadioGroup.Root>
      </fieldset>

      <br />
      <br />

      <button>Submit</button>
    </form>
  )
}

export const Animated = () => {
  const [value, setValue] = useState("1")
  const transitions = ["1", "2", "3"].map(v =>
    useTransition(value === v, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    }),
  )
  return (
    <Label className={styles.label}>
      Favourite pet
      <RadioGroup.Root className={styles.root} value={value} onValueChange={setValue}>
        <Label className={styles.label}>
          <RadioGroup.Item className={styles.item} value="1">
            {transitions[0]((style, checked) => {
              return (
                checked && (
                  <AnimatedRadioGroupItem className={styles.indicator} style={style} forceMount />
                )
              )
            })}
          </RadioGroup.Item>
          Cat
        </Label>
        <Label className={styles.label}>
          <RadioGroup.Item className={styles.item} value="2">
            {transitions[1]((style, checked) => {
              return (
                checked && (
                  <AnimatedRadioGroupItem className={styles.indicator} style={style} forceMount />
                )
              )
            })}
          </RadioGroup.Item>
          Dog
        </Label>
        <Label className={styles.label}>
          <RadioGroup.Item className={styles.item} value="3">
            {transitions[2]((style, checked) => {
              return (
                checked && (
                  <AnimatedRadioGroupItem className={styles.indicator} style={style} forceMount />
                )
              )
            })}
          </RadioGroup.Item>
          Rabbit
        </Label>
      </RadioGroup.Root>
    </Label>
  )
}

const AnimatedRadioGroupItem = animated(RadioGroup.Indicator)
