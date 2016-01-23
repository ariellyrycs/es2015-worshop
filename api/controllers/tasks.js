var JsonDB = require('node-json-db');
var db = new JsonDB('db', true, true);

module.exports = {
  findAlltasks(req, res) {
    try {
      var tasks = db.getData('/tasks');
      res.send({status: 'OK', data: tasks});
    } catch(error) {
      res.statusCode = 500;
      console.error('Error', res.statusCode, err.message);
    }
  },

  findtaskById(req, res) {
    try {
      var id = req.params.id;
      var tasks = db.getData('/tasks');
      var taskIndex = tasks.findIndex((task) => {
        return task.task_id === id;
      });
      res.send({status: 'OK', data: tasks[taskIndex]});
    } catch(error) {
      res.statusCode = 500;
      console.error('Error', res.statusCode, err.message);
    }
  },

  addTask(req, res) {
    if (!req.body) return res.sendStatus(400)
    var newTask = {
      "task_id": 'task_' + (new Date()).getTime(),
      "creator_id": req.body.user_id,
      "description": req.body.description,
      "time": req.body.time,
      "date": req.body.date
    };
    console.log(newTask);
    db.push("/tesk", newTask);
    /*
      var user = new User({
          accessToken:    req.body.accessToken,
          idProfile :    req.body.idProfile,
          name:    req.body.name
      });
      user.save(function(err) {
          var toPrint = null;
          if(err) {
              console.log('Error while saving user: ' + err);
              res.send({ error:err });
          } else {
              console.log("User created");
              toPrint =  res.send({ status: 'OK', user:user });
          }
          return toPrint;
      });*/
  },
};
