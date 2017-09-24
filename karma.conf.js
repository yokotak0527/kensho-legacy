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
        'dest/Kensho.js',
        'test/*Spec.js'
      ],
      reporters: ['progress'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['Chrome'],
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
        'dest/Kensho.js',
        'test/*Spec.js'
      ],
      reporters: ['mocha'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['PhantomJS'],
      singleRun: false,
      concurrency: Infinity
    }

  }
  config.set(param);
}
