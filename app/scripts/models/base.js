import rq  from './../utils/request';

class Base {
  constructor (fields, url, fieldSymbol) {
    this._url = url !== undefined ? url : '';
    this[fieldSymbol] = fields !== undefined ? fields : {};
  }
}

export default Base;
