import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        jsxImportSource:
          mode === "development" ? "@welldone-software/why-did-you-render" : undefined,
      }),
      vanillaExtractPlugin(),
    ],
    build: {
      target: ["chrome126", "edge127", "firefox128", "safari17.5"],
      minify: false,
    },
  }
})
