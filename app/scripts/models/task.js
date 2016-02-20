let Base  = require('./base');


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
