/*globals NodeList*/


let findAll = function (selector) {
  return this.querySelectorAll(selector);
};

NodeList.prototype.findAll = HTMLDocument.prototype.findAll =
HTMLElement.prototype.findAll = findAll;

let find = function (selector) {
  return this.querySelector(selector);
};

NodeList.prototype.find = HTMLDocument.prototype.find =
HTMLElement.prototype.find = find;

Node.prototype.on = function (type, callback, useCapture) {
  this.addEventListener(type, callback, !!useCapture);
};

Node.prototype.append = function (tag, text) {
  var node = document.createElement(tag);
  if(text) {
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
  }
  return this.appendChild(node);
};

Node.prototype.appendHTML = function (HTML) {
  this.innerHTML(HTML);
};

Node.prototype.delegate = function (type, selector, handler) {
  let dispatchEvent = (event) => {
    const targetElement = event.target;
    const potentialElements = this.findAll(selector);
    if (Array.prototype.indexOf.call(potentialElements, targetElement) >= 0) {
      handler.call(targetElement, event);
    }
  }
  const useCapture = type === 'blur' || type === 'focus';
  this.on(type, dispatchEvent, useCapture);
};

Node.prototype.parent = function (tagName) {
  if (!this.parentNode) {
    return;
  }

  if (this.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return this.parentNode;
  }

  return this.parentNode.parent(tagName);
};

Node.prototype.data = function (dataName) {
  var attribElement = Array.from(this.attributes)
    .find(elem => elem.name === `data-${dataName}`);
  return attribElement.value;
}

Node.prototype.attr = function (property, value) {
  this.setAttribute(property, value);
}

Node.prototype.hasClass = function (cls) {
  return this.classList.contains(cls);
}

Node.prototype.addClass = function (cls) {
  this.classList.add(cls);
  return this;
};

Node.prototype.removeClass = function (cls) {
  this.classList.remove(cls);
  return this;
};

let $$ = (selector) => {
  if(selector.split(/[\s>]+/).pop()[0] === '#') {
    return document.find(selector);
  }
  return document.findAll(selector);
};

export default $$;
