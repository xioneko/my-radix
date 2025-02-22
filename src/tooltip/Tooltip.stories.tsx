import Tooltip, { createToolTip } from "."
import type { Meta, StoryObj } from "@storybook/react"
import { useRef, useState } from "react"

const meta: Meta<typeof Tooltip.Anchor> = {
  title: "Components/Tooltip",
}

export default meta

type Story = StoryObj<typeof Tooltip.Anchor>

const Template: Story = {
  render: args => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <Tooltip.Anchor {...args}>Hover me</Tooltip.Anchor>
      <Tooltip.Host />
    </div>
  ),
  argTypes: {
    content: {
      control: {
        type: "text",
      },
    },
    delayHide: {
      control: {
        type: "number",
      },
    },
    delayShow: {
      control: {
        type: "number",
      },
    },
    offset: {
      control: {
        type: "number",
      },
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    align: {
      control: "select",
      options: ["start", "end", undefined],
    },
    variant: {
      control: "select",
      options: ["dark", "light", "success", "warning", "error", "info"],
    },
  },
}

export const Basic: Story = {
  ...Template,
  args: {
    content: "Hello, world!",
    delayHide: 0,
    delayShow: 0,
    offset: 5,
    side: "top",
    variant: "dark",
  },
}

export const WithCustomNode: Story = {
  ...Template,
  args: {
    node: (
      <strong>
        <em>Hello, world!</em>
      </strong>
    ),
    delayHide: 0,
    delayShow: 0,
    offset: 5,
    side: "top",
    variant: "dark",
  },
}

export const Multiple = () => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      gap: "2rem",
    }}
  >
    <Tooltip.Anchor content="Hello, world!" variant="dark">Hover me</Tooltip.Anchor>
    <Tooltip.Anchor content="Hello, world!" variant="info">Hover me</Tooltip.Anchor>
    <Tooltip.Anchor content="Hello, world!" variant="success">Hover me</Tooltip.Anchor>
    <Tooltip.Anchor content="Hello, world!" variant="warning">Hover me</Tooltip.Anchor>
    <Tooltip.Host />
  </div>
)


export const Controlled = () => {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <Tooltip.Anchor content="Hello world">{open ? "close" : "open"}</Tooltip.Anchor>
      
      <Tooltip.Host setIsOpen={setOpen} isOpen={open} />
    </div>
  )
}

const MyTooltip = createToolTip()

export const Imperative = () => {
  const ref = useRef<React.ElementRef<typeof Tooltip.Host>>(null)
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <div id="anchor">Tooltip Anchor</div>
      <button
        onClick={() => {
          ref.current?.open({
            anchorSelect: "#anchor",
            content: "Hello world",
          })
        }}
      >
        open
      </button>
      <button
        onClick={() => {
          ref.current?.close()
        }}
      >
        close
      </button>
      <MyTooltip.Host ref={ref} />
    </div>
  )
}
