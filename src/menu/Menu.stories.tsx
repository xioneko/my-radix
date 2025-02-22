import Menu from "."
import * as styles from "./Menu.stories.css"
import { useState } from "react"
import { useTransition, animated, config } from "react-spring"

export default {
  title: "Base/Menu",
}

export const Styled = () => (
  <MenuWithAnchor>
    <Menu.Item className={styles.item} onSelect={() => window.alert("undo")}>
      Undo
    </Menu.Item>
    <Menu.Item className={styles.item} onSelect={() => window.alert("redo")}>
      Redo
    </Menu.Item>
    <Menu.Separator className={styles.separator} />
    <Menu.Item className={styles.item} disabled onSelect={() => window.alert("cut")}>
      Cut
    </Menu.Item>
    <Menu.Item className={styles.item} onSelect={() => window.alert("copy")}>
      Copy
    </Menu.Item>
    <Menu.Item className={styles.item} onSelect={() => window.alert("paste")}>
      Paste
    </Menu.Item>
  </MenuWithAnchor>
)

export const Submenus = () => {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)
  const [animated, setAnimated] = useState(false)

  return (
    <>
      <div style={{ marginBottom: 8, display: "grid", gridAutoFlow: "row", gap: 4 }}>
        <label>
          <input
            type="checkbox"
            checked={animated}
            onChange={event => setAnimated(event.currentTarget.checked)}
          />
          Animated
        </label>
      </div>
      <MenuWithAnchor>
        <Menu.Item className={styles.item} onSelect={() => window.alert("undo")}>
          Undo
        </Menu.Item>
        <Submenu open={open1} onOpenChange={setOpen1} animated={animated}>
          <Menu.Item className={styles.item} disabled>
            Disabled
          </Menu.Item>
          <Menu.Item className={styles.item} onSelect={() => window.alert("one")}>
            One
          </Menu.Item>
          <Submenu open={open2} onOpenChange={setOpen2} animated={animated}>
            <Menu.Item className={styles.item} onSelect={() => window.alert("one")}>
              One
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("two")}>
              Two
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("three")}>
              Three
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("four")}>
              Four
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("five")}>
              Five
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("six")}>
              Six
            </Menu.Item>
          </Submenu>
          <Submenu heading="Sub Menu" open={open3} onOpenChange={setOpen3} animated={animated}>
            <Menu.Item className={styles.item} onSelect={() => window.alert("one")}>
              One
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("two")}>
              Two
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("three")}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className={styles.item} onSelect={() => window.alert("two")}>
            Two
          </Menu.Item>
          <Submenu open={open4} onOpenChange={setOpen4} animated={animated} disabled>
            <Menu.Item className={styles.item} onSelect={() => window.alert("one")}>
              One
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("two")}>
              Two
            </Menu.Item>
            <Menu.Item className={styles.item} onSelect={() => window.alert("three")}>
              Three
            </Menu.Item>
          </Submenu>
          <Menu.Item className={styles.item} onSelect={() => window.alert("three")}>
            Three
          </Menu.Item>
        </Submenu>

        <Menu.Separator className={styles.separator} />
        <Menu.Item className={styles.item} disabled onSelect={() => window.alert("cut")}>
          Cut
        </Menu.Item>
        <Menu.Item className={styles.item} onSelect={() => window.alert("copy")}>
          Copy
        </Menu.Item>
        <Menu.Item className={styles.item} onSelect={() => window.alert("paste")}>
          Paste
        </Menu.Item>
      </MenuWithAnchor>
    </>
  )
}

export const WithLabels = () => (
  <MenuWithAnchor>
    {foodGroups.map((foodGroup, index) => (
      <Menu.Group key={index}>
        {foodGroup.label && (
          <Menu.Label className={styles.label} key={foodGroup.label}>
            {foodGroup.label}
          </Menu.Label>
        )}
        {foodGroup.foods.map(food => (
          <Menu.Item
            key={food.value}
            className={styles.item}
            disabled={food.disabled}
            onSelect={() => window.alert(food.label)}
          >
            {food.label}
          </Menu.Item>
        ))}
        {index < foodGroups.length - 1 && <Menu.Separator className={styles.separator} />}
      </Menu.Group>
    ))}
  </MenuWithAnchor>
)

export const CheckboxItems = () => {
  const options = ["Crows", "Ravens", "Magpies", "Jackdaws"]

  const [selection, setSelection] = useState<string[]>([])

  const handleSelectAll = () => {
    setSelection(currentSelection => (currentSelection.length === options.length ? [] : options))
  }

  return (
    <MenuWithAnchor>
      <Menu.CheckboxItem
        className={styles.item}
        checked={
          selection.length === options.length ? true : selection.length ? "indeterminate" : false
        }
        onCheckedChange={handleSelectAll}
      >
        Select all
        <Menu.ItemIndicator>
          {selection.length === options.length ? <TickIcon /> : "—"}
        </Menu.ItemIndicator>
      </Menu.CheckboxItem>
      <Menu.Separator className={styles.separator} />
      {options.map(option => (
        <Menu.CheckboxItem
          key={option}
          className={styles.item}
          checked={selection.includes(option)}
          onCheckedChange={() =>
            setSelection(current =>
              current.includes(option)
                ? current.filter(el => el !== option)
                : current.concat(option),
            )
          }
        >
          {option}
          <Menu.ItemIndicator>
            <TickIcon />
          </Menu.ItemIndicator>
        </Menu.CheckboxItem>
      ))}
    </MenuWithAnchor>
  )
}

export const RadioItems = () => {
  const files = ["README.md", "index.js", "page.css"]
  const [file, setFile] = useState(files[1])

  return (
    <MenuWithAnchor>
      <Menu.Item className={styles.item} onSelect={() => window.alert("minimize")}>
        Minimize window
      </Menu.Item>
      <Menu.Item className={styles.item} onSelect={() => window.alert("zoom")}>
        Zoom
      </Menu.Item>
      <Menu.Item className={styles.item} onSelect={() => window.alert("smaller")}>
        Smaller
      </Menu.Item>
      <Menu.Separator className={styles.separator} />
      <Menu.RadioGroup value={file} onValueChange={setFile}>
        {files.map(file => (
          <Menu.RadioItem key={file} className={styles.item} value={file}>
            {file}
            <Menu.ItemIndicator>
              <TickIcon />
            </Menu.ItemIndicator>
          </Menu.RadioItem>
        ))}
      </Menu.RadioGroup>
    </MenuWithAnchor>
  )
}

export const Animated = () => {
  const [open, setOpen] = useState(true)
  const transitions = useTransition(open, {
    from: { opacity: 0, transform: "scale(0.95)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.95)" },
    config: config.stiff,
  })

  const files = ["README.md", "index.js", "page.css"]
  const [selectedFile, setFile] = useState(files[1])
  const radiosTransition = useTransition(selectedFile, {
    from: { opacity: 0, transform: "scale(0.95)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(0.95)" },
    config: config.stiff,
  })

  const checkboxItems = [
    { label: "Bold", state: useState(false) },
    { label: "Italic", state: useState(true) },
    { label: "Underline", state: useState(false) },
    { label: "Strikethrough", state: useState(false), disabled: true },
  ]
  const checkboxItemsWithTransition = checkboxItems.map(item => ({
    ...item,
    transition: useTransition(item.state[0], {
      from: { opacity: 0, transform: "scale(0.95)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(0.95)" },
      config: config.stiff,
    }),
  }))

  return (
    <>
      <label>
        <input type="checkbox" checked={open} onChange={event => setOpen(event.target.checked)} />{" "}
        open
      </label>
      <br />
      <br />
      <Menu.Root open={open} onOpenChange={() => {}} modal={false}>
        <Menu.Anchor style={{ display: "inline-block" }} />
        <Menu.Portal>
          {transitions((transition, open) => {
            return (
              open && (
                <AnimatedMenuContent
                  className={styles.content}
                  returnFocus={false}
                  align="start"
                  forceMount
                  style={transition}
                >
                  {checkboxItemsWithTransition.map(
                    ({ label, state: [checked, setChecked], disabled, transition }) => {
                      return (
                        <Menu.CheckboxItem
                          key={label}
                          className={styles.item}
                          checked={checked}
                          onCheckedChange={setChecked}
                          disabled={disabled}
                        >
                          {label}
                          {transition((transition, checked) => {
                            return (
                              checked && (
                                <Menu.ItemIndicator asChild forceMount>
                                  <animated.div style={transition}>
                                    <TickIcon />
                                  </animated.div>
                                </Menu.ItemIndicator>
                              )
                            )
                          })}
                        </Menu.CheckboxItem>
                      )
                    },
                  )}
                  <Menu.RadioGroup value={selectedFile} onValueChange={setFile}>
                    {files.map(file => {
                      return (
                        <Menu.RadioItem key={file} className={styles.item} value={file}>
                          {file}
                          {radiosTransition((transition, selectedFile) => {
                            return (
                              selectedFile === file && (
                                <AnimatedMenuIndicator forceMount>
                                  <animated.div style={transition}>
                                    <TickIcon />
                                  </animated.div>
                                </AnimatedMenuIndicator>
                              )
                            )
                          })}
                        </Menu.RadioItem>
                      )
                    })}
                  </Menu.RadioGroup>
                </AnimatedMenuContent>
              )
            )
          })}
        </Menu.Portal>
      </Menu.Root>
    </>
  )
}

const AnimatedMenuContent = animated(Menu.Content)
const AnimatedMenuIndicator = animated(Menu.ItemIndicator)

const MenuWithAnchor = (props: any) => {
  const { open = true, children, ...contentProps } = props

  return (
    <Menu.Root open={open} onOpenChange={() => {}} modal={false}>
      <Menu.Anchor style={{ display: "inline-block" }} />
      <Menu.Portal>
        <Menu.Content
          className={styles.content}
          returnFocus={false}
          align="start"
          {...contentProps}
        >
          {children}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}

const Submenu = (props: any) => {
  const {
    heading = "Submenu",
    open = true,
    onOpenChange,
    children,
    animated,
    disabled,
    ...contentProps
  } = props
  const transition = useTransition(open, {
    from: { opacity: 0, transform: "translate3d(0, -10px, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -10px, 0)" },
    config: { tension: 300, friction: 26 },
  })

  return (
    <Menu.Sub open={open} onOpenChange={onOpenChange}>
      <Menu.SubTrigger className={styles.subTrigger} disabled={disabled}>
        {heading} →
      </Menu.SubTrigger>
      <Menu.Portal>
        {animated ? (
          transition((transition, open) => {
            return (
              open && (
                <AnimatedMenuSubContent
                  forceMount
                  className={styles.content}
                  {...contentProps}
                  style={transition}
                >
                  {children}
                </AnimatedMenuSubContent>
              )
            )
          })
        ) : (
          <Menu.SubContent className={styles.content} {...contentProps}>
            {children}
          </Menu.SubContent>
        )}
      </Menu.Portal>
    </Menu.Sub>
  )
}

const AnimatedMenuSubContent = animated(Menu.SubContent)

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
