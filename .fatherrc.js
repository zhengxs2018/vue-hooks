export default {
  // entry: './src/index.ts',
  esm: 'rollup',
  cjs: 'rollup',
  umd: {
    minFile: true
  },
  pkgs: ['vue-hooks'],
  extraBabelPlugins: [
    'transform-async-to-promises'
  ]
}
