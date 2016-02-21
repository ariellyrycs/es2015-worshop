'use strict';

let gulp = require('gulp'),
  fs = require('fs'),
  path = require('path');

const gulpDir = path.join(__dirname, 'tasks'),
  //load all files in task dir
  jsFiles = new RegExp('^.*\.(js)$', 'i');

fs.readdirSync(gulpDir).forEach(fileName => {
  if(jsFiles.test(fileName)) require(path.join(gulpDir, fileName));
});

gulp.task('js', ['lint', 'build:js']);
gulp.task('watch', ['watch:lint', 'js']);
gulp.task('default', ['js']);
//chrome://flags/#enable-javascript-harmony
//To kill server use control + c
