'use strict'

const { resolve, dirname } = require('path')

const { sync } = require('globby')

const pkg = require('./package.json')

const packageFolder = resolve(__dirname, 'packages')
const packages = sync(['*/package.json', '!examples/package.json'], {
  cwd: packageFolder,
  onlyFiles: true,
  absolute: false
})

module.exports = {
  name: pkg.name,
  preset: 'ts-jest',
  rootDir: __dirname,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['packages/*/src/**/*.ts', '!packages/examples/**/*.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/examples/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: packages.reduce((mapping, file) => {
    const pkg = require(resolve(packageFolder, file))
    if (pkg.publishConfig.access === 'public') {
      const folder = dirname(file)
      mapping[`^${pkg.name}$`] = `<rootDir>/packages/${folder}/src`
    }
    return mapping
  }, {}),
  watchPathIgnorePatterns: ['/node_modules/', '/dist/']
}
