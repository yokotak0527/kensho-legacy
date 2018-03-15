const path    = require('path');
const webpack = require('webpack');
let   config  = require('./package.json');

module.exports = (env, argv) => {
    let { mode } = argv;

    let param = {};
    // =========================================================================
    param.context = path.resolve(__dirname, 'src/');
    console.log(param.context);
    param.resolve = {
        modules : [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    };
    param.output  = {
        filename   : 'kensho.js',
        path       : path.resolve(__dirname, 'dist/')
    };
    param.entry = './core/Kensho.js';
    param.module = {};
    param.module.rules = [
        {
            test    : /\.js$/,
            exclude : /node_modules/,
            loader  : 'babel-loader',
            options : {
                babelrc : false,
                presets : [
                    ['env', {
                        'module' : false,
                        "targets" : {
                            "ie" : 11
                        },
                        "useBuiltIns" : true
                    }]
                ]
            }
        }
    ];
    if(mode === 'development') param.watch = true;

    return param;
};
