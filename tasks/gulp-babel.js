  'use strict';

const gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify'),
  babel = require('babelify'),
  watchify = require('watchify'),
  path = require('./paths.json');


let bundler = watchify(browserify(path.src.babel, { debug: true }).transform(babel));

let compile = () => {
  console.log('Building...');
  return bundler.bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('all.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dest.babel));
};

let watch = () => {
  bundler.on('update', compile);
  compile();
};



gulp.task('build:js', ['lint'], () => compile());
gulp.task('watch:js', () => watch());
