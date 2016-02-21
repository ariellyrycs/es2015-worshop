
import rq from './utils/request';
import $$ from './utils/select';
import Collection from './models/collection';
import UI from './ui';
import serialize from './models/serialize';
import fire from './utils/fire';
import Task from './models/task';
import User from './models/user';
import events from './events';

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
