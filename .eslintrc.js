// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      spread: true,
      blockBindings: true,
      destructuring: true,
      templateStrings: true,
      generators: true,
      defaultParams: true,
      modules: true,
      arrowFunctions: true,
      forOf: true,
      classes: true,
    },
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['plugin:vue/recommended', 'standard', 'prettier'],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': ['error', 'only-multiline'],
    semi: ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
}
