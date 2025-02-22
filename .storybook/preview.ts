import { Preview } from "@storybook/react"
import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

if (process.env.NODE_ENV === "development") {
  whyDidYouRender(React, {
    logOnDifferentValues: true,
    titleColor: "#A2D2DF",
    diffNameColor: "#E4C087",
    diffPathColor: "#BC7C7C",
  })
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
