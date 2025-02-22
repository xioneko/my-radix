import { style } from "@vanilla-extract/css"

export const root = style({
  verticalAlign: "middle",
  border: "1px solid gray",
  width: 30,
  height: 30,
  padding: 4,

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
  width: 20,
  height: 4,

  selectors: {
    '&[data-state="checked"], &[data-state="unchecked"]': {
      height: 20,
    },
  },
})

export const label = style({
  // ensures it can receive vertical margins
  display: "inline-block",
  // better default alignment
  verticalAlign: "middle",
  // mimics default `label` tag (as we render a `span`)
  cursor: "default",
})
