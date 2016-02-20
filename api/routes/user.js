  'use strict';

var userController = require('./../controllers/user');

module.exports = app => {
    app.get('/users', userController.findAllUsers);
    app.get('/user/:id', userController.findUserById);
    app.post('/user', userController.addUser);
};
