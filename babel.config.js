const { NODE_ENV } = process.env

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: NODE_ENV === 'test' ? 'auto' : false,
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    '@babel/react',
    '@babel/preset-flow',
  ],
  comments: true,
  plugins: [
    '@babel/transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
  ],
  "env": {
    "test": {
      "plugins": [
        [
          "istanbul", {
            "exclude": [
              "node_modules/",
              "tests/"
            ]
          }
        ]
      ]
    }
  }
}
