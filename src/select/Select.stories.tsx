import Dialog from "#dialog"
import Label from "#label"
import Select from "."
import * as styles from "./Select.stories.css"
import { Fragment, useEffect, useState } from "react"

export default {
  title: "Components/Select",
}

export const Styled = () => (
  <div style={{ display: "flex", gap: 20, padding: 50 }}>
    <Label>
      Choose a number:
      <Select.Root defaultValue="two">
        <Select.Trigger className={styles.trigger}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content} sideOffset={5}>
            <Select.Viewport className={styles.viewport}>
              <Select.Item className={styles.item} value="one">
                <Select.ItemText>
                  One<span aria-hidden> 👍</span>
                </Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={styles.item} value="two">
                <Select.ItemText>
                  Two<span aria-hidden> 👌</span>
                </Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={styles.item} value="three">
                <Select.ItemText>
                  Three<span aria-hidden> 🤘</span>
                </Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Label>
  </div>
)

export const Controlled = () => {
  const [value, setValue] = useState("uk")
  return (
    <div style={{ display: "flex", gap: 20, padding: 50 }}>
      <Label>
        Choose a country:
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Trigger className={styles.trigger}>
            <Select.Value
              aria-label={
                value === "fr"
                  ? "France"
                  : value === "uk"
                    ? "United Kingdom"
                    : value === "es"
                      ? "Spain"
                      : undefined
              }
            >
              {value === "fr" ? "🇫🇷" : value === "uk" ? "🇬🇧" : value === "es" ? "🇪🇸" : null}
            </Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} sideOffset={5}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>
                    France<span aria-hidden> 🇫🇷</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>
                    United Kingdom<span aria-hidden> 🇬🇧</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>
                    Spain<span aria-hidden> 🇪🇸</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    </div>
  )
}

export const NoDefaultValue = () => (
  <div
    style={{
      display: "flex",
      gap: 20,
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}
  >
    <Label>
      Choose a number:
      <Select.Root>
        <Select.Trigger className={styles.trigger}>
          <Select.Value placeholder="Pick an option" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content} sideOffset={5}>
            <Select.Viewport className={styles.viewport}>
              <Select.Item className={styles.item} value="one" disabled>
                <Select.ItemText>One</Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={styles.item} value="two">
                <Select.ItemText>Two</Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
              <Select.Item className={styles.item} value="three">
                <Select.ItemText>Three</Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <TickIcon />
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Label>
  </div>
)

export const Typeahead = () => (
  <div
    style={{
      display: "flex",
      gap: 20,
      alignItems: "center",
      justifyContent: "center",
      height: "300vh",
    }}
  >
    <Label>
      Favourite food:
      <Select.Root defaultValue="banana">
        <Select.Trigger className={styles.trigger}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content} sideOffset={5}>
            {/* <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton> */}
            <Select.Viewport className={styles.viewport}>
              {foodGroups.map(foodGroup =>
                foodGroup.foods.map(food => (
                  <Select.Item key={food.value} className={styles.item} value={food.value}>
                    <Select.ItemText>{food.label}</Select.ItemText>
                    <Select.ItemIndicator className={styles.indicator}>
                      <TickIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                )),
              )}
            </Select.Viewport>
            {/* <Select.ScrollDownButton className={scrollDownButtonClass()}>▼</Select.ScrollDownButton> */}
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Label>
  </div>
)

export const WithGroups = () => {
  useEffect(() => {
    window.scrollTo({ top: window.innerHeight })
  })
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "center",
        justifyContent: "center",
        height: "300vh",
      }}
    >
      <Label>
        Favourite food:
        <Select.Root defaultValue="banana">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} sideOffset={5}>
              {/* <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton> */}
              <Select.Viewport className={styles.viewport}>
                {foodGroups.map((foodGroup, index) => {
                  const hasLabel = foodGroup.label !== undefined
                  return (
                    <Fragment key={index}>
                      <Select.Group>
                        {hasLabel && (
                          <Select.Label className={styles.label} key={foodGroup.label}>
                            {foodGroup.label}
                          </Select.Label>
                        )}
                        {foodGroup.foods.map(food => (
                          <Select.Item
                            key={food.value}
                            className={hasLabel ? styles.itemInGroup : styles.item}
                            value={food.value}
                          >
                            <Select.ItemText>{food.label}</Select.ItemText>
                            <Select.ItemIndicator className={styles.indicator}>
                              <TickIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>
                      {index < foodGroups.length - 1 && (
                        <Select.Separator className={styles.separator} />
                      )}
                    </Fragment>
                  )
                })}
              </Select.Viewport>
              {/* <Select.ScrollDownButton className={scrollDownButtonClass()}>
                ▼
              </Select.ScrollDownButton> */}
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
    </div>
  )
}

export const Labelling = () => {
  const content = (
    <Select.Portal>
      <Select.Content className={styles.content}>
        <Select.Viewport className={styles.viewport}>
          <Select.Item className={styles.item} value="0-18">
            <Select.ItemText>0 to 18</Select.ItemText>
            <Select.ItemIndicator className={styles.indicator}>
              <TickIcon />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item className={styles.item} value="18-40">
            <Select.ItemText>18 to 40</Select.ItemText>
            <Select.ItemIndicator className={styles.indicator}>
              <TickIcon />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item className={styles.item} value="40+">
            <Select.ItemText>Over 40</Select.ItemText>
            <Select.ItemIndicator className={styles.indicator}>
              <TickIcon />
            </Select.ItemIndicator>
          </Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  )
  return (
    <div style={{ padding: 50 }}>
      <h1>`Label` wrapping</h1>
      <Label>
        What is your age?
        <Select.Root defaultValue="18-40">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          {content}
        </Select.Root>
      </Label>

      <h1>`Label` with `htmlFor`</h1>
      <Label htmlFor="age-Label">What is your age?</Label>
      <Select.Root defaultValue="18-40">
        <Select.Trigger className={styles.trigger} id="age-Label">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        {content}
      </Select.Root>
    </div>
  )
}

export const WithinForm = () => {
  const [data, setData] = useState({})

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    setData(Object.fromEntries((formData as any).entries()))
  }

  return (
    <form
      style={{ padding: 50 }}
      onSubmit={event => {
        handleChange(event)
        event.preventDefault()
      }}
      onChange={handleChange}
    >
      <Label style={{ display: "block" }}>
        Name
        <input name="name" autoComplete="name" style={{ display: "block" }} />
      </Label>
      <br />
      <Label style={{ display: "block" }}>
        Country
        <Select.Root name="country" autoComplete="country" defaultValue="fr">
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>France</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>United Kingdom</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>Spain</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
      <br />
      <button type="submit">Submit</button>
      <br />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  )
}

export const DisabledWithinForm = () => {
  const [data, setData] = useState({})

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    setData(Object.fromEntries((formData as any).entries()))
  }

  return (
    <form
      style={{ padding: 50 }}
      onSubmit={event => {
        handleChange(event)
        event.preventDefault()
      }}
      onChange={handleChange}
    >
      <Label style={{ display: "block" }}>
        Name
        <input name="name" autoComplete="name" style={{ display: "block" }} />
      </Label>
      <br />
      <Label style={{ display: "block" }}>
        Country
        <Select.Root name="country" autoComplete="country" defaultValue="fr" disabled>
          <Select.Trigger className={styles.trigger}>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>France</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>United Kingdom</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>Spain</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
      <br />
      <button type="submit">Submit</button>
      <br />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  )
}

export const RequiredWithinForm = () => {
  const [data, setData] = useState({})

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    setData(Object.fromEntries((formData as any).entries()))
  }

  return (
    <form
      style={{ padding: 50 }}
      onSubmit={event => {
        handleChange(event)
        event.preventDefault()
      }}
      onChange={handleChange}
    >
      <Label style={{ display: "block" }}>
        Name
        <input name="name" autoComplete="name" style={{ display: "block" }} />
      </Label>
      <br />
      <Label style={{ display: "block" }}>
        Country
        <Select.Root required name="country" autoComplete="country">
          <Select.Trigger className={styles.trigger}>
            <Select.Value placeholder="Pick an option" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content}>
              <Select.Viewport className={styles.viewport}>
                <Select.Item className={styles.item} value="fr">
                  <Select.ItemText>France</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="uk">
                  <Select.ItemText>United Kingdom</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={styles.item} value="es">
                  <Select.ItemText>Spain</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Label>
      <br />
      <button type="submit">Submit</button>
      <br />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </form>
  )
}

export const WithinDialog = () => (
  <div style={{ height: "120vh" }}>
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content aria-describedby={undefined} style={{ position: "fixed", top: 100 }}>
          <Dialog.Title>A select in a dialog</Dialog.Title>
          <Label>
            Choose a number:
            <Select.Root defaultValue="2">
              <Select.Trigger className={styles.trigger}>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={styles.content}>
                  {/* <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton> */}
                  <Select.Viewport className={styles.viewport}>
                    {Array.from({ length: 30 }, (_, i) => (
                      <Select.Item key={i} className={styles.item} value={String(i)}>
                        <Select.ItemText>Item {i}</Select.ItemText>
                        <Select.ItemIndicator className={styles.indicator}>
                          <TickIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                  {/* <Select.ScrollDownButton className={scrollDownButtonClass()}>
                    ▼
                  </Select.ScrollDownButton> */}
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </Label>
          <Dialog.Close>Close Dialog</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
)

export const WithVeryLongSelectItems = () => (
  <div style={{ paddingLeft: 300 }}>
    <Label>
      What is the meaning of life?
      <Select.Root defaultValue="1">
        <Select.Trigger className={styles.trigger}>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.content}>
            {/* <Select.ScrollUpButton className={scrollUpButtonClass()}>▲</Select.ScrollUpButton> */}
            <Select.Viewport className={styles.viewport}>
              {[
                "The meaning of life is a complex topic that has been the subject of much philosophical, scientific, and theological speculation, with no definitive answer. The meaning of life can be interpreted in many different ways, depending on individual beliefs, values, and experiences.",
                "42",
              ].map((opt, i) => (
                <Select.Item
                  key={opt}
                  className={styles.item}
                  value={String(i)}
                  // style={{ maxWidth: 500 }}
                >
                  <Select.ItemText>{opt}</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <TickIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            {/* <Select.ScrollDownButton className={scrollDownButtonClass()}>▼</Select.ScrollDownButton> */}
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Label>
  </div>
)

const TickIcon = () => (
  <svg
    style={{ display: "block" }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="12"
    height="12"
    fill="none"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <path d="M2 20 L12 28 30 4" />
  </svg>
)

const foodGroups: Array<{
  label?: string
  foods: Array<{ value: string; label: string; disabled?: boolean }>
}> = [
  {
    label: "Fruits",
    foods: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "blueberry", label: "Blueberry" },
      { value: "grapes", label: "Grapes" },
      { value: "pineapple", label: "Pineapple" },
    ],
  },
  {
    label: "Vegetables",
    foods: [
      { value: "aubergine", label: "Aubergine" },
      { value: "broccoli", label: "Broccoli" },
      { value: "carrot", label: "Carrot", disabled: true },
      { value: "courgette", label: "Courgette" },
      { value: "leek", label: "Leek" },
    ],
  },
  {
    label: "Meat",
    foods: [
      { value: "beef", label: "Beef" },
      { value: "beef-with-sauce", label: "Beef with sauce" },
      { value: "chicken", label: "Chicken" },
      { value: "lamb", label: "Lamb" },
      { value: "pork", label: "Pork" },
    ],
  },
  {
    foods: [
      { value: "candies", label: "Candies" },
      { value: "chocolates", label: "Chocolates" },
    ],
  },
]
