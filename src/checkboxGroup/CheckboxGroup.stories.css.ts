import { style } from "@vanilla-extract/css"

export const root = style({
  display: "flex",
  gap: "0.5rem",
})

export const item = style({
  width: 18,
  height: 18,
  display: "grid",
  placeContent: "center",

  selectors: {
    "&:focus": {
      outline: "none",
      borderColor: "red",
      boxShadow: "0 0 0 1px red",
    },

    "&[data-disabled]": {
      opacity: 0.3,
    },
  },
})

export const indicator = style({
  backgroundColor: "red",
  display: "block",
  width: 10,
  height: 10,
})

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
})
