import Base from './base';

let fieldSymbol = Symbol();

class Task extends Base {
    constructor(data) {
        super(data, '/task', fieldSymbol);
    }

    /** @return {String}*/
    get id() {
        return this[fieldSymbol].id;
    }

    /** @return {String}*/
    get creatorId() {
        return this[fieldSymbol].creator_id;
    }

    /** @return {String}*/
    get description() {
        return this[fieldSymbol].description;
    }

    /** @return {String}*/
    get time() {
        return this[fieldSymbol].time;
    }

    /** @return {String}*/
    get date() {
        return this[fieldSymbol].date;
    }
}

export default Task;
