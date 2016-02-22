  'use strict';

let taskController = require('./../controllers/tasks');

module.exports = app => {
  app.get('/tasks', taskController.findAllTasks);
  app.get('/task/:id', taskController.findTaskById);
  app.post('/task', taskController.addTask);
  app.delete('/task/:id', taskController.deleteTask);
  app.put('/task/:id', taskController.updateTask);
};
