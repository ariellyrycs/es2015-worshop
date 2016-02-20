/*globals localStorage*/
let Collection = require('./collection');


class Serialize {
  constructor() {
    this.barn = new Barn(sessionStorage);
  }

  addCollection(collectionName, data) {
    this.barn.del(collectionName);
    for(let item of data) {
      if(item) {
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
