export default {
  umd: {
    name: 'vueHooksCompat'
  },
  replace: {
    __VERSION__: require('./package.json').version,
  },
}
