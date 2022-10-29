const Users = require('../models/users.model');
const Payments = require('../models/payments.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class usersController {
  async register(req, res) {
    res.send('Registerd');
  }
  async login(req, res) {
    res.send('Logined');
  }
}
function createAccessToken(user) {
  return jwt.sign(user, Key, { expiresIn: '1d' });
}
function createRefreshToken(user) {
  return jwt.sign(user, Key, {
    expiresIn: '1d',
  });
}
module.exports = new usersController();
