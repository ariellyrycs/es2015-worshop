(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreThingJs = require('./core/thing.js');

var _coreThingJs2 = _interopRequireDefault(_coreThingJs);

console.log((0, _coreThingJs2['default'])());
new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve();
  }, 10000);
}).then(function () {
  console.log('jjojojo');
});

},{"./core/thing.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var k = function k() {
  return 'hehe';
};

exports['default'] = k;
module.exports = exports['default'];

},{}]},{},[1])


//# sourceMappingURL=all.js.map
