import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"

export const overlay = style({
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "rgba(0, 0, 0, 0.2)",
})

export const scrollableOverlay = style([
  overlay,
  {
    overflow: "auto",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },
])

const centerContent = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: "auto",
  width: "fit-content",
  height: "fit-content",
})

export const content = recipe({
  base: {
    minWidth: 300,
    minHeight: 150,
    padding: 50,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.12)",
  },
  variants: {
    default: {
      true: [centerContent],
    },
    scrollable: {
      content: [
        centerContent,
        {
          overflow: "auto",
          maxHeight: 300,
        },
      ],
      overlay: {
        marginTop: 50,
        marginBottom: 50,
      },
    },
    sheet: {
      true: {
        position: "fixed",
        top: 0,
        right: 0,
        minWidth: 300,
        minHeight: "100vh",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  },
})
