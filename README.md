<div align="center">
  <h1>
   <br/>
    <br/>
    👍
    <br />
    @zhengxs/vue-hooks
    <br />
    <br />
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <br />
    <a href="https://circleci.com/gh/streamich/@zhengxs/vue-hooks">
      <img src="https://img.shields.io/npm/l/@zhengxs/vue-hooks.svg?style=flat-square" alt="License" />
    </a>
    <a href="https://www.npmjs.com/package/@zhengxs/vue-hooks">
      <img src="https://img.shields.io/npm/v/@zhengxs/vue-hooks.svg" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@zhengxs/vue-hooks">
      <img src="https://img.shields.io/npm/dm/@zhengxs/vue-hooks.svg" alt="npm downloads" />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier" />
    </a>
    <a href="https://github.com/umijs/father/">
      <img src="https://img.shields.io/badge/build%20with-father-028fe4.svg" alt="Build With father" />
    </a>
    <a href="https://lerna.js.org/">
      <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna" />
    </a>
    <br />
    <br />
  </sup>
  <div>基于 <b><a href="https://v3.cn.vuejs.org/">vue3.x</a></b> 开发的 <b>hooks</b> 插件，通过 <b><a href="https://www.npmjs.com/package/@vue/composition-api">@vue/composition-api</a></b> 模块兼容 <b><a href="https://cn.vuejs.org/">vue2.x</a></b> 版本</div>
  <br />
  <br />
  <br />
  <br />
  <pre>npm i <a href="https://www.npmjs.com/package/@zhengxs/vue-hooks">@zhengxs/vue-hooks</a> --save</pre>
  <br />
  <br />
</div>

## Vue.js 2.x 支持

- [@zhengxs/vue-hooks-compat](https://www.npmjs.com/package/@zhengxs/vue-hooks-compat)
- [@zhengxs/vue-hooks-pure](https://www.npmjs.com/package/@zhengxs/vue-hooks-pure)

## 文档

- **UI 状态**
  - [`useList`](./docs/useList.md) 分页列表管理
  - [`useForm`](./docs/useForm.md) 表单管理
- **网络请求**
  - [`useAxios`](./docs/useAxios.md) 基于 axios 封装

## 开发步骤

你需要安装 [Node.js][nodejs] 的版本为 12+.

克隆此仓库后运行:

```bash
# 安装依赖
$ yarn install

# 启动文件监听
$ yarn watch

# 启动示例
$ yarn dev

# 构建 typedoc 文档
$ yarn typedoc

# 构建代码
$ yarn build
```

在 package.json 文件的 scripts 部分还有一些其他脚本可用.

## 参与贡献

我们非常欢迎你的贡献，你可以通过以下方式和我们一起共建 😃 ：

- 在你的公司或个人项目中使用 vue-hooks。
- 通过 [Issue](http://github.com/zhengxs2018/vue-hooks/issues) 报告 bug 或进行咨询。
- 提交 [Pull Request](http://github.com/zhengxs2018/vue-hooks/pulls) 改进 vue-hooks 的代码。

## License

* MIT

[nodejs]: https://nodejs.org
