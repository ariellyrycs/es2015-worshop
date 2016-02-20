
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
