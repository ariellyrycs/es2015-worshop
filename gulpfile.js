'use strict';

let gulp = require('gulp'),
  fs = require('fs'),
  path = require('path');

const GULP_DIR = path.join(__dirname, 'tasks');
  //load all files in task dir
let jsFiles = new RegExp('^.*\.(js)$', 'i');

for(let fileName of fs.readdirSync(GULP_DIR)) {
  if(jsFiles.test(fileName)) require(path.join(GULP_DIR, fileName));
}

gulp.task('js', ['lint', 'build:js']);
gulp.task('watch', ['watch:lint', 'js']);
gulp.task('default', ['js']);
