const Users = require('../models/users.model');
const Tutors = require('../models/tutors.model');
const Customers = require('../models/customers.model');
const Payments = require('../models/payments.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    const user = new Users(req.body);
    // res.redirect('/login')
    await user.save(async function (err) {
      if (!err) {
        if (user?.role === 1) {
          const element = {
            user: req.body,
            degree: '',
            grade: 0,
            Faculity: '',
            School: '',
            Description: '',
            courses: [],
            studentId: 0,
            rate: [],
          };
          const tutor = new Tutors(element);
          await tutor.save(function (err) {
            if (!err) res.send('add data to tutors table successfully!');
            else res.status(500).jsonp({ error: 'message' });
          });
        } else if (user?.role === 2) {
          const customer = new Customers({ user: req.body, courses: [] });
          await customer.save(function (err) {
            if (!err) res.send('add data to customers table successfully!');
            else res.status(500).jsonp({ error: 'message' });
          });
        }
      } else res.status(500).jsonp({ error: 'message' });
    });
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
module.exports = new AuthController();
