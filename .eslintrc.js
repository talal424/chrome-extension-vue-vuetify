// https://eslint.org/docs/user-guide/configuring
// File taken from https://github.com/vuejs-templates/webpack/blob/1.3.1/template/.eslintrc.js, thanks.

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    parser: '@babel/eslint-parser'
  },
  env: {
    browser: true,
    webextensions: true,
    node: true
  },
  extends: [
    'prettier',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  rules: {
    'vue/max-attributes-per-line': 'off'
  }
}
