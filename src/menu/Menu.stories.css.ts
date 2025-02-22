import { style } from "@vanilla-extract/css"

export const content = style({
  display: "inline-block",
  boxSizing: "border-box",
  minWidth: 130,
  backgroundColor: "white",
  border: "1px solid lightgray",
  borderRadius: 6,
  padding: 5,
  boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.1)",
  fontFamily: "apple-system, BlinkMacSystemFont, helvetica, arial, sans-serif",
  fontSize: 13,
  selectors: {
    "&:focus-within": {
      borderColor: "black",
    },
  },
})

export const item = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  lineHeight: "1",
  cursor: "default",
  userSelect: "none",
  whiteSpace: "nowrap",
  height: 25,
  padding: "0 10px",
  color: "black",
  borderRadius: 3,
  outline: "red",
  selectors: {
    "&[data-highlighted]": {
      backgroundColor: "black",
      color: "white",
    },

    "&[data-disabled]": {
      color: "gray",
    },
  },
})

export const label = style({
  color: "lightgray",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  lineHeight: "1",
  cursor: "default",
  userSelect: "none",
  whiteSpace: "nowrap",
  height: 25,
  padding: "0 10px",
  borderRadius: 3,
})

export const subTrigger = style([
  item,
  {
    selectors: {
      '&:not([data-highlighted])[data-active]': {
        backgroundColor: "lightgray",
        color: "black",
      },
    },
  },
])

export const separator = style({
  height: 1,
  margin: "5px 10px",
  backgroundColor: "lightgray",
})
