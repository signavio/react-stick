import { defineConfig } from 'cypress'

import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        logLevel: 'warn',
        plugins: [istanbul({ cwd: '../src', cypress: true })],
      },
    },
    specPattern: 'tests/src/**/*.test.{ts,tsx}',
    supportFile: 'tests/support/component.ts',
    indexHtmlFile: 'tests/support/component-index.html',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
  viewportWidth: 1024,
  viewportHeight: 1024,
  downloadsFolder: 'cypress/downloads',
  videosFolder: 'cypress/videos',
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
})
