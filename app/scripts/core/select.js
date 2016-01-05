/*globals NodeList*/

NodeList.prototype.forEach = Array.prototype.forEach;


NodeList.prototype.findAll = (selector) => {
  return this.querySelectorAll(selector);
};

NodeList.prototype.find = (selector) => {
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
  }
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


let k = (selector) => {
  return document.querySelectorAll(selector);
};
