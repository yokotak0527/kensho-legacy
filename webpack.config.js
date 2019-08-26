const path        = require('path');
const webpack     = require('webpack');
let   config      = require('./package.json');

module.exports = (env, argv) => {
    let { mode } = argv;
    let param = {};
    // =========================================================================
    param.context = path.resolve(__dirname, 'src/');
    param.resolve = {
        modules : [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    };
    param.output  = {
        path          : path.resolve(__dirname, 'dist/'),
        library       : 'Kensho',
        libraryTarget : 'umd',
        globalObject  : 'this'
    };
    param.entry = './core/Kensho.js';
    param.module = {};
    param.module.rules = [
        {
            test    : /\.js$/,
            exclude : /node_modules|dist/,
            loader  : 'babel-loader',
            options : {
                babelrc : false,
                comments : true,
                presets : [
                    ['@babel/preset-env', {
                        'modules' : false,
                        'targets' : ['> 2%', 'ie 11'],
                        'useBuiltIns' : 'usage',
                        'corejs'      : 3
                    }]
                ]
            }
        }
    ];
    param.plugins = [];
    // -------------------------------------------------------------------------
    // DEVELOPMENT
    if ( mode === 'development' ) {
        param.watch           = true;
        param.devtool         = false;
        param.output.filename = 'kensho.js';
    }
    // -------------------------------------------------------------------------
    // PRODUCTION
    if ( mode === 'production' ) {
        param.output.filename = 'kensho.min.js';
    }

    return param;
};
