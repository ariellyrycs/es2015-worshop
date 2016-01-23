(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var rq = require('./core/request');
console.log(rq.get('/users').then(function () {
  console.log(arguments);
}));

},{"./core/request":2}],2:[function(require,module,exports){

class Request {
  ajax(url, type, data) {
    var promise = new Promise((resolve, reject) => {
      var http = new XMLHttpRequest();
      http.open(type, url);
      http.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          if (this.status === 200) resolve(this.response);else reject(this);
        }
      };
      http.responseType = 'json';
      http.setRequestHeader('Content-Type', 'application/json');
      http.setRequestHeader('Accept', 'application/json');
      http.send(data);
    });
    return promise;
  }

  get(url, data) {
    return this.ajax(url, 'GET', data);
  }

  post(url, data) {
    return this.ajax(url, 'POST', JSON.stringify(data));
  }
}

module.exports = new Request();

},{}],3:[function(require,module,exports){
/*globals NodeList*/

NodeList.prototype.forEach = Array.prototype.forEach;

NodeList.prototype.findAll = selector => {
  return this.querySelectorAll(selector);
};

NodeList.prototype.find = selector => {
  return this.querySelector(selector);
};

NodeList.prototype.on = (type, callback, useCapture) => {
  this.addEventListener(type, callback, !!useCapture);
};

NodeList.prototype.delegate = (type, selector, handler) => {
  var self = this;
  let dispatchEvent = function (event) {
    const targetElement = event.target;
    const potentialElements = NodeList.prototype.findAll.call(self, selector);
    const hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;
    if (hasMatch) {
      handler.call(targetElement, event);
    }
  };
  const useCapture = type === 'blur' || type === 'focus';
  NodeList.prototype.on.call(this, type, dispatchEvent, useCapture);
};

NodeList.prototype.$parent = (element, tagName) => {
  if (!element.parentNode) {
    return;
  }

  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }

  return this.$parent(element.parentNode, tagName);
};

let k = selector => {
  return document.querySelectorAll(selector);
};

},{}]},{},[1,3,2])


//# sourceMappingURL=all.js.map
