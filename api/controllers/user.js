'use strict';

let JSONDB = require('./../utils/db');
let userDB = new JSONDB('user');

class UserController {

  findAllUsers(req, res) {
    res.send({status: 'OK', data: userDB.data});
  }

  findUserById(req, res) {
    let id = req.params.id;
    res.send({
      status: 'OK',
      data: userDB.data.find(user => user.id === id)
    });
  }

  addUser(req, res) {
    if (!req.body) return res.sendStatus(400);
    userDB.addItem({
      id: `user_${new Date().getTime()}`,
      name: req.body['first-name'],
      lastName: req.body['last-name'],
      email: req.body['user-email']
    });
    res.send({ status: 'OK', data: userDB.data});
  }
}

module.exports = new UserController();
