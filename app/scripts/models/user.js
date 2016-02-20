let Base = require('./base');

class User extends Base {
  constructor(data) {
    super(data, '/user');
  }

  /** @return {String}*/
  get id () {
    return this._fields.id;
  }

  /** @return {String}*/
  get name () {
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
