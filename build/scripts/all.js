(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsRequest = require('./utils/request');

var _utilsRequest2 = _interopRequireDefault(_utilsRequest);

var _utilsSelect = require('./utils/select');

var _utilsSelect2 = _interopRequireDefault(_utilsSelect);

var _modelsCollection = require('./models/collection');

var _modelsCollection2 = _interopRequireDefault(_modelsCollection);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _modelsSerialize = require('./models/serialize');

var _modelsSerialize2 = _interopRequireDefault(_modelsSerialize);

var _utilsFire = require('./utils/fire');

var _utilsFire2 = _interopRequireDefault(_utilsFire);

var _modelsTask = require('./models/task');

var _modelsTask2 = _interopRequireDefault(_modelsTask);

var _modelsUser = require('./models/user');

var _modelsUser2 = _interopRequireDefault(_modelsUser);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var Application = function Application() {
  var _this = this;

  _classCallCheck(this, Application);

  this._userCollection = new _modelsCollection2['default'](_modelsUser2['default'], '/users', 'users', 'userChange');
  this._taskCollection = new _modelsCollection2['default'](_modelsTask2['default'], '/tasks', 'tasks', 'taskChange');

  _utilsFire2['default'].subscribe('userChange', null, function () {
    var users = _this._userCollection.fetch();
    _ui2['default'].updateUsers(users);
  });
  this._userCollection.initialize();

  _utilsFire2['default'].subscribe('taskChange', null, function () {
    var tasks = _this._taskCollection.fetch();
    _ui2['default'].updateTasks(tasks);
  });
  this._taskCollection.initialize();

  (0, _events2['default'])(this._userCollection, this._taskCollection);
};

(function () {
  return new Application();
})();

},{"./events":2,"./models/collection":4,"./models/serialize":5,"./models/task":6,"./models/user":7,"./ui":8,"./utils/fire":9,"./utils/request":10,"./utils/select":12}],2:[function(require,module,exports){
/*globals formSerialize*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsSelect = require('./utils/select');

var _utilsSelect2 = _interopRequireDefault(_utilsSelect);

var _utilsRequest = require('./utils/request');

var _utilsRequest2 = _interopRequireDefault(_utilsRequest);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _utilsFire = require('./utils/fire');

var _utilsFire2 = _interopRequireDefault(_utilsFire);

var events = function events(userCollection, taskCollection) {
  var sourceModal = (0, _utilsSelect2['default'])('#source-modal');
  var userModal = sourceModal.find('#user-modal');
  var taskModal = sourceModal.find('#task-modal');
  var taskTable = (0, _utilsSelect2['default'])('#show-tasks');
  var deleteTask = (0, _utilsSelect2['default'])('#delete-task');
  var userModalForm = userModal.find('form');
  var taskModalFrom = taskModal.find('form');
  var usersList = (0, _utilsSelect2['default'])('#users');
  var showAllUsers = (0, _utilsSelect2['default'])('#show-all-users');
  var addNewUserButton = (0, _utilsSelect2['default'])('#add-new-user');
  var addNewTaskButton = (0, _utilsSelect2['default'])('#add-new-task');

  _utilsFire2['default'].subscribe('userChange', null, function () {
    _ui2['default'].hideModal();
    userModalForm.reset();
  });

  _utilsFire2['default'].subscribe('taskChange', null, function () {
    _ui2['default'].hideModal();
    taskModalFrom.reset();
  });

  userModalForm.on('submit', function (e) {
    e.preventDefault();
    var data = formSerialize(this, { hash: true });
    userCollection.add(data);
  });

  taskModalFrom.on('submit', function (e) {
    e.preventDefault();
    var data = formSerialize(this, { hash: true });
    if (this.hasClass('editable')) {
      taskCollection.update(this.data('task-id'), data);
    } else {
      taskCollection.add(data);
    }
  });

  deleteTask.on('click', function (e) {
    e.preventDefault();
    var deleteIds = Array['import'](taskTable.findAll('input[type=checkbox]:checked')).map(function (task) {
      return task.parent('tr').data('task-id');
    });
    taskCollection.deleteByIds(deleteIds);
  });

  taskTable.delegate('click', '.edit-task', function (e) {
    e.preventDefault();
    var taskElement = e.target.parent('tr');
    var taskId = taskElement.data('task-id');

    taskModalFrom.reset();
    _ui2['default'].showEditModal(taskModal, taskCollection.findById(taskId));
    _ui2['default'].setTaskId(taskId);
    _ui2['default'].changeModalHeaderText(true);
  });

  usersList.delegate('click', 'a', function (e) {
    var userId = e.target.data('user-id');
    _ui2['default'].setFilterUserId(userId);
    _ui2['default'].updateTasks(taskCollection.fetch());
  });

  showAllUsers.on('click', function () {
    _ui2['default'].setFilterUserId(null);
    _ui2['default'].updateTasks(taskCollection.fetch());
  });

  sourceModal.delegate('click', '[data-dismiss=modal]', function () {
    return _ui2['default'].hideModal();
  });
  addNewUserButton.on('click', function () {
    return _ui2['default'].showModal(userModal);
  });
  addNewTaskButton.on('click', function () {
    _ui2['default'].showModal(taskModal);
    taskModalFrom.reset();
    _ui2['default'].removeTaskEditableClass();
    _ui2['default'].changeModalHeaderText();
  });
};

exports['default'] = events;
module.exports = exports['default'];

},{"./ui":8,"./utils/fire":9,"./utils/request":10,"./utils/select":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsRequest = require('./../utils/request');

var _utilsRequest2 = _interopRequireDefault(_utilsRequest);

var Base = function Base(fields, url, fieldSymbol) {
  _classCallCheck(this, Base);

  this._url = url !== undefined ? url : '';
  this[fieldSymbol] = fields !== undefined ? fields : {};
};

exports['default'] = Base;
module.exports = exports['default'];

},{"./../utils/request":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsRequest = require('./../utils/request');

var _utilsRequest2 = _interopRequireDefault(_utilsRequest);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

var _utilsFire = require('./../utils/fire');

var _utilsFire2 = _interopRequireDefault(_utilsFire);

var Collection = (function () {
  function Collection(model, url, collectionName, event, models) {
    _classCallCheck(this, Collection);

    this._model = model;
    this._collectionName = collectionName;
    this._event = event;
    this._models = models !== undefined ? models : [];
    this._urlPlural = url !== undefined ? url : '';
    this._url = url.endsWith('s') ? url.slice(0, -1) : url;
  }

  _createClass(Collection, [{
    key: 'resetLocalModels',
    value: function resetLocalModels(data) {
      var _this = this;

      if (!data) return;
      this._models = data.map(function (item) {
        return new _this._model(item);
      });
    }
  }, {
    key: 'getLocalModels',
    value: function getLocalModels() {
      return this._models;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this2 = this;

      var data = undefined;
      if (_serialize2['default'].size(this._collectionName) === 0) {
        return _utilsRequest2['default'].get(this._urlPlural).then(function (res) {
          data = res.data;
          _serialize2['default'].addCollection(_this2._collectionName, data);
          _this2.resetLocalModels(data);
          _utilsFire2['default'].fire(_this2._event);
        });
      }
      data = _serialize2['default'].getCollection(this._collectionName);
      this.resetLocalModels(data);
      _utilsFire2['default'].fire(this._event);
    }
  }, {
    key: 'add',
    value: function add(data) {
      var _this3 = this;

      return _utilsRequest2['default'].post(this._url, data).then(function (res) {
        return _this3.save(res.data);
      });
    }
  }, {
    key: 'deleteByIds',
    value: function deleteByIds(ids) {
      var _this4 = this;

      var fullfillments = ids.map(function (id) {
        return _utilsRequest2['default']['delete'](_this4._url + '/' + id);
      });
      return Promise.all(fullfillments).then(function (res) {
        return _this4.save(res[res.length - 1].data);
      })['catch'](function () {
        return console.log('ups! something went wrong');
      });
    }
  }, {
    key: 'update',
    value: function update(id, data) {
      var _this5 = this;

      _utilsRequest2['default'].update(this._url + '/' + id, data).then(function (res) {
        return _this5.save(res.data);
      });
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      return this._models;
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      return this._models.find(function (model) {
        return model.id === id;
      });
    }
  }, {
    key: 'save',
    value: function save(data) {
      _serialize2['default'].addCollection(this._collectionName, data);
      this.resetLocalModels(data);
      _utilsFire2['default'].fire(this._event);
    }
  }]);

  return Collection;
})();

exports['default'] = Collection;
module.exports = exports['default'];

},{"./../utils/fire":9,"./../utils/request":10,"./serialize":5}],5:[function(require,module,exports){
/*globals localStorage*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var Serialize = (function () {
  function Serialize() {
    _classCallCheck(this, Serialize);

    this.barn = new Barn(sessionStorage);
  }

  _createClass(Serialize, [{
    key: 'addCollection',
    value: function addCollection(collectionName, data) {
      this.barn.del(collectionName);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (item) {
            this.barn.lpush(collectionName, item);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'size',
    value: function size(collectionName) {
      return this.barn.llen(collectionName);
    }
  }, {
    key: 'getCollection',
    value: function getCollection(collectionName) {
      return this.barn.lrange(collectionName, 0, this.size(collectionName));
    }
  }]);

  return Serialize;
})();

exports['default'] = new Serialize();
module.exports = exports['default'];

},{"./collection":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var fieldSymbol = Symbol();

var Task = (function (_Base) {
    _inherits(Task, _Base);

    function Task(data) {
        _classCallCheck(this, Task);

        _get(Object.getPrototypeOf(Task.prototype), 'constructor', this).call(this, data, '/task', fieldSymbol);
    }

    /** @return {String}*/

    _createClass(Task, [{
        key: 'id',
        get: function get() {
            return this[fieldSymbol].id;
        }

        /** @return {String}*/
    }, {
        key: 'creatorId',
        get: function get() {
            return this[fieldSymbol].creator_id;
        }

        /** @return {String}*/
    }, {
        key: 'description',
        get: function get() {
            return this[fieldSymbol].description;
        }

        /** @return {String}*/
    }, {
        key: 'time',
        get: function get() {
            return this[fieldSymbol].time;
        }

        /** @return {String}*/
    }, {
        key: 'date',
        get: function get() {
            return this[fieldSymbol].date;
        }
    }]);

    return Task;
})(_base2['default']);

exports['default'] = Task;
module.exports = exports['default'];

},{"./base":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var fieldSymbol = Symbol();

var User = (function (_Base) {
    _inherits(User, _Base);

    function User(data) {
        _classCallCheck(this, User);

        _get(Object.getPrototypeOf(User.prototype), 'constructor', this).call(this, data, '/user', fieldSymbol);
    }

    /** @return {String}*/

    _createClass(User, [{
        key: 'id',
        get: function get() {
            return this[fieldSymbol].id;
        }

        /** @return {String}*/
    }, {
        key: 'name',
        get: function get() {
            return this[fieldSymbol].name;
        }

        /** @return {String}*/
    }, {
        key: 'lastName',
        get: function get() {
            return this[fieldSymbol].lastName;
        }

        /** @return {String}*/
    }, {
        key: 'email',
        get: function get() {
            return this[fieldSymbol].email;
        }
    }]);

    return User;
})(_base2['default']);

exports['default'] = User;
module.exports = exports['default'];

},{"./base":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _templateObject = _taggedTemplateLiteral(['\n              <li>\n                <a href=\'#\' data-user-id="', '">', ' ', '</a>\n              </li>'], ['\n              <li>\n                <a href=\'#\' data-user-id="', '">', ' ', '</a>\n              </li>']),
    _templateObject2 = _taggedTemplateLiteral(['\n            <option value="', '">', ' ', '</option>'], ['\n            <option value="', '">', ' ', '</option>']),
    _templateObject3 = _taggedTemplateLiteral(['\n        <tr data-task-id=\'', '\'>\n          <th scope="row">', '</th>\n          <td><input type="checkbox"></td>\n          <td>', '</td>\n          <td>', '</td>\n          <td>', '</td>\n          <td><a href="#" class="btn btn-info btn-xs edit-task">Edit</a></td>\n        </tr>'], ['\n        <tr data-task-id=\'', '\'>\n          <th scope="row">', '</th>\n          <td><input type="checkbox"></td>\n          <td>', '</td>\n          <td>', '</td>\n          <td>', '</td>\n          <td><a href="#" class="btn btn-info btn-xs edit-task">Edit</a></td>\n        </tr>']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _utilsSelect = require('./utils/select');

var _utilsSelect2 = _interopRequireDefault(_utilsSelect);

var _utilsSaferHtml = require("./utils/safer-html");

var _utilsSaferHtml2 = _interopRequireDefault(_utilsSaferHtml);

var UI = (function () {
    function UI() {
        _classCallCheck(this, UI);

        this._usersListContainer = (0, _utilsSelect2['default'])('#users');
        this._tasksContainer = (0, _utilsSelect2['default'])('#show-tasks tbody')[0];
        this._contentModals = (0, _utilsSelect2['default'])('.modal-content');
        this._sourceModal = (0, _utilsSelect2['default'])('#source-modal');
        this._overLay = (0, _utilsSelect2['default'])('.modal-backdrop')[0];
        this._userInTask = (0, _utilsSelect2['default'])('#task-user');
        this._taskForm = this._sourceModal.find('#task-modal form');
        this._taskUserField = this._taskForm.find('[name="user"]');
        this._taskDescriptionField = this._taskForm.find('[name="description"]');
        this._taskTimeField = this._taskForm.find('[name="time"]');
        this._taskDateField = this._taskForm.find('[name="date"]');
        this._modalTaskTitle = this._sourceModal.find('.dynamic-task-title');
        this._filterUserId = null;
    }

    _createClass(UI, [{
        key: 'updateUsers',
        value: function updateUsers(users) {
            /*User*/
            this._usersListContainer.innerHTML = users.reduce(function (usersHTML, user) {
                return usersHTML + (0, _utilsSaferHtml2['default'])(_templateObject, user.id, user.name, user.lastName);
            }, '');
            /*User-task*/
            this._userInTask.innerHTML = users.reduce(function (usersHTML, user) {
                return usersHTML + (0, _utilsSaferHtml2['default'])(_templateObject2, user.id, user.name, user.lastName);
            }, '<option>Select user</option>');
        }
    }, {
        key: 'updateTasks',
        value: function updateTasks(tasks) {
            var _this = this;

            var filteredTasks = tasks;
            if (this._filterUserId) {
                filteredTasks = tasks.filter(function (task) {
                    return task.creatorId === _this._filterUserId;
                });
            }

            this._tasksContainer.innerHTML = filteredTasks.reduce(function (tasksHTML, task, index) {
                if (task) {
                    return tasksHTML + (0, _utilsSaferHtml2['default'])(_templateObject3, task.id, index + 1, task.description, task.time, task.date);
                }
            }, '');
        }
    }, {
        key: 'changeModalHeaderText',
        value: function changeModalHeaderText(editable) {
            this._modalTaskTitle.innerText = editable ? 'Edit Task' : 'Add Task';
        }
    }, {
        key: 'showModal',
        value: function showModal(modal) {
            this.hideAllContentModals();
            modal.addClass('show');
            this._sourceModal.removeClass('out').addClass('in');
            this._overLay.removeClass('out').addClass('in');
        }
    }, {
        key: 'hideModal',
        value: function hideModal() {
            this._sourceModal.removeClass('in').addClass('out');
            this._overLay.removeClass('in').addClass('out');
        }
    }, {
        key: 'showEditModal',
        value: function showEditModal(modal, task) {
            this.showModal(modal);
            this._taskForm.addClass('editable');
            this._taskUserField.value = task.creatorId;
            this._taskDescriptionField.value = task.description;
            this._taskTimeField.value = task.time;
            this._taskDateField.value = task.date;
        }
    }, {
        key: 'removeTaskEditableClass',
        value: function removeTaskEditableClass() {
            this._taskForm.removeClass('editable');
        }
    }, {
        key: 'hideAllContentModals',
        value: function hideAllContentModals() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Array.from(this._contentModals)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var contentModal = _step.value;

                    contentModal.removeClass('show');
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'setTaskId',
        value: function setTaskId(id) {
            this._taskForm.attr('data-task-id', id);
        }
    }, {
        key: 'setFilterUserId',
        value: function setFilterUserId(id) {
            this._filterUserId = id;
        }
    }]);

    return UI;
})();

exports['default'] = new UI();
module.exports = exports['default'];

},{"./utils/safer-html":11,"./utils/select":12}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fire = (function () {
  function Fire() {
    _classCallCheck(this, Fire);

    this.events = {};
  }

  _createClass(Fire, [{
    key: "subscribeAndInit",
    value: function subscribeAndInit(eventName, context, callback) {
      this.subscribe(eventName, context, callback);
      callback();
    }
  }, {
    key: "subscribe",
    value: function subscribe(eventName, context, callback) {
      var eventType = this.events[eventName] = this.events[eventName] || [];
      eventType.push({
        callback: callback,
        context: context
      });
    }
  }, {
    key: "fire",
    value: function fire(eventName) {
      var eventType = this.events[eventName] || [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = eventType[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var call = _step.value;

          call.callback.call(call.context);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(eventName) {
      delete this.events[eventName];
    }
  }]);

  return Fire;
})();

exports["default"] = new Fire();
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Request = (function () {
  function Request() {
    _classCallCheck(this, Request);
  }

  _createClass(Request, [{
    key: 'ajax',
    value: function ajax(url, type, data) {
      var promise = new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(type, url);
        xhr.onreadystatechange = function () {
          if (this.readyState === this.DONE) {
            if (this.status === 200) resolve(this.response);else reject(this);
          }
        };
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(data);
      });
      return promise;
    }
  }, {
    key: 'get',
    value: function get(url, data) {
      return this.ajax(url, 'GET', data);
    }
  }, {
    key: 'post',
    value: function post(url, data) {
      return this.ajax(url, 'POST', JSON.stringify(data));
    }
  }, {
    key: 'update',
    value: function update(url, data) {
      return this.ajax(url, 'PUT', JSON.stringify(data));
    }
  }, {
    key: 'delete',
    value: function _delete(url, data) {
      return this.ajax(url, 'DELETE', JSON.stringify(data));
    }
  }]);

  return Request;
})();

exports['default'] = new Request();
module.exports = exports['default'];

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function saferHTML(literalSections) {
  var raw = literalSections.raw;
  var result = '';

  for (var _len = arguments.length, substs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    substs[_key - 1] = arguments[_key];
  }

  substs.forEach(function (subst, i) {
    var lit = raw[i];
    if (Array.isArray(subst)) {
      subst = subst.join('');
    }
    if (lit.endsWith('$')) {
      subst = htmlEscape(subst);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += subst;
  });
  result += raw[raw.length - 1];
  return result;
}

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;') // first!
  .replace(/>/g, '&gt;') //
  .replace(/</g, '&lt;') //
  .replace(/"/g, '&quot;') //
  .replace(/'/g, '&#39;') //
  .replace(/`/g, '&#96;');
}
exports['default'] = saferHTML;
module.exports = exports['default'];

},{}],12:[function(require,module,exports){
/*globals NodeList*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var findAll = function findAll(selector) {
  return this.querySelectorAll(selector);
};

NodeList.prototype.findAll = HTMLDocument.prototype.findAll = HTMLElement.prototype.findAll = findAll;

var find = function find(selector) {
  return this.querySelector(selector);
};

NodeList.prototype.find = HTMLDocument.prototype.find = HTMLElement.prototype.find = find;

Node.prototype.on = function (type, callback, useCapture) {
  this.addEventListener(type, callback, !!useCapture);
};

Node.prototype.append = function (tag, text) {
  var node = document.createElement(tag);
  if (text) {
    var textNode = document.createTextNode(text);
    node.appendChild(textNode);
  }
  return this.appendChild(node);
};

Node.prototype.appendHTML = function (HTML) {
  this.innerHTML = HTML;
};

Node.prototype.delegate = function (type, selector, handler) {
  var _this = this;

  var dispatchEvent = function dispatchEvent(event) {
    var targetElement = event.target;
    var potentialElements = _this.findAll(selector);
    if (Array.prototype.indexOf.call(potentialElements, targetElement) >= 0) {
      handler.call(targetElement, event);
    }
  };
  var useCapture = type === 'blur' || type === 'focus';
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
  var attribElement = Array.from(this.attributes).find(function (elem) {
    return elem.name === 'data-' + dataName;
  });
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

var $$ = function $$(selector) {
  if (selector.split(/[\s>]+/).pop()[0] === '#') {
    return document.find(selector);
  }
  return document.findAll(selector);
};

exports['default'] = $$;
module.exports = exports['default'];

},{}]},{},[1,12,10])


//# sourceMappingURL=all.js.map
