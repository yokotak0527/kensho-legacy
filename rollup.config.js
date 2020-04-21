const path       = require('path')
const merge      = require('lodash/merge')
const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')
const polyfill   = require('rollup-plugin-polyfill')

const srcDir  = path.join(__dirname, 'src')
const outDir  = path.join(__dirname, 'dist')

/**
 * output rollup configulation
 * 
 * @param {Object}     param               -
 * @param {string}     param.format        - 
 * @param {string}     [param.minify=fale] - 
 * @param {Array<any>} param.plugins       - 
 * @param {Object}     options             - 
 * @param {string}     options.srcDir      - 
 * @param {string}     options.outDir      - 
 * @return {Object}
 */
const configFactory = ( param = {} ) => {
  param = Object.assign({
    minify : false
  }, param)


  // ---------------------------------------------------------------------------
  // TypeScript config
  // ---------------------------------------------------------------------------
  let tsConfig = {
    typescript                : require('typescript'),
    useTsconfigDeclarationDir : true, // output no bundle d.ts
    clean                     : true,
    tsconfig                  : 'tsconfig.json'
  }

  // ---------------------------------------------------------------------------
  // rollup config
  // ---------------------------------------------------------------------------
  let rollupConfig = {
    input  : path.join(srcDir, 'Kensho.ts'),
    output : {
      file   : path.join(outDir, param.minify ? `bundle.${param.format}.min.js` : `bundle.${param.format}.js`),
      format : param.format
    },
    plugins : (()=>{
      const arr = []
      if(param.minify) arr.push(terser())
      return arr
    })()
  }

  if ( param.format === 'umd' || param.format === 'iife' ) {
    merge(rollupConfig, {
      output : { name : 'yokotak0527' },
      plugins : [
        polyfill([])
      ]
    })
  }

  // ===========================================================================
  //
  // Environment specific settings
  //
  // ===========================================================================
  if ( process.env.BUILD === 'development' ) {
    // -------------------------------------------------------------------------
    // in development
    // -------------------------------------------------------------------------

    // merge rollup config
    merge( rollupConfig, {
      watch : {
        include : path.join(srcDir, '**/*')
      }
    })
    // merge rollup-plugin-typescript2 config
    merge( tsConfig, {
      tsconfigDefaults : {
        compilerOptions : {
          declaration    : true,
          declarationDir : 'types'
        }
      }
    })
  }

  // ===========================================================================

  // add rollup-plugin-typescript2
  rollupConfig.plugins.push(typescript(tsConfig))
  return rollupConfig
}

// =============================================================================
// EXPORT A DEVELOPMENT CONFIGULATION
// =============================================================================
if ( process.env.BUILD === 'development' ) {
  // output cjs only.
  module.exports = [
    configFactory({ format : 'cjs' } ),
    configFactory({ format : 'umd' } )
  ]
}

// =============================================================================
// EXPORT A PRODUCTION CONFIGULATIONS
// =============================================================================
if ( process.env.BUILD === 'production' ) {
  module.exports = [
    configFactory( { format : 'cjs' } ),
    configFactory( { format : 'umd' } ),
    configFactory( { format : 'umd', minify : true } ),
    configFactory( { format : 'esm' } )
  ]
}
