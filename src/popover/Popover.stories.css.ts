import * as Popover from "."
import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"

export const trigger = recipe({
  base: {
    selectors: {
      '&[data-state="open"]': {
        borderColor: "red",
      },
    },
  },
  variants: {
    chromatic: {
      true: {
        boxSizing: "border-box",
        width: 30,
        height: 30,
        backgroundColor: "tomato",
        border: "1px solid rgba(0, 0, 0, 0.3)",
      },
    },
  },
})

export const content = recipe({
  base: {
    transformOrigin: `var(${Popover.TransformOriginVar})`,
    background: "lightgray",
    padding: 20,
    borderRadius: 5,
  },
  variants: {
    chromatic: {
      true: {
        boxSizing: "border-box",
        display: "grid",
        placeContent: "center",
        width: 60,
        height: 60,
        backgroundColor: "royalblue",
        color: "white",
        fontSize: 10,
        border: "1px solid rgba(0, 0, 0, 0.3)",
      },
    },
  },
})

export const close = recipe({})

export const arrow = recipe({
  base: {
    fill: "lightgray",
  },
  variants: {
    chromatic: {
      true: {
        fill: "black",
      },
    },
  },
})

export const grid = style({
  display: "inline-grid",
  gridTemplateColumns: "repeat(3, 50px)",
  columnGap: 150,
  rowGap: 100,
  padding: 100,
  border: "1px solid black",
})
