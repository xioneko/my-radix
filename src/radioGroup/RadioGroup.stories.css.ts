import { style } from "@vanilla-extract/css"

export const root = style({})

export const item = style({
  verticalAlign: "middle",
  width: 30,
  height: 30,
  display: "inline-grid",
  padding: 0,
  placeItems: "center",
  border: "1px solid gray",
  borderRadius: 9999,

  selectors: {
    "&:focus": {
      outline: "none",
      borderColor: "red",
      boxShadow: "0 0 0 1px red",
    },

    "&[data-disabled]": {
      opacity: 0.5,
    },
  },
})

export const indicator = style({
  width: 18,
  height: 18,
  backgroundColor: "red",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "inherit",
})

export { label } from "../checkbox/Checkbox.stories.css"
