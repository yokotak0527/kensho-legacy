module.exports = {
  root          : true,
  extends       : ['standard-with-typescript'],
  parserOptions : { project: './tsconfig.json' },
  rules         : {
    'key-spacing'     : 0,
    'no-multi-spaces' : 0,
    '@typescript-eslint/prefer-function-type' : 0
  }
}
