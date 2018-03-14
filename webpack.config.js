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
    // param.entry = [
    //     './core/_Kensho.js',
    //     './core/_Kensho.config.js',
        // './core/_Kensho.Hook.js',
        // './core/_Kensho.rule.js',
        // './core/_Kensho.plugin.js',
        //
        // './rule/_required.js',
        // './rule/_fullsize.js',
        // './rule/_halfsize.js',
        // './rule/_number.js',
        // './rule/_age.js',
        // './rule/_email.js',
        // // 'rule/_tel.js',
        // './rule/_blacklist.js',
        // './rule/_whitelist.js',
        // './rule/_range.js',
        // './rule/_match.js',
        //
        // './plugin/_full2half.js',
        // './plugin/_is-n-byte.js',
        //
        // './_env-check.js'
    // ];
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
                        'module' : false
                    }]
                ]
            }
        }
    ];
    if(mode === 'development') param.watch = true;

    return param;
};
