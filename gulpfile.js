const path       = require('path');
const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const notifier   = require('node-notifier');
const concat     = require('gulp-concat');
const babel      = require('gulp-babel');
const changed    = require('gulp-changed');
const gulpIf     = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const rename     = require('gulp-rename');

const packageParam   = require('./package.json');
const ENV            = process.env.NODE_ENV;

let packageName = 'kensho';
let isWatching  = false;

// =============================================================================
//
// CONFIGURATION
//
let conf = {
    concat  : {},
    options : {},
    path    : {
        src  : path.join(__dirname, 'src'),
        dest : path.join(__dirname, 'dest')
    }
};
// -----------------------------------------------------------------------------
// Concat
//
conf.concat[`${packageName}.js`] = [
    'asset/core/_Kensho.js',
    'asset/core/_Kensho.config.js',
    'asset/core/_Kensho.Hook.js',
    'asset/core/_Kensho.rule.js',
    'asset/core/_Kensho.plugin.js',

    'asset/rule/_required.js',
    'asset/rule/_fullsize.js',
    'asset/rule/_halfsize.js',
    'asset/rule/_number.js',
    'asset/rule/_age.js',
    'asset/rule/_email.js',
    // 'asset/rule/_tel.js',
    'asset/rule/_blacklist.js',
    'asset/rule/_whitelist.js',
    'asset/rule/_range.js',
    'asset/rule/_match.js',

    'asset/plugin/_full2half.js',
    'asset/plugin/_is-n-byte.js',

    'asset/_env-check.js'
];
// -----------------------------------------------------------------------------
// Babel
//
conf.options.babel = {
    minified : false,
    comments : true,
    presets  : [
        ['env', {
            'loose'    : true,
            'modules'  : false,
            'browsers' : [
                'Explorer 11',
                'last 3 version'
            ]
        }]
    ],
    plugins : [
        ['transform-runtime', {
            'helpers': false,
            'polyfill': false,
            'regenerator': true,
            'moduleName': 'babel-runtime'
        }]
    ]
};
// -----------------------------------------------------------------------------
// plumber conf.
//
conf.options.plumber = {
    errorHandler : function(err){
        let relativePath = err.fileName;
        relativePath = path.relative(process.cwd(), relativePath);
        notifier.notify({
            'title'   : `JS ${err.name}`,
            'message' : `${err.name} : ${relativePath}\n{ Line : ${err.loc.line}, Column : ${err.loc.column} }`,
            'sound'   : 'Pop'
        });
        console.error(`Line: ${err.loc.line}, Column: ${err.loc.column}`);
        console.error(err.stack);
        gulp.emit('end');
    }
};
// =============================================================================
//
// TASKS
//
// -----------------------------------------------------------------------------
// concat JS files by list of "conf.concat".
//
gulp.task('concat', function aaa(done){
    // bundle files num.
    let num = Object.keys(conf.concat).length;

    for(let fileName in conf.concat){
        let list = conf.concat[fileName];
        list = list.map((filePath)=>{
            return path.join(conf.path.src, filePath);
        });
        gulp.src(list)
            .pipe(concat(fileName))
            .pipe(gulp.dest(conf.path.src))
            .on('end', ()=>{
                num--;
                if(num === 0) done();
            });
    }
    return done;
});

// -----------------------------------------------------------------------------
// build JS files.
//
gulp.task('build', gulp.series('concat', function build(done){
    let ops       = conf.options;
    let babelOps  = ops.babel;
    let cache     = isWatching;
    // let ignorePtn = '**/_*.js';
    let target    = path.join(conf.path.src, '**/!(_)*.js');
    let dest      = conf.path.dest;

    if(ENV === 'production'){
        babelOps.minified = true;
        babelOps.comments = false;
        return gulp.src(target)
            .pipe(plumber(ops.plumber))
            .pipe(sourcemaps.init())
            .pipe(babel(babelOps))
            .pipe(plumber.stop())
            .pipe(rename({ 'extname' : '.min.js' }))
            .pipe(gulp.dest(dest));
    }else if(ENV === 'development'){
        return gulp.src(target)
            .pipe(gulpIf(cache, changed(dest, ops.changed)))
            .pipe(plumber(ops.plumber))
            .pipe(sourcemaps.init())
            .pipe(babel(babelOps))
            .pipe(sourcemaps.write('.'))
            .pipe(plumber.stop())
            .pipe(gulp.dest(dest));
    }
}));

// -----------------------------------------------------------------------------
// watch JS files.
//
gulp.task('watch', function(done){
    isWatching = true;
    gulp.watch( path.join(conf.path.src, '**/_*.js'),  gulp.parallel('build'));
});
