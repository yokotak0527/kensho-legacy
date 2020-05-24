const path       = require('path')
const merge      = require('lodash/merge')
const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')
const babel      = require('rollup-plugin-babel')
const resolve    = require('@rollup/plugin-node-resolve').default
const commonjs   = require('@rollup/plugin-commonjs')

const srcDir     = path.join(__dirname, 'src')
const outDir     = path.join(__dirname, 'dist')
const extensions = ['.js', '.ts']



const typeScriptBaseConfig = {
  typescript                : require('typescript'),
  useTsconfigDeclarationDir : true, // output no bundle d.ts
  clean                     : true,
  tsconfig                  : 'tsconfig.json',
  rollupCommonJSResolveHack : true
}
const rollupBaseConfig = {
  input : path.join(srcDir, 'Kensho.ts')
}

if ( process.env.BUILD === 'development' ) {
  merge(typeScriptBaseConfig, {
    tsconfigDefaults : {
      compilerOptions : {
        declaration    : true,
        declarationDir : 'types'
      }
    }
  })
  merge(rollupBaseConfig, {
    watch : {
      include : path.join(srcDir, '**/*')
    }
  })
}

const configFactory = (format, build, min = false) => {
  const minText = min ? '.min' : ''

  if (format === 'esm') {
    const plugins = []
    plugins.push(resolve({ jsnext : true, extensions }))
    plugins.push(commonjs())
    if (min) plugins.push(terser())
    plugins.push(typescript(typeScriptBaseConfig))
    
    return merge({}, rollupBaseConfig, {
      output : {
        file      : path.join(outDir, `bundle.${format}${minText}.js`),
        format    : format,
        sourcemap : build === 'production' && !min ? true : false
      },
      plugins
    })
  }
  if (format === 'cjs') {
    const plugins = []
    plugins.push(resolve({ jsnext : true, extensions }))
    plugins.push(commonjs())
    if (min) plugins.push(terser())
    plugins.push(typescript(typeScriptBaseConfig))
    
    return merge({}, rollupBaseConfig, {
      output : {
        file      : path.join(outDir, `bundle.${format}${minText}.js`),
        format    : format,
        sourcemap : build === 'production' && !min ? true : false
      },
      plugins
    })
  }
  if (format === 'umd') {
    const plugins = []
    plugins.push(resolve({ jsnext : true, extensions }))
    plugins.push(commonjs())
    if (min) plugins.push(terser())
    plugins.push(typescript(typeScriptBaseConfig))
    plugins.push(babel({
      babelrc : false,
      exclude: ['node_modules/**', 'test/**'],
      extensions,
      runtimeHelpers: true,
      plugins : ['@babel/plugin-transform-runtime'],
      presets : [
        ['@babel/preset-env', {
          debug : true,
          targets : {
            ie : 11
          },
          corejs      : 3,
          useBuiltIns : 'usage'
        }]
      ]
    }))
    
    return merge({}, rollupBaseConfig, {
      output : {
        file      : path.join(outDir, `bundle.${format}${minText}.js`),
        name      : 'yokotak0527',
        format    : format,
        sourcemap : build === 'production' && !min ? true : false
      },
      plugins
    })
  }
}

// =============================================================================
// compile
// =============================================================================
if ( process.env.BUILD === 'development' ) {
  module.exports = [
    configFactory('cjs', process.env.BUILD),
    configFactory('umd', process.env.BUILD)
  ]
}

if ( process.env.BUILD === 'production' ) {
  module.exports = [
    configFactory('esm', process.env.BUILD),
    configFactory('esm', process.env.BUILD, true),
    configFactory('cjs', process.env.BUILD),
    configFactory('cjs', process.env.BUILD, true),
    configFactory('umd', process.env.BUILD),
    configFactory('umd', process.env.BUILD, true)
  ]
}
