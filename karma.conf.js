module.exports = function(config){
    let param = {
        'frameworks' : ['jasmine'],
        'files'      : [
            'dist/kensho.js',
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
    }else{
        param.autoWatch = true;
    }
    config.set(param);
}
