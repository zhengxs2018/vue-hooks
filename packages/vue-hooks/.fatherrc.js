export default {
  umd: {
    name: 'vueHooks',
    globals: {
      'axios': 'axios',
      'better-mock': 'Mock',
      'vue': 'Vue',
      "path-to-regexp": "pathToRegexp",
      'tslib': 'window'
    }
  },
  replace: {
    __VERSION__: require('./package.json').version,
  },
}
