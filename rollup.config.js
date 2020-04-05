const path       = require('path')
const merge      = require('lodash/merge')
const typescript = require('rollup-plugin-typescript2')
const dts        = require('rollup-plugin-dts').default

const srcDir  = path.join(__dirname, 'src')
const outDir  = path.join(__dirname, 'dist')
const typeDir = path.join(__dirname, 'types')

/**
 * output rollup configulation
 * 
 * @param {Object}     param          -
 * @param {string}     param.format   - 
 * @param {Array<any>} param.plugins  - 
 * @param {Object}     options        - 
 * @param {string}     options.srcDir - 
 * @param {string}     options.outDir - 
 * @return {Object}
 */
const configFactory = ( param ) => {

  let tsConfig = {
    typescript : require('typescript'),
    tsconfig   : 'tsconfig.json'
  }
  let rollupConfig = {
    input   : path.join(srcDir, 'Kensho.ts'),
    output  : { file : path.join(outDir, `bundle.${param.format}.js`), format : param.format },
    plugins : []
  }

  // in development
  if ( process.env.BUILD === 'development' ) {
    // merge rollup config
    merge( rollupConfig, {
      watch : {
        include : path.join(srcDir, '**/*')
      }
    })
    // merge rollup-plugin-typescript2 config
    merge( tsConfig, {
      useTsconfigDeclarationDir : true, // output no bundle d.ts
      tsconfigDefaults : {
        compilerOptions : {
          declaration    : true,
          declarationDir : "types",
        }
      }
    })
  }

  if ( param.format === 'umd' || param.format === 'iife' ) {
    merge(rollupConfig, {
      output : {
        name : 'yokotak0527'
      }
    })
  }

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
    configFactory({ format : 'iife' } )
  ]
}
// =============================================================================
// EXPORT A PRODUCTION CONFIGULATIONS
// =============================================================================
if ( process.env.BUILD === 'production' ) {
  module.exports = [
    // configFactory( { format : 'cjs' } ),
    // configFactory( { format : 'esm' } ),
    // configFactory( { format : 'iife' } ),
    {
      input  : path.join(typeDir, 'src/Kensho.d.ts'),
      output : [{
        file   : path.join(outDir, 'bundle.d.ts'),
        format : 'es'
      }],
      plugins : [dts()]
    }
  ]
}
