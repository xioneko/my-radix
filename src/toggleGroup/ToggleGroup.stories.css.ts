import { style } from "@vanilla-extract/css"

export const root = style({
  display: "inline-flex",
  gap: 5,
  padding: 5,

  selectors: {
    '&[data-orientation="vertical"]': {
      flexDirection: "column",
    },
  },
})

export const item = style({
  border: "1px solid black",
  borderRadius: 6,
  padding: "5px 10px",
  fontSize: 13,
  backgroundColor: "white",
  color: "black",

  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)",
    },

    "&:disabled": {
      opacity: 0.5,
    },

    '&[data-state="on"]': {
      backgroundColor: "black",
      color: "white",
    },
  },
})
