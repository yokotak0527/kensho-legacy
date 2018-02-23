module.exports = function(config){
    let param = {
        'frameworks' : ['jasmine'],
        'files'      : [
            'node_modules/babel-polyfill/dist/polyfill.min.js',
            'dest/kensho.js',
            'test/*Spec.js'
        ],
        'colors'    : true,
        'logLevel'  : config.LOG_WARN,
        'browsers'  : [ 'PhantomJS' ],
        'reporters' : [ 'mocha' ]
    };
    
    // =========================================================================
    // TRAVIS
    // =========================================================================
    if(process.env.TRAVIS){
        param.singleRun = true;
        param.autoWatch = false;
    }
    // =========================================================================
    // LOCAL
    // =========================================================================
    else{
        //   param = {
        //     basePath: '',
        //     frameworks: ['jasmine'],
        //     files: [
        //       // 'node_modules/es6-shim/es6-shim.js',
        //       'dest/Kensho.js',
        //       'test/*Spec.js'
        //     ],
        //     reporters: ['jasmine'],
        //     colors: true,
        //     logLevel: config.LOG_INFO,
        //     autoWatch: true,
        //     browsers: ['chrome'],
        //     singleRun: false,
        //     concurrency: Infinity
        //   }
    }
    console.log(config);
    config.set(param);
}
