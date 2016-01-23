'use strict';

var taskController = require('./../controllers/tasks');

module.exports = (app) => {
  app.get('/tasks', taskController.findAlltasks);
  app.get('/task/:id', taskController.findtaskById);
  app.post('/task', taskController.addTask);
};
