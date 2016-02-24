'use strict';
let fs = require('fs');

class JSONDB {
  constructor(fileName) {
    this._fileName = fileName;
    this._dirName = `${__dirname}/${this._fileName}.json`;
    this.load();
  }

  initializeLocalObj(data) {
    this._data = data;
    this._loaded = true;
    console.info(`DataBase ${this._fileName} loaded.`);
  }

  load() {
    fs.exists(this._dirName, exists => {
      if(exists) {
        let data = fs.readFileSync(this._dirName, 'utf8');
        let body = [];
        try {
            body = JSON.parse(data);
        } catch(e) {
            console.info(`initialazing ${this._dirName}`);
        }
        this.initializeLocalObj(body);

      } else {
        fs.writeFile(this._dirName, '[]', err => {
          if(err) {
            console.error(err);
            return;
          }
          this.initializeLocalObj([]);
        });
      }
    });
  }

  save() {
    try {
      let data = JSON.stringify(this._data, null, 4);
      fs.writeFileSync(this._dirName, data, 'utf8');
    } catch (err) {
      throw new Error('Can\'t save the database', 2, err);
    }
  }

  addItem(item) {
    this._data.push(item);
    this.save();
    return this;
  }

  updateItem(id, dataToUpdate) {
    let index = this._data.findIndex(item => item.id === id);
    this._data.splice(index, 1, dataToUpdate);
    this.save();
    return this;
  }

  deleteItem(id) {
    let index = this._data.findIndex(item => item && item === id);
    this._data.splice(index, 1);
    this.save();
    return this;
  }

  get data() {
    return this._data;
  }
}


module.exports = JSONDB;
