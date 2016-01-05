/* globals module, require*/

'use strict';
var user = require('./../data/user.json');

class UserRoute {
  contructor() {

  }

  findAllUsers() {
    return user.find(function(err, users) {
        if(!err) {
            return res.send({status: 'OK', users:users});
        } else {
            res.statusCode = 500;
            console.error('Error', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    });
  }
}


module.exports = {
    findAllUsers: function(req, res) {
        return User.find(function(err, users) {
            if(!err) {
                return res.send({status: 'OK', users: users});
            } else {
                res.statusCode = 500;
                console.error('Error', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    }
};
