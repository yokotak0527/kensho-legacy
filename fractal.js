const fractal    = module.exports = require('@frctl/fractal').create();
const mandelbrot = require('@frctl/mandelbrot');


// const ENV     = process.env.NODE_ENV;

// console.log(process.env);

// タイトル
fractal.set('project.title', 'Kensho Usage Guide');

// Tell Fractal where the components will live
fractal.components.set('path', __dirname + '/guide/components');

// document設定
fractal.docs.set('path', __dirname + '/guide/docs');
fractal.docs.set('markdown.smartypants', false);

// 静的ファイル
fractal.web.set('static.path', __dirname + '/dest');

// テーマ
fractal.web.theme(mandelbrot({
    'skin'   : 'white',
    'panels' : ['html', 'notes']
}));

// 静的ファイル出力先
fractal.web.set('builder.dest', 'dest/guide');
