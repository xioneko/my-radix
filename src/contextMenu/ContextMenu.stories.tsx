import ContextMenu from "."
import * as styles from "./ContextMenu.stories.css"
import { useState } from "react"
import { animated, useTransition } from "react-spring"

export default {
  title: "Components/ContextMenu",
}

export const Styled = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "200vw",
      height: "200vh",
      gap: 20,
    }}
  >
    <ContextMenu.Root>
      <ContextMenu.Trigger className={styles.trigger}>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={styles.content} alignOffset={-5}>
          <ContextMenu.Item className={styles.item} onSelect={() => console.log("undo")}>
            Undo
          </ContextMenu.Item>
          <ContextMenu.Item className={styles.item} onSelect={() => console.log("redo")}>
            Redo
          </ContextMenu.Item>
          <ContextMenu.Separator className={styles.separator} />
          <ContextMenu.Item className={styles.item} disabled onSelect={() => console.log("cut")}>
            Cut
          </ContextMenu.Item>
          <ContextMenu.Item className={styles.item} onSelect={() => console.log("copy")}>
            Copy
          </ContextMenu.Item>
          <ContextMenu.Item className={styles.item} onSelect={() => console.log("paste")}>
            Paste
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  </div>
)

export const Modality = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "110vh" }}>
    <div style={{ display: "grid", gap: 50 }}>
      <div style={{ display: "inline-flex", alignItems: "center", flexDirection: "column" }}>
        <h1>Modal (default)</h1>
        <ContextMenu.Root>
          <ContextMenu.Trigger className={styles.trigger} />
          <ContextMenu.Portal>
            <ContextMenu.Content className={styles.content} alignOffset={-5}>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("undo")}>
                Undo
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("redo")}>
                Redo
              </ContextMenu.Item>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={styles.subTrigger}>
                  Submenu →
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    className={styles.content}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("one")}>
                      One
                    </ContextMenu.Item>
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("two")}>
                      Two
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={styles.separator} />
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className={styles.subTrigger}>
                        Submenu →
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.SubContent
                          className={styles.content}
                          sideOffset={12}
                          alignOffset={-6}
                        >
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("one")}
                          >
                            One
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("two")}
                          >
                            Two
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("three")}
                          >
                            Three
                          </ContextMenu.Item>
                          <ContextMenu.Arrow />
                        </ContextMenu.SubContent>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                    <ContextMenu.Separator className={styles.separator} />
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("three")}>
                      Three
                    </ContextMenu.Item>
                    <ContextMenu.Arrow />
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Item
                className={styles.item}
                disabled
                onSelect={() => console.log("cut")}
              >
                Cut
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("copy")}>
                Copy
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("paste")}>
                Paste
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
        <textarea
          style={{ width: 500, height: 100, marginTop: 10 }}
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
        />
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", flexDirection: "column" }}>
        <h1>Non modal</h1>
        <ContextMenu.Root modal={false}>
          <ContextMenu.Trigger className={styles.trigger} />
          <ContextMenu.Portal>
            <ContextMenu.Content className={styles.content} alignOffset={-5}>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("undo")}>
                Undo
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("redo")}>
                Redo
              </ContextMenu.Item>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={styles.subTrigger}>
                  Submenu →
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    className={styles.content}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("one")}>
                      One
                    </ContextMenu.Item>
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("two")}>
                      Two
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={styles.separator} />
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className={styles.subTrigger}>
                        Submenu →
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.SubContent
                          className={styles.content}
                          sideOffset={12}
                          alignOffset={-6}
                        >
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("one")}
                          >
                            One
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("two")}
                          >
                            Two
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("three")}
                          >
                            Three
                          </ContextMenu.Item>
                          <ContextMenu.Arrow />
                        </ContextMenu.SubContent>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                    <ContextMenu.Separator className={styles.separator} />
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("three")}>
                      Three
                    </ContextMenu.Item>
                    <ContextMenu.Arrow />
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Item
                className={styles.item}
                disabled
                onSelect={() => console.log("cut")}
              >
                Cut
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("copy")}>
                Copy
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("paste")}>
                Paste
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
        <textarea
          style={{ width: 500, height: 100, marginTop: 10 }}
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet."
        />
      </div>
    </div>
  </div>
)

export const Submenus = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ContextMenu.Root>
          <ContextMenu.Trigger className={styles.trigger}>Right Click Here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className={styles.content}>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("new-tab")}>
                New Tab
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("new-window")}>
                New Window
              </ContextMenu.Item>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={styles.subTrigger}>
                  Bookmarks →
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    className={styles.content}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item className={styles.item} onSelect={() => console.log("index")}>
                      Inbox
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("calendar")}
                    >
                      Calendar
                    </ContextMenu.Item>
                    <ContextMenu.Separator className={styles.separator} />
                    <ContextMenu.Sub>
                      <ContextMenu.SubTrigger className={styles.subTrigger}>
                        WorkOS →
                      </ContextMenu.SubTrigger>
                      <ContextMenu.Portal>
                        <ContextMenu.SubContent
                          className={styles.content}
                          sideOffset={12}
                          alignOffset={-6}
                        >
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("stitches")}
                          >
                            Stitches
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("composer")}
                          >
                            Composer
                          </ContextMenu.Item>
                          <ContextMenu.Item
                            className={styles.item}
                            onSelect={() => console.log("radix")}
                          >
                            Radix
                          </ContextMenu.Item>
                          <ContextMenu.Arrow />
                        </ContextMenu.SubContent>
                      </ContextMenu.Portal>
                    </ContextMenu.Sub>
                    <ContextMenu.Separator className={styles.separator} />
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("notion")}
                    >
                      Notion
                    </ContextMenu.Item>
                    <ContextMenu.Arrow />
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={styles.subTrigger} disabled>
                  History →
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    className={styles.content}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("github")}
                    >
                      Github
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("google")}
                    >
                      Google
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("stack-overflow")}
                    >
                      Stack Overflow
                    </ContextMenu.Item>
                    <ContextMenu.Arrow />
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={styles.subTrigger}>
                  Tools →
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    className={styles.content}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("extensions")}
                    >
                      Extensions
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("task-manager")}
                    >
                      Task Manager
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("developer-tools")}
                    >
                      Developer Tools
                    </ContextMenu.Item>
                    <ContextMenu.Arrow />
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Item
                className={styles.item}
                disabled
                onSelect={() => console.log("print")}
              >
                Print…
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("cast")}>
                Cast…
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("find")}>
                Find…
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </div>
    </div>
  )
}

export const WithLabels = () => (
  <div style={{ textAlign: "center", padding: 50 }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger className={styles.trigger}>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={styles.content} alignOffset={-5}>
          {foodGroups.map((foodGroup, index) => (
            <ContextMenu.Group key={index}>
              {foodGroup.label && (
                <ContextMenu.Label className={styles.label} key={foodGroup.label}>
                  {foodGroup.label}
                </ContextMenu.Label>
              )}
              {foodGroup.foods.map(food => (
                <ContextMenu.Item
                  key={food.value}
                  className={styles.item}
                  disabled={food.disabled}
                  onSelect={() => console.log(food.label)}
                >
                  {food.label}
                </ContextMenu.Item>
              ))}
              {index < foodGroups.length - 1 && (
                <ContextMenu.Separator className={styles.separator} />
              )}
            </ContextMenu.Group>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  </div>
)

export const CheckboxItems = () => {
  const checkboxItems = ["Bold", "Italic", "Underline"]
  const [selection, setSelection] = useState<string[]>([])

  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className={styles.trigger}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={styles.content} alignOffset={-5}>
            <ContextMenu.Item className={styles.item} onSelect={() => console.log("show")}>
              Show fonts
            </ContextMenu.Item>
            <ContextMenu.Item className={styles.item} onSelect={() => console.log("bigger")}>
              Bigger
            </ContextMenu.Item>
            <ContextMenu.Item className={styles.item} onSelect={() => console.log("smaller")}>
              Smaller
            </ContextMenu.Item>
            <ContextMenu.Separator className={styles.separator} />
            {checkboxItems.map(item => (
              <ContextMenu.CheckboxItem
                key={item}
                className={styles.item}
                checked={selection.includes(item)}
                onCheckedChange={() =>
                  setSelection(current =>
                    current.includes(item)
                      ? current.filter(el => el !== item)
                      : current.concat(item),
                  )
                }
              >
                {item}
                <ContextMenu.ItemIndicator>
                  <TickIcon />
                </ContextMenu.ItemIndicator>
              </ContextMenu.CheckboxItem>
            ))}
            <ContextMenu.Separator />
            <ContextMenu.CheckboxItem className={styles.item} disabled>
              Strikethrough
              <ContextMenu.ItemIndicator>
                <TickIcon />
              </ContextMenu.ItemIndicator>
            </ContextMenu.CheckboxItem>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </div>
  )
}

export const RadioItems = () => {
  const files = ["README.md", "index.js", "page.css"]
  const [file, setFile] = useState(files[1])

  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger className={styles.trigger}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={styles.content} alignOffset={-5}>
            <ContextMenu.Item className={styles.item} onSelect={() => console.log("minimize")}>
              Minimize window
            </ContextMenu.Item>
            <ContextMenu.Item className={styles.item} onSelect={() => console.log("zoom")}>
              Zoom
            </ContextMenu.Item>
            <ContextMenu.Item className={styles.item} onSelect={() => console.log("smaller")}>
              Smaller
            </ContextMenu.Item>
            <ContextMenu.Separator className={styles.separator} />
            <ContextMenu.RadioGroup value={file} onValueChange={setFile}>
              {files.map(file => (
                <ContextMenu.RadioItem key={file} className={styles.item} value={file}>
                  {file}
                  <ContextMenu.ItemIndicator>
                    <TickIcon />
                  </ContextMenu.ItemIndicator>
                </ContextMenu.RadioItem>
              ))}
            </ContextMenu.RadioGroup>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <p>Selected file: {file}</p>
    </div>
  )
}

export const PreventClosing = () => (
  <div style={{ textAlign: "center", padding: 50 }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger className={styles.trigger}>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={styles.content} alignOffset={-5}>
          <ContextMenu.Item className={styles.item} onSelect={() => window.alert("action 1")}>
            I will close
          </ContextMenu.Item>
          <ContextMenu.Item
            className={styles.item}
            onSelect={() => {
              window.alert("action 1")
              return true
            }}
          >
            I won't close
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  </div>
)

export const Multiple = () => {
  const [customColors, setCustomColors] = useState<{ [index: number]: string }>({})
  const [fadedIndexes, setFadedIndexes] = useState<number[]>([])
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
      onContextMenu={event => event.preventDefault()}
    >
      {Array.from({ length: 100 }, (_, i) => {
        const customColor = customColors[i]
        const [open, setOpen] = useState(false)
        const transitions = useTransition(open, {
          from: { opacity: 0, transform: "scale(0.9)" },
          enter: { opacity: 1, transform: "scale(1)" },
          leave: { opacity: 0, transform: "scale(0.9)" },
          config: { tension: 300, friction: 26 },
        })
        return (
          <ContextMenu.Root key={i} onOpenChange={setOpen}>
            <ContextMenu.Portal>
              {transitions((transition, open) => {
                return (
                  open && (
                    <AnimatedContextMenuContent
                      className={styles.content}
                      alignOffset={-5}
                      style={transition}
                    >
                      <ContextMenu.Label className={styles.label}>Color</ContextMenu.Label>
                      <ContextMenu.RadioGroup
                        value={customColor}
                        onValueChange={color =>
                          setCustomColors(colors => ({ ...colors, [i]: color }))
                        }
                      >
                        <ContextMenu.RadioItem className={styles.item} value="royalblue">
                          Blue
                          <ContextMenu.ItemIndicator>
                            <TickIcon />
                          </ContextMenu.ItemIndicator>
                        </ContextMenu.RadioItem>
                        <ContextMenu.RadioItem className={styles.item} value="tomato">
                          Red
                          <ContextMenu.ItemIndicator>
                            <TickIcon />
                          </ContextMenu.ItemIndicator>
                        </ContextMenu.RadioItem>
                      </ContextMenu.RadioGroup>
                      <ContextMenu.Separator className={styles.separator} />
                      <ContextMenu.CheckboxItem
                        className={styles.item}
                        checked={fadedIndexes.includes(i)}
                        onCheckedChange={faded =>
                          setFadedIndexes(indexes =>
                            faded ? [...indexes, i] : indexes.filter(index => index !== i),
                          )
                        }
                      >
                        Fade
                        <ContextMenu.ItemIndicator>
                          <TickIcon />
                        </ContextMenu.ItemIndicator>
                      </ContextMenu.CheckboxItem>
                    </AnimatedContextMenuContent>
                  )
                )
              })}
            </ContextMenu.Portal>
            <ContextMenu.Trigger>
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 100,
                  backgroundColor: customColor ? customColor : "#eeeef0",
                  color: customColor ? "white" : "#666670",
                  fontSize: 32,
                  borderRadius: 5,
                  cursor: "default",
                  userSelect: "none",
                  opacity: fadedIndexes.includes(i) ? 0.5 : 1,
                }}
              >
                {i + 1}
              </div>
            </ContextMenu.Trigger>
          </ContextMenu.Root>
        )
      })}
    </div>
  )
}

const AnimatedContextMenuContent = animated(ContextMenu.Content)

export const Nested = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <ContextMenu.Root>
      <ContextMenu.Trigger
        className={styles.trigger}
        style={{ padding: 100, backgroundColor: "royalblue" }}
      >
        <ContextMenu.Root>
          <ContextMenu.Trigger className={styles.trigger} style={{ backgroundColor: "tomato" }} />
          <ContextMenu.Portal>
            <ContextMenu.Content className={styles.content} alignOffset={-5}>
              <ContextMenu.Label className={styles.label}>Red box menu</ContextMenu.Label>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("red action1")}>
                Red action 1
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.item} onSelect={() => console.log("red action2")}>
                Red action 2
              </ContextMenu.Item>
              <ContextMenu.Separator className={styles.separator} />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className={styles.subTrigger}>
                  Submenu →
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    className={styles.content}
                    sideOffset={12}
                    alignOffset={-6}
                  >
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("red sub action 1")}
                    >
                      Red sub action 1
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      className={styles.item}
                      onSelect={() => console.log("red sub action 2")}
                    >
                      Red sub action 2
                    </ContextMenu.Item>
                    <ContextMenu.Arrow />
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className={styles.content} alignOffset={-5}>
          <ContextMenu.Label className={styles.label}>Blue box menu</ContextMenu.Label>
          <ContextMenu.Separator className={styles.separator} />
          <ContextMenu.Item className={styles.item} onSelect={() => console.log("blue action1")}>
            Blue action 1
          </ContextMenu.Item>
          <ContextMenu.Item className={styles.item} onSelect={() => console.log("blue action2")}>
            Blue action 2
          </ContextMenu.Item>
          <ContextMenu.Separator className={styles.separator} />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className={styles.subTrigger}>Submenu →</ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent className={styles.content} sideOffset={12} alignOffset={-6}>
                <ContextMenu.Item
                  className={styles.item}
                  onSelect={() => console.log("blue sub action 1")}
                >
                  Blue sub action 1
                </ContextMenu.Item>
                <ContextMenu.Item
                  className={styles.item}
                  onSelect={() => console.log("blue sub action 2")}
                >
                  Blue sub action 2
                </ContextMenu.Item>
                <ContextMenu.Arrow />
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  </div>
)

const TickIcon = () => (
  <svg
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
