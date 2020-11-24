import resolve     from '@rollup/plugin-node-resolve'
import typescript  from '@rollup/plugin-typescript'
import ttypescript from 'ttypescript'
import commonjs    from '@rollup/plugin-commonjs'
import {terser}    from 'rollup-plugin-terser'
import copy        from 'rollup-plugin-copy'
import babel       from 'rollup-plugin-babel'

const output = process.env.OUTPUT
const input  = 'src/Kensho.ts'
const config = {
  input,
  external : [
  ]
}

// =============================================================================
// OUTPUT Types
//
if (output === 'types') {
  const dist = '@types'
  module.exports = Object.assign({}, config, {
    output : {
      dir : dist
    },
    plugins : [
      resolve(),
      typescript({
        typescript          : ttypescript,
        tsconfig            : 'src/tsconfig.json',
        declarationDir      : dist,
        declaration         : true,
        emitDeclarationOnly : true,
        plugins             : [
          { "transform" : "typescript-transform-paths",  "afterDeclarations" : true }
        ]
      }),
      commonjs({extensions: ['.ts', '.js']}),
      copy({
        targets : [
          { src : 'src/@types/**/*', dest : `${dist}/@types` }
        ]
      })
    ]
  })
}
// =============================================================================
// OUTPUT ESModule
//
if (output === 'es') {
  module.exports = Object.assign({}, config, {
    output : [
      { file : 'dist/bundle.es.js',     format : output },
      { file : 'dist/bundle.es.min.js', format : output, plugins : [ terser() ] }
    ],
    plugins : [
      resolve(),
      typescript({
        tsconfig : 'src/tsconfig.json'
      }),
      commonjs({extensions: ['.ts', '.js']})
    ]
  })
}
// =============================================================================
// OUTPUT CommonJS
//
if (output === 'cjs') {
  module.exports = Object.assign({}, config, {
    output : [
      { file : 'dist/bundle.cjs.js',     exports : 'auto', format : output },
      { file : 'dist/bundle.cjs.min.js', exports : 'auto', format : output, plugins : [ terser() ] },
    ],
    plugins : [
      resolve(),
      typescript({
        tsconfig : 'src/tsconfig.json',
        module   : 'CommonJS'
      }),
      commonjs({extensions: ['.ts', '.js']})
    ]
  })
}
// =============================================================================
// OUTPUT IIFE
//
if (output === 'iife') {
  module.exports = Object.assign({}, config, {
    output : [
      { name : 'Kensho', file : 'dist/bundle.iife.js',     exports : 'auto', format : output },
      { name : 'Kensho', file : 'dist/bundle.iife.min.js', exports : 'auto', format : output, plugins : [ terser() ] },
    ],
    plugins : [
      resolve(),
      typescript({
        tsconfig : 'src/tsconfig.json',
        module   : 'CommonJS'
      }),
      babel({
        babelrc        : false,
        exclude        : ['node_modules/**', 'tests/**'],
        runtimeHelpers : true,
        plugins        : ['@babel/plugin-transform-runtime'],
        presets        : [
          ['@babel/preset-env', {
            debug : true,
            targets : {
              ie : 11
            },
            corejs      : 3,
            useBuiltIns : 'usage'
          }]
        ]
      }),
      commonjs({extensions: ['.ts', '.js']})
    ]
  })
}
// =============================================================================
// OUTPUT Types
//
if (output === 'types') {
  const dist = '@types'
  module.exports = Object.assign({}, config, {
    output : {
      dir : dist,
      // { name : 'Kensho', file : 'dist/bundle.iife.js',     exports : 'auto', format : output },
    },
    plugins : [
      resolve(),
      typescript({
        typescript          : ttypescript,
        tsconfig            : 'src/tsconfig.json',
        declarationDir      : dist,
        declaration         : true,
        emitDeclarationOnly : true,
        plugins             : [
          { "transform" : "typescript-transform-paths",  "afterDeclarations" : true }
        ]
      }),
      commonjs({extensions: ['.ts', '.js']}),
      copy({
        targets : [
          { src : 'src/@types/**/*', dest : `${dist}/@types` }
        ]
      })
    ]
  })
}