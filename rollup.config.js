const path       = require('path')
const merge      = require('lodash/merge')
const typescript = require('rollup-plugin-typescript2')

const srcDir = path.join(__dirname, 'src')
const outDir = path.join(__dirname, 'dist')
/**
 * base parameters of rollup
*/
const baseParam = {
  // cache : false,
  watch : {
    include : path.join(srcDir, '**/*')
  },
  plugins : [
    typescript({
      typescript: require('typescript'),
      tsconfig : "tsconfig.json",
      useTsconfigDeclarationDir : true
    })
  ]
}

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

  const config = merge({}, baseParam, {
    input : path.join(srcDir, 'Kensho.ts'),
    output : {
      file   : path.join(outDir, `bundle.${param.format}.js`),
      format : param.format
    },
    plugins : param.plugins || []
  })

  if ( param.format === 'umd' || param.format === 'iife' ) {
    config.output.name = 'Kensho'
  }
  return config
}

// =============================================================================
// EXPORT A DEVELOPMENT CONFIGULATION
// =============================================================================
if ( process.env.BUILD === 'development' ) {
  // output cjs only.
  module.exports = configFactory( { format : 'cjs' } )
}
// =============================================================================
// EXPORT A PRODUCTION CONFIGULATIONS
// =============================================================================
if ( process.env.BUILD === 'production' ) {
  module.exports = [
    module.exports = configFactory( { format : 'cjs' } ),
    module.exports = configFactory( { format : 'esm' } ),
    module.exports = configFactory( { format : 'iife' } )
  ]
}
