/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const { startDevServer } = require('@cypress/vite-dev-server')
const istanbul = require('vite-plugin-istanbul')
const react = require('@vitejs/plugin-react')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      viteConfig: { logLevel: 'warn', plugins: [react(), istanbul({})] },
    })
  })
  require('@cypress/code-coverage/task')(on, config)
  return config
}
