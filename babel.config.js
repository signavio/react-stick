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
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',

    'lodash',
    'syntax-dynamic-import',

    ...(NODE_ENV === 'test' ? ['dynamic-import-node'] : []),
  ],
}
