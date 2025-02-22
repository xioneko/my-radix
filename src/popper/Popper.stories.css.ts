import * as Popper from "."
import { keyframes } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"

const rotateIn = keyframes({
  "0%": { transform: "scale(0) rotateZ(calc(var(--direction, 0) * 45deg))" },
  "100%": { transform: "scale(1)" },
})

export const content = recipe({
  base: {
    transformOrigin: `var(${Popper.TransformOriginVar})`,
    background: "gray",
    padding: 10,
    borderRadius: 10,
  },
  variants: {
    size: {
      small: { width: 100, height: 50 },
      large: { width: 300, height: 150 },
    },
    animated: {
      true: {
        animation: `${rotateIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
        '&[data-side="top"]': { "--direction": "1" },
        '&[data-side="bottom"]': { "--direction": "-1" },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
})

export const anchor = recipe({
  base: {
    background: "hotpink",
  },
  variants: {
    size: {
      small: { width: 50, height: 50 },
      large: { width: 100, height: 100 },
    },
  },
  defaultVariants: {
    size: "large",
  },
})

export const arrow = recipe({
  base: {
    fill: "gray",
  },
})
