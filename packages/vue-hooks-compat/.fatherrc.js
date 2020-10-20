export default {
  umd: {
    globals: {
      '@vue/composition-api': 'VueCompositionAPI',
    }
  },
  extraExternals: [
    '@vue/composition-api'
  ],
  extraBabelPlugins: [
    ['babel-plugin-module-resolver', {
      "root": ["./src"],
      "alias": {
        "vue": "@vue/composition-api"
      }
    }]
  ],
  replace: {
    __VERSION__: require('./package.json').version
  }
}
