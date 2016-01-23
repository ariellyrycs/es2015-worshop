
var rq = require('./core/request');
console.log(rq.get('/users').then(function () {console.log(arguments)}));
