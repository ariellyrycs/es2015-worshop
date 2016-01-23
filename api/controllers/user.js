var JsonDB = require('node-json-db');
var db = new JsonDB('db', true, true);

module.exports = {
  findAllUsers(req, res) {
    try {
      var users = db.getData('/users');
      res.send({status: 'OK', data: users});
    } catch(error) {
      res.statusCode = 500;
      console.error('Error', res.statusCode, err.message);
    }
  },

  findUserById(req, res) {
    try {
      var id = req.params.id;
      var users = db.getData('/users');
      var userIndex = users.findIndex((user) => {
        return user.user_id === id;
      });
      res.send({status: 'OK', data: users[userIndex]});
    } catch(error) {
      res.statusCode = 500;
      console.error('Error', res.statusCode, err.message);
    }
  },

  addUser(req, res) {
    if (!req.body) return res.sendStatus(400)
    console.log(req.body);
    var users = db.getData('/users');
    db.push('/users[' + users.length +']', {
      "user_id": 'user_' + (new Date()).getTime(),
      "name": req.body.name,
      "lastName": req.body.lastName
    });
    /*
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
