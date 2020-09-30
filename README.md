<div align="center">
  <h1>
    <br/>
    <br/>
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
    <br />

基于 **vue3.x** 开发的 **hooks** 插件，未来将通过 `@vue/composition-api` 模块兼容 **vue2.x** 版本
  </sup>
  <br />
  <br />
  <br />
  <br />
  <pre>npm i <a href="https://www.npmjs.com/package/@zhengxs/vue-hooks">@zhengxs/vue-hooks</a></pre>
  <br />
  <br />
  <br />
  <br />
  <br />
</div>

## 文档

- **UI 状态**
  - [`useList`](./docs/useList.md) 分页列表管理
- **网络请求**
  - [`useAxios`](./docs/useAxios.md) 基于 axios 封装
- **数据模拟**
  - [`createMockAPI`](./docs/createMockAPI.md) 本地 API 模拟

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

## 运行单元测试

```bash
# 单元测试
$ yarn test

# 单元测试并且生成测试覆盖率
$ yarn cov
```

## 版本发布

**自动发布**

```bash
# 发布内测版
$ yarn canary

# 发布测试版
$ yarn beta
```

**手动发布**

```bash
# 更新版本，内置代码检查
$ npm version <newversion|major|minor|patch>

# 发布包，内置代码构建
$ npm publish
```

See [npm](https://docs.npmjs.com/) for more help.

## 更新日志

See [CHANGELOG.md](./CHANGELOG.md)

## 贡献

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md)

[nodejs]: https://nodejs.org
