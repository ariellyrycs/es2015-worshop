import rq  from './../utils/request';

class Base {
  constructor (fields, url) {
    this._url = url !== undefined ? url : '';
    this._fields = fields !== undefined ? fields : {};
  }
}

export default Base;
