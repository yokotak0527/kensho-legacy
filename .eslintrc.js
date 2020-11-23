module.exports = {
  root          : true,
  parser        : '@typescript-eslint/parser',
  parserOptions : {
    project : [ './src/tsconfig.json', './tests/tsconfig.json' ]
  },
  plugins : [
    '@typescript-eslint'
  ],
  extends : [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings : {
  },
  rules : {
    semi : ['error', 'never'],
    '@typescript-eslint/no-explicit-any' : 0
    //   'key-spacing'                                : 0,
    //   'no-multi-spaces'                            : 0,
    //   '@typescript-eslint/type-annotation-spacing' : 0,
    //   '@typescript-eslint/default-param-last'      : 0,
    //   'react/prop-types'                           : 0 // ビルドしたJSをパッケージとして使うことはないため
    //   // 'import/no-named-default' : 0,
    //   // '@typescript-eslint/prefer-function-type' : 0,
    //   // '@typescript-eslint/no-var-requires': 0
  }
}
