  'use strict';
let gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  watch = require('gulp-watch'),
  path = require('./paths.json');

gulp.task('lint', () => {
  return gulp.src(path.src.eslint.files)
      .pipe(eslint(path.src.eslint.rc))
      .pipe(eslint.format());
});


gulp.task('watch:lint', (cb) => {
  watch(path.src.watch.js, () => {
    return gulp.src(path.src.eslint.files)
        .pipe(eslint(path.src.eslint.rc))
        .pipe(eslint.format())
        .on('end', cb);
  });
});
