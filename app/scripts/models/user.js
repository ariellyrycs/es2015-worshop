import Base from './base';

let fieldSymbol = Symbol();

class User extends Base {
    constructor(data) {
        super(data, '/user', fieldSymbol);
    }

    /** @return {String}*/
    get id () {
        return this[fieldSymbol].id;
    }

    /** @return {String}*/
    get name () {
        return this[fieldSymbol].name;
    }

    /** @return {String}*/
    get lastName() {
        return this[fieldSymbol].lastName;
    }

    /** @return {String}*/
    get email() {
        return this[fieldSymbol].email;
    }
}

export default User;