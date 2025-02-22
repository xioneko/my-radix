import { style } from "@vanilla-extract/css"
export * from '../menu/Menu.stories.css'

export const trigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 200,
  height: 100,
  border: "2px dashed black",
  borderRadius: 6,
  backgroundColor: "rgba(0, 0, 0, 0.1)",

  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)",
    },

    '&[data-state="open"]': {
      backgroundColor: "lightblue",
    },
  },
})
