export default {
  umd: {
    name: 'vueHooks'
  },
  replace: {
    __VERSION__: require('./package.json').version,
  },
}
