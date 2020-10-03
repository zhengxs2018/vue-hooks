export default {
  esm: 'rollup',
  cjs: 'rollup',
  umd: {
    minFile: true,
    globals: {
      'axios': 'axios',
      'better-mock': 'Mock',
      'vue': 'Vue',
      "path-to-regexp": "pathToRegexp",
      'tslib': 'window',
    }
  },
  pkgs: ['vue-hooks'],
  extraExternals: [
    '@vue/reactivity',
    "axios",
    "better-mock",
    "path-to-regexp",
    'vue'
  ],
  extraBabelPlugins: [
    'transform-async-to-promises'
  ]
}
