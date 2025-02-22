import { AnchorWidthVar, AvailableHeightVar } from "#popper"
import { style } from "@vanilla-extract/css"

export const trigger = style({
  display: "flex",
  alignItems: "center",
  gap: 5,
  border: "1px solid black",
  borderRadius: 6,
  backgroundColor: "transparent",
  height: 50,
  padding: "5px 15px",
  fontFamily: "-apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
  fontSize: 13,
  lineHeight: 1,
  overflow: "hidden",

  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)",
    },
  },
})

export const content = style({
  backgroundColor: "white",
  border: "1px solid lightgray",
  borderRadius: 6,
  boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.1)",
  position: "relative",
  minWidth: `var(${AnchorWidthVar})`,
  maxHeight: `var(${AvailableHeightVar})`,

  selectors: {
    "&:focus-within": { borderColor: "black" },
  },
})

export const viewport = style({
  padding: 5,
})

const itemStyles = {
  display: "flex",
  alignItems: "center",
  lineHeight: "1",
  cursor: "default",
  userSelect: "none",
  whiteSpace: "nowrap",
  height: 25,
  padding: "0 25px",
  fontFamily: "-apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
  fontSize: 13,
  color: "black",
  borderRadius: 3,
} as const

export const label = style({
  ...itemStyles,
  color: "gray",
  fontWeight: 500,
})

export const item = style({
  ...itemStyles,
  position: "relative",
  outline: "none",

  selectors: {
    "&:active": {
      backgroundColor: "lightgray",
    },

    "&[data-highlighted]": {
      backgroundColor: "black",
      color: "white",
    },
    "&[data-disabled]": { color: "lightgray" },
  },
})

export const itemInGroup = style([
  item,
  {
    paddingLeft: 35,
  },
])

export const indicator = style({
  position: "absolute",
  left: 6,
  top: 6,
})

export const separator = style({
  height: 1,
  margin: "5px -5px",
  backgroundColor: "",
})
