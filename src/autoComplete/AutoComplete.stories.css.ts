import { style } from "@vanilla-extract/css"

export const input = style({
  padding: "8px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "300px",
  boxSizing: "border-box",
})

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "4px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "300px",
  minHeight: "32px",
  maxHeight: "400px",
  boxSizing: "border-box",
})

export const item = style({
  padding: "4px",
  cursor: "pointer",
  userSelect: "none",
  height: "32px",
  display: "flex",
  alignItems: "center",

  selectors: {
    "&:hover": {
      background: "#f0f0f0",
    },
    "&[data-selected]": {
      background: "#f0f0f0",
      borderLeft: "4px solid #0070f3",
    }
  }
})

export const group = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "4px",
  width: "100%",
})

export const label = style({
  fontSize: "0.875rem",
  fontWeight: "bold",
  color: "#666",
  textTransform: "uppercase",
  padding: "4px",
})