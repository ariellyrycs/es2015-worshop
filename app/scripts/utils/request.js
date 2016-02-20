
class Request {
  ajax(url, type, data) {
    var promise = new Promise((resolve, reject) => {
      var http = new XMLHttpRequest();
      http.open(type, url);
      http.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
          if (this.status === 200) resolve(this.response);
          else reject(this);
        }
      };
      http.responseType = 'json';
      http.setRequestHeader('Content-Type', 'application/json')
      http.setRequestHeader('Accept', 'application/json');
      http.send(data);
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

module.exports = new Request();
