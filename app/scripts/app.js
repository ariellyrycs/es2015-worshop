
import rq from './utils/request';
import $$ from './utils/select';
import Collection from './models/collection';
import UI from './ui';
import serialize from './models/serialize';
import fire from './utils/fire';
import events from './events';
import user from './models/user';

class Application {
  constructor() {
    this._userCollection = new Collection(user, '/users', 'user', 'onUserChange');
    this._userCollection.initialize();


    fire.subscribeAndInit('onUserChange', this, () => {
      let users = this._userCollection.getLocalModels();
      UI.updateUsers(users);
    });

    events(this._userCollection);
  }
}

(() => new Application())();
