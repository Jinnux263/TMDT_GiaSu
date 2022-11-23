const Users = require('../models/users.model');
const Tutors = require('../models/tutors.model');
const Customers = require('../models/customers.model');
const Payments = require('../models/payments.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const Key = constants.Key;
class authController {
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
    try {
      const { email, password } = req.body;
      var user = await Users.findOne({
        email,
      });

      if (!user)
        return res
          .status(500)
          .json({ err: err.messages, error: 'User has not been registered' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: 'Authentification failed' });

      const accessToken = createAccessToken({
        email: user.email,
        password: password,
      });
      const refreshToken = createRefreshToken({
        email: user.email,
        password: password,
      });
      // const accessToken = await createAccessToken({
      //   email: 'tandat2603',
      //   password: 'password',
      // });
      // const refreshToken = createRefreshToken({
      //   email: 'tandat2603',
      //   password: 'password',
      // });

      res.cookie('refreshtoken', refreshToken, {
        path: '/user/refresh_token',
        httpOnly: true,
      });

      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
}
async function createAccessToken(user) {
  return jwt.sign(user, Key, { expiresIn: '1d' });
}
function createRefreshToken(user) {
  return jwt.sign(user, Key, {
    expiresIn: '1d',
  });
}
module.exports = new authController();
