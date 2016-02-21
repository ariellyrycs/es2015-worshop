

class Fire {
  constructor() {
    this.events = {};
  }

  subscribeAndInit(eventName, context, callback) {
    this.subscribe(eventName, context, callback);
    callback();
  }

  subscribe(eventName, context, callback) {
    //do it witch es6
    var eventType = this.events[eventName] = this.events[eventName] || [];
    eventType.push({
      callback: callback,
      context: context
    });
  }

  fire(eventName) {
    let eventType = this.events[eventName] || [];
    for(let call of eventType) {
      call.callback.call(call.context);
    }
  }

  unsubscribe(eventName) {
    delete this.events[eventName];
  }
}

export default new Fire();
