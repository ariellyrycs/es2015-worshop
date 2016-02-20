(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

let rq = require('./utils/request');
let $$ = require('./utils/select');
let Collection = require('./models/collection');
let UI = require('./ui');
let serialize = require('./models/serialize');
let fire = require('./utils/fire');
let Task = require('./models/task');
let User = require('./models/user');
let events = require('./events');

class Application {
  constructor() {
    this._userCollection = new Collection(User, '/users', 'users', 'userChange');
    this._taskCollection = new Collection(Task, '/tasks', 'tasks', 'taskChange');

    fire.subscribe('userChange', null, () => {
      let users = this._userCollection.fetch();
      UI.updateUsers(users);
    });
    this._userCollection.initialize();

    fire.subscribe('taskChange', null, () => {
      let tasks = this._taskCollection.fetch();
      UI.updateTasks(tasks);
    });
    this._taskCollection.initialize();

    events(this._userCollection, this._taskCollection);
  }
}

(() => new Application())();

},{"./events":2,"./models/collection":4,"./models/serialize":5,"./models/task":6,"./models/user":7,"./ui":8,"./utils/fire":9,"./utils/request":10,"./utils/select":12}],2:[function(require,module,exports){
/*globals formSerialize*/
let $$ = require('./utils/select');
let rq = require('./utils/request');
let UI = require('./ui');
let fire = require('./utils/fire');

var events = (userCollection, taskCollection) => {
  let sourceModal = $$('#source-modal');
  let userModal = sourceModal.find('#user-modal');
  let taskModal = sourceModal.find('#task-modal');
  let taskTable = $$('#show-tasks');
  let deleteTask = $$('#delete-task');
  let userModalForm = userModal.find('form');
  let taskModalFrom = taskModal.find('form');
  let usersList = $$('#users');
  let showAllUsers = $$('#show-all-users');

  fire.subscribe('userChange', null, () => {
    UI.hideModal();
    userModalForm.reset();
  });

  fire.subscribe('taskChange', null, () => {
    UI.hideModal();
    taskModalFrom.reset();
  });

  userModalForm.on('submit', function (e) {
    e.preventDefault();
    let data = formSerialize(this, { hash: true });
    userCollection.add(data);
  });

  taskModalFrom.on('submit', function (e) {
    e.preventDefault();
    let data = formSerialize(this, { hash: true });
    if (this.hasClass('editable')) {
      taskCollection.update(this.data('task-id'), data);
    } else {
      taskCollection.add(data);
    }
  });

  deleteTask.on('click', e => {
    e.preventDefault();
    let deleteIds = Array.from(taskTable.findAll('input[type=checkbox]:checked')).map(task => task.parent('tr').data('task-id'));
    taskCollection.deleteByIds(deleteIds);
  });

  taskTable.delegate('click', '.edit-task', e => {
    e.preventDefault();
    let taskElement = e.target.parent('tr');
    let taskId = taskElement.data('task-id');

    taskModalFrom.reset();
    UI.showEditModal(taskModal, taskCollection.findById(taskId));
    UI.setTaskId(taskId);
    UI.changeModalHeaderText(true);
  });

  usersList.delegate('click', 'a', e => {
    let userId = e.target.data('user-id');
    UI.setFilterUserId(userId);
    UI.updateTasks(taskCollection.fetch());
  });

  showAllUsers.on('click', () => {
    UI.setFilterUserId(null);
    UI.updateTasks(taskCollection.fetch());
  });

  sourceModal.delegate('click', '[data-dismiss=modal]', () => UI.hideModal());
  $$('#add-new-user').on('click', () => UI.showModal(userModal));
  $$('#add-new-task').on('click', () => {
    UI.showModal(taskModal);
    taskModalFrom.reset();
    UI.removeTaskEditableClass();
    UI.changeModalHeaderText();
  });
};

module.exports = events;

},{"./ui":8,"./utils/fire":9,"./utils/request":10,"./utils/select":12}],3:[function(require,module,exports){
let rq = require('./../utils/request');
class Base {
  constructor(fields, url) {
    this._url = url !== undefined ? url : '';
    this._fields = fields !== undefined ? fields : {};
  }
}

module.exports = Base;

},{"./../utils/request":10}],4:[function(require,module,exports){
let rq = require('./../utils/request');
let serialize = require('./serialize');
let fire = require('./../utils/fire');

class Collection {
  constructor(model, url, collectionName, event, models) {
    this._model = model;
    this._collectionName = collectionName;
    this._event = event;
    this._models = models !== undefined ? models : [];
    this._urlPlural = url !== undefined ? url : '';
    this._url = url.endsWith('s') ? url.slice(0, -1) : url;
  }

  resetLocalModels(data) {
    if (!data) return;
    this._models = data.map(item => new this._model(item));
  }

  getLocalModels() {
    return this._models;
  }

  initialize() {
    let data;
    if (serialize.size(this._collectionName) === 0) {
      return rq.get(this._urlPlural).then(res => {
        data = res.data;
        serialize.addCollection(this._collectionName, data);
        this.resetLocalModels(data);
        fire.fire(this._event);
      });
    }
    data = serialize.getCollection(this._collectionName);
    this.resetLocalModels(data);
    fire.fire(this._event);
  }

  add(data) {
    return rq.post(this._url, data).then(res => this.save(res.data));
  }

  deleteByIds(ids) {
    let fullfillments = ids.map(id => rq.delete(`${ this._url }/${ id }`));
    return Promise.all(fullfillments).then(res => this.save(res[res.length - 1].data)).catch(() => console.log('ups! something went wrong'));
  }

  update(id, data) {
    rq.update(`${ this._url }/${ id }`, data).then(res => this.save(res.data));
  }

  fetch() {
    return this._models;
  }

  findById(id) {
    return this._models.find(model => model.id === id);
  }

  save(data) {
    serialize.addCollection(this._collectionName, data);
    this.resetLocalModels(data);
    fire.fire(this._event);
  }
}

module.exports = Collection;

},{"./../utils/fire":9,"./../utils/request":10,"./serialize":5}],5:[function(require,module,exports){
/*globals localStorage*/
let Collection = require('./collection');

class Serialize {
  constructor() {
    this.barn = new Barn(sessionStorage);
  }

  addCollection(collectionName, data) {
    this.barn.del(collectionName);
    for (let item of data) {
      if (item) {
        this.barn.lpush(collectionName, item);
      }
    }
  }

  size(collectionName) {
    return this.barn.llen(collectionName);
  }

  getCollection(collectionName) {
    return this.barn.lrange(collectionName, 0, this.size(collectionName));
  }
}

module.exports = new Serialize();

},{"./collection":4}],6:[function(require,module,exports){
let Base = require('./base');

class Task extends Base {
  constructor(data) {
    super(data, '/task');
  }

  /** @return {String}*/
  get id() {
    return this._fields.id;
  }

  /** @return {String}*/
  get creatorId() {
    return this._fields.creator_id;
  }

  /** @return {String}*/
  get description() {
    return this._fields.description;
  }

  /** @return {String}*/
  get time() {
    return this._fields.time;
  }

  /** @return {String}*/
  get date() {
    return this._fields.date;
  }
}

module.exports = Task;

},{"./base":3}],7:[function(require,module,exports){
let Base = require('./base');

class User extends Base {
  constructor(data) {
    super(data, '/user');
  }

  /** @return {String}*/
  get id() {
    return this._fields.id;
  }

  /** @return {String}*/
  get name() {
    return this._fields.name;
  }

  /** @return {String}*/
  get lastName() {
    return this._fields.lastName;
  }

  /** @return {String}*/
  get email() {
    return this._fields.email;
  }
}

module.exports = User;

},{"./base":3}],8:[function(require,module,exports){
let $$ = require('./utils/select'),
    saferHTML = require("./utils/safer-html");

class UI {
  constructor() {
    this._usersListContainer = $$('#users');
    this._tasksContainer = $$('#show-tasks tbody')[0];
    this._contentModals = $$('.modal-content');
    this._sourceModal = $$('#source-modal');
    this._overLay = $$('.modal-backdrop')[0];
    this._userInTask = $$('#task-user');
    this._taskForm = this._sourceModal.find('#task-modal form');
    this._taskUserField = this._taskForm.find('[name="user"]');
    this._taskDescriptionField = this._taskForm.find('[name="description"]');
    this._taskTimeField = this._taskForm.find('[name="time"]');
    this._taskDateField = this._taskForm.find('[name="date"]');
    this._modalTaskTitle = this._sourceModal.find('.dynamic-task-title');
    this._filterUserId = null;
  }

  updateUsers(users) {
    /*User*/
    this._usersListContainer.innerHTML = users.reduce((usersHTML, user) => {
      return `${ usersHTML }
      <li>
        <a href='#' data-user-id="${ user.id }">${ user.name } ${ user.lastName }</a>
      </li>`;
    }, '');

    /*User-task*/
    this._userInTask.innerHTML = users.reduce((usersHTML, user) => {
      return `${ usersHTML }
      <option value="${ user.id }">${ user.name } ${ user.lastName }</option>`;
    }, '<option>Select user</option>');
  }

  updateTasks(tasks) {
    let filteredTasks = tasks;
    if (this._filterUserId) {
      filteredTasks = tasks.filter(task => task.creatorId === this._filterUserId);
    }

    this._tasksContainer.innerHTML = filteredTasks.reduce((tasksHTML, task, index) => {
      if (task) {
        return `${ tasksHTML }
        <tr data-task-id='${ task.id }'>
          <th scope="row">${ index + 1 }</th>
          <td><input type="checkbox"></td>
          <td>${ task.description }</td>
          <td>${ task.time }</td>
          <td>${ task.date }</td>
          <td><a href="#" class="btn btn-info btn-xs edit-task">Edit</a></td>
        </tr>`;
      }
    }, '');
  }

  changeModalHeaderText(editable) {
    this._modalTaskTitle.innerText = editable ? 'Edit Task' : 'Add Task';
  }

  showModal(modal) {
    this.hideAllContentModals();
    modal.addClass('show');
    this._sourceModal.removeClass('out').addClass('in');
    this._overLay.removeClass('out').addClass('in');
  }

  hideModal() {
    this._sourceModal.removeClass('in').addClass('out');
    this._overLay.removeClass('in').addClass('out');
  }

  showEditModal(modal, task) {
    this.showModal(modal);
    this._taskForm.addClass('editable');
    this._taskUserField.value = task.creatorId;
    this._taskDescriptionField.value = task.description;
    this._taskTimeField.value = task.time;
    this._taskDateField.value = task.date;
  }

  removeTaskEditableClass() {
    this._taskForm.removeClass('editable');
  }

  hideAllContentModals() {
    for (let contentModal of Array.from(this._contentModals)) {
      contentModal.removeClass('show');
    }
  }

  setTaskId(id) {
    this._taskForm.attr('data-task-id', id);
  }

  setFilterUserId(id) {
    this._filterUserId = id;
  }
}

module.exports = new UI();

},{"./utils/safer-html":11,"./utils/select":12}],9:[function(require,module,exports){


class Fire {
  constructor() {
    this.events = {};
  }

  subscribeAndInit(eventName, context, callback) {
    this.subscribe(eventName, context, callback);
    callback();
  }

  subscribe(eventName, context, callback) {
    //do it witch es6
    var eventType = this.events[eventName] = this.events[eventName] || [];
    eventType.push({
      callback: callback,
      context: context
    });
  }

  fire(eventName) {
    let eventType = this.events[eventName] || [];
    for (let call of eventType) {
      call.callback.call(call.context);
    }
  }

  unsubscribe(eventName) {
    delete this.events[eventName];
  }
}

module.exports = new Fire();

},{}],10:[function(require,module,exports){

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

  update(url, data) {
    return this.ajax(url, 'PUT', JSON.stringify(data));
  }

  delete(url, data) {
    return this.ajax(url, 'DELETE', JSON.stringify(data));
  }
}

module.exports = new Request();

},{}],11:[function(require,module,exports){
function saferHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
module.exports = saferHTML;

},{}],12:[function(require,module,exports){
/*globals NodeList*/

let findAll = function (selector) {
  return this.querySelectorAll(selector);
};

NodeList.prototype.findAll = HTMLDocument.prototype.findAll = HTMLElement.prototype.findAll = findAll;

let find = function (selector) {
  return this.querySelector(selector);
};

NodeList.prototype.find = HTMLDocument.prototype.find = HTMLElement.prototype.find = find;

Node.prototype.on = function (type, callback, useCapture) {
  this.addEventListener(type, callback, !!useCapture);
};

Node.prototype.append = function (tag, text) {
  var node = document.createElement(tag);
  if (text) {
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
  }
  return this.appendChild(node);
};

Node.prototype.appendHTML = function (HTML) {
  this.innerHTML(HTML);
};

Node.prototype.delegate = function (type, selector, handler) {
  let dispatchEvent = event => {
    const targetElement = event.target;
    const potentialElements = this.findAll(selector);
    if (Array.prototype.indexOf.call(potentialElements, targetElement) >= 0) {
      handler.call(targetElement, event);
    }
  };
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
  var attribElement = Array.from(this.attributes).find(elem => elem.name === `data-${ dataName }`);
  return attribElement.value;
};

Node.prototype.attr = function (property, value) {
  this.setAttribute(property, value);
};

Node.prototype.hasClass = function (cls) {
  return this.classList.contains(cls);
};

Node.prototype.addClass = function (cls) {
  this.classList.add(cls);
  return this;
};

Node.prototype.removeClass = function (cls) {
  this.classList.remove(cls);
  return this;
};

let $$ = selector => {
  if (selector.split(/[\s>]+/).pop()[0] === '#') {
    return document.find(selector);
  }
  return document.findAll(selector);
};

module.exports = $$;

},{}]},{},[1,12,10])


//# sourceMappingURL=all.js.map
