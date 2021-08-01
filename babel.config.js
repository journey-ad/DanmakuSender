const presets = [
  [
    '@babel/env',
    {
      useBuiltIns: 'usage',
      corejs: { version: 2 }
    },
  ],
]

const plugins = [
  '@babel/plugin-transform-runtime',
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "@babel/plugin-proposal-optional-chaining"
]

module.exports = { presets, plugins }