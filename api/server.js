'use strict';

const express = require('express'),
  app = express(),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  favicon = require('serve-favicon'),

  jsFiles = new RegExp('^.*\.(js)$', 'i'),
  routesPath = path.join(__dirname, 'routes');



app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));
app.use(favicon(path.join(__dirname, '../build/favicon.png')));

fs.readdirSync(routesPath).forEach(fileName => {
  if(jsFiles.test(fileName)) {
    require(path.join(routesPath, fileName))(app);
  }
});

app.listen(app.get('port'));
console.log('Running on http://localhost:%s', app.get('port'));
