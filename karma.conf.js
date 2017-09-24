module.exports = function(config){
  let param;
  // ===========================================================================
  // TRAVIS
  // ===========================================================================
  if(process.env.TRAVIS){
    param = {
      basePath: '',
      frameworks: ['jasmine'],
      files: [
        './node_modules/es6-shim/es6-shim.js',
        './dest/Kensho.js',
        './test/*Spec.js'
      ],
      reporters: ['progress'],
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['PhantomJS'],
      singleRun: true,
      concurrency: Infinity
    }
  }
  // ===========================================================================
  // LOCAL
  // ===========================================================================
  else{
    param = {
      basePath: '',
      frameworks: ['jasmine'],
      files: [
        './node_modules/es6-shim/es6-shim.js',
        './dest/Kensho.js',
        './test/*Spec.js'
      ],
      reporters: ['mocha'],
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['PhantomJS'],
      singleRun: true,
      concurrency: Infinity
    }

  }
  config.set(param);
}
