const path       = require('path')
const merge      = require('lodash/merge')
const typescript = require('@rollup/plugin-typescript')

/**
 * base options of configFactory()
 */
const baseOption = {
  srcDir : path.join(__dirname, 'src'),
  outDir : path.join(__dirname, 'dist')
}
/**
 * base parameters of rollup
*/
const baseParam = {
  watch : {
    exclude : 'node_modules/**',
    include : path.join(baseOption.srcDir, '**')
  },
  plugins: [
    typescript()
  ]
}

/**
 * output rollup configulation
 * @param {Array[Object]|Object} params 
 * @param {Object}               optionss
 */
const configFactory = ( params, { srcDir, outDir } ) => {

  if (!Array.isArray(params)) params = [params]

  return params.map(param => {
    return {
      input  : path.join(srcDir, 'main.ts'),
      output : {
        file   : path.join(outDir, `bundle.${param.format}.js`),
        format : param.format
      }
    }
  });
}

// =============================================================================
// EXPORT A DEVELOPMENT CONFIGULATION
// =============================================================================
if ( process.env.BUILD === 'development' ) {
  // output esm only.
  module.exports = configFactory(
    merge({}, baseParam, {
      format : 'esm'
    }),
    baseOption
  );
}
// =============================================================================
// EXPORT A PRODUCTION CONFIGULATIONS
// =============================================================================
if ( process.env.BUILD === 'production' ) {

}
