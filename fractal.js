const fractal     = module.exports = require('@frctl/fractal').create();
const mandelbrot  = require('@frctl/mandelbrot');
const packageConf = require('./package.json');
const ENV         = process.env.NODE_ENV;

console.log();

// タイトル
fractal.set('project.title', `Kensho usage Guide v${packageConf.version}`);

// componentsの設定
fractal.components.set('path', __dirname + '/guide/asset/components');

// documentの設定
fractal.docs.set('path', __dirname + '/guide/asset/docs');
fractal.docs.set('markdown.smartypants', false);

// 静的ファイル
fractal.web.set('static.path', __dirname + '/dist');

// テーマ
fractal.web.theme(mandelbrot({
    'skin'   : 'white',
    'panels' : ['html', 'notes']
}));

// 静的ファイル出力先
fractal.web.set('builder.dest', 'guide/dest');
