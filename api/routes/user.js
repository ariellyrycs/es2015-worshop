  'use strict';

var userController = require('./../controllers/user');
module.exports = function(app) {
    app.get('/users', userController.findAllUsers);
    app.get('/user/:id', userController.findByIdProfile);
    app.post('/user', userController.addUser);
    app.put('/user/:id', userController.updateUser);
    app.put('/user', userController.updateUser);
    app.delete('/user/:id', userController.deleteUser);
};
