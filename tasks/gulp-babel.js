  'use strict';
/*
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
//gulp.task('watch:js', () => watch());


*/
'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var babel = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var path = require('./paths.json');

// add custom browserify options here
var customOpts = {
  entries: path.src.babel,
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform(babel, { presets: ['es2015'] }));

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('build:js', ['lint'] , bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('all.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(path.dest.babel));
}
