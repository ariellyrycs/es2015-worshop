import Base from './base';


let fields = Symbol();

class User extends Base {
    constructor(user) {
        super(user, '/user', fields);
    }
    /**@type {string}*/
    get id() {
        return this[fields].id;
    }

    /**@type {string}*/
    get name() {
        return this[fields].name;
    }

    /**@type {string}*/
    get lastName() {
        return this[fields].lastName;
    }

    /**@type {string}*/
    get email() {
        return this[fields].email;
    }
}

export default User;
