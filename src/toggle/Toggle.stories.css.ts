import { style } from "@vanilla-extract/css"

export const root = style({
  padding: 6,
  lineHeight: 1,
  border: "none",
  fontFamily: "sans-serif",
  fontWeight: "bold",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 2px black",
    },

    "&[data-disabled]": { opacity: 0.5 },

    '&[data-state="off"]': {
      backgroundColor: "red",
      color: "white",
    },

    '&[data-state="on"]': {
      backgroundColor: "green",
      color: "white",
    },
  },
})
