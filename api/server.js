'use strict';

let express = require('express'),
  app = express(),
  fs = require('fs'),
  path = require('path'),
  bodyParser = require('body-parser'),
  favicon = require('serve-favicon'),
  jsFiles = new RegExp('^.*\.(js)$', 'i');

const ROUTES_PATH = path.join(__dirname, 'routes');



app.set('port', process.env.PORT || 8000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));
app.use(favicon(path.join(__dirname, '../build/favicon.png')));

for(let fileName of fs.readdirSync(ROUTES_PATH)) {
  if(jsFiles.test(fileName)) require(path.join(ROUTES_PATH, fileName))(app);
}

app.listen(app.get('port'));
console.log('Running on http://localhost:%s', app.get('port'));
