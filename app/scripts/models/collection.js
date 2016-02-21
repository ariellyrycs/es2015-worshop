import rq from './../utils/request';
import serialize from './serialize';
import fire from './../utils/fire';

export default class Collection {
  constructor (model, url, collectionName, event, models) {
    this._model = model;
    this._collectionName = collectionName;
    this._event = event;
    this._models = models !== undefined ? models : [];
    this._urlPlural = url !== undefined ? url : '';
    this._url = url.endsWith('s')? url.slice(0, -1): url;
  }

  resetLocalModels(data) {
    if(!data) return;
    this._models = data.map((item) => new this._model(item));
  }

  getLocalModels() {
    return this._models;
  }

  initialize() {
    let data;
    if(serialize.size(this._collectionName) === 0) {
      return rq.get(this._urlPlural).then(res => {
        data = res.data;
        serialize.addCollection(this._collectionName, data);
        this.resetLocalModels(data);
        fire.fire(this._event);
      });
    }
    data = serialize.getCollection(this._collectionName);
    this.resetLocalModels(data);
    fire.fire(this._event);
  }

  add(data) {
    return rq.post(this._url, data).then(res => this.save(res.data));
  }

  deleteByIds(ids) {
    let fullfillments = ids.map(id => rq.delete(`${this._url}/${id}`));
    return Promise.all(fullfillments)
      .then(res => this.save(res[res.length - 1].data))
      .catch(() => console.log('ups! something went wrong'));
  }

  update(id, data) {
    rq.update(`${this._url}/${id}`, data).then(res => this.save(res.data));
  }

  fetch () {
    return this._models;
  }

  findById(id) {
    return this._models.find(model => model.id === id);
  }

  save(data) {
    serialize.addCollection(this._collectionName, data);
    this.resetLocalModels(data);
    fire.fire(this._event);
  }
}
