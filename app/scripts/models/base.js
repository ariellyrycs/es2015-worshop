let rq = require('./../utils/request');
class Base {
  constructor (fields, url) {
    this._url = url !== undefined ? url : '';
    this._fields = fields !== undefined ? fields : {};
  }
}

module.exports = Base;
