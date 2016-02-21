
class Request {
  ajax(url, type, data) {
    var promise = new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open(type, url);
      xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          if (this.status === 200) resolve(this.response);
          else reject(this);
        }
      };
      xhr.responseType = 'json';
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(data);
    });
    return promise;
  }

  get(url, data) {
    return this.ajax(url, 'GET', data);
  }

  post(url, data) {
    return this.ajax(url, 'POST', JSON.stringify(data));
  }

  update(url, data) {
    return this.ajax(url, 'PUT', JSON.stringify(data));
  }

  delete(url, data) {
    return this.ajax(url, 'DELETE', JSON.stringify(data));
  }
}

export default new Request();
