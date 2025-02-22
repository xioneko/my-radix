import { style } from "@vanilla-extract/css"

const Width = 50
const ThumbWidth = 20
const Gap = 4

export const root = style({
  verticalAlign: "middle",
  textAlign: "left",
  outline: "none",
  border: "none",
  width: Width,
  padding: Gap,
  borderRadius: "9999px",
  backgroundColor: "gray",
  transition: "background-color 166ms ease-out",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 2px black",
    },

    '&[data-state="checked"]': {
      backgroundColor: "red",
      borderColor: "red",
    },

    "&[data-disabled]": { opacity: 0.5 },
  },
})

export const thumb = style({
  display: "inline-block",
  verticalAlign: "middle",
  width: ThumbWidth,
  height: ThumbWidth,
  backgroundColor: "white",
  borderRadius: "9999px",
  transition: "transform 166ms ease-out",
  selectors: {
    '&[data-state="checked"]': {
      transform: `translateX(${Width - Gap * 2 - ThumbWidth}px)`,
    },
  },
})

export { label } from "../checkbox/Checkbox.stories.css"
