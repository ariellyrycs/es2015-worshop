  'use strict';

const express = require('express'),
  fs = require('fs'),
  path = require('path'),
  bodyParser  = require('body-parser'),
  app = express(),

  jsFiles = new RegExp('^.*\.(js)$', 'i'),
  routesPath = path.join(__dirname, 'routes');

app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.type('application/json');
    res.locals.respond = responder.setup(res);
    next();
});

fs.readdirSync(routesPath).forEach(fileName => {
  if(jsFiles.test(fileName)) require(path.join(routesPath, fileName));
});

//"build" off of current is root
app.use(express.static(path.join(__dirname, 'build')));
app.listen(app.get('port'));
console.log('Running on http://localhost:%s', app.get('port'));
