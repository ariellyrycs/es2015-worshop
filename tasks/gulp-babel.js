  'use strict';

let watchify = require('watchify');
let browserify = require('browserify');
let babel = require('babelify');
let gulp = require('gulp');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let gutil = require('gulp-util');
let sourcemaps = require('gulp-sourcemaps');
let path = require('./paths.json');

let customOpts = {
  entries: path.src.babel,
  debug: true
};
let opts = Object.assign({}, watchify.args, customOpts);
let b = watchify(browserify(opts).transform(babel));


gulp.task('build:js', ['lint'] , bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))//
    .pipe(source('all.js'))//
    .pipe(buffer())//
    .pipe(sourcemaps.init({loadMaps: true}))//
    .pipe(sourcemaps.write('./'))//
    .pipe(gulp.dest(path.dest.babel))//;
}
