'use strict';

const JSONDB = require('./../utils/db');
const taskDB = new JSONDB('task');


class TaskController {
  findAllTasks(req, res) {
    res.send({status: 'OK', data: taskDB.data});
  }

  findTaskById(req, res) {
    var id = req.params.id;
    res.send({
      status: 'OK',
      data: taskDB.data.find(user => task.id === id)
    });
  }

  addTask(req, res) {
    if (!req.body) return res.sendStatus(400);
    taskDB.addItem({
      id: `task_${new Date().getTime()}`,
      creator_id: req.body.user,
      description: req.body.description,
      time: req.body.time,
      date: req.body.date
    });
    res.send({ status: 'OK', data: taskDB.data });
  }

  deleteTask(req, res) {
    var taskId = req.params.id;
    if (!taskId) return res.sendStatus(400);
    //TODO manage error
    taskDB.deleteItem(taskId);
    res.send({ status: 'OK', data: taskDB.data });
  }

  updateTask(req, res) {
    let taskId = req.params.id;
    if (!taskId || !req.body) return res.sendStatus(400);
    let currentObject = {
      id: req.params.id,
      creator_id: req.body.user,
      description: req.body.description,
      time: req.body.time,
      date: req.body.date
    };
    taskDB.updateItem(taskId, currentObject);
    res.send({ status: 'OK', data: taskDB.data });
  }
}

module.exports = new TaskController();
