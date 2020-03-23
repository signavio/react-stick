module.exports = {
  type: 'react-component',
  babel: {
    cherryPick: 'lodash',
    env: {
      targets: {
        browsers: ['chrome >= 50', 'firefox >= 52', 'safari >= 10', 'ie >= 11'],
      },
    },
    presets: ['@babel/preset-flow'],
  },
  npm: {
    esModules: true,
    umd: false,
  },
  karma: {
    browsers: ['ChromeHeadless'],
  },
}
