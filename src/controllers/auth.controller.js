const User = require('../models/user.model');
const Customers = require('../models/customer.model');
const Tutors = require('../models/tutor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const Key = constants.Key;
class authController {
  async register(req, res) {
    const { username } = req.body;
    const user = await User.findOne({
      username,
    });
    if (user) {
      res.status(500).json({ error: 'This account has already existed' });
      return;
    }

    const { password, email, address, fullname, role, gender, phone_number } =
      req.body;
    if (
      !username ||
      !email ||
      !password ||
      !address ||
      !fullname ||
      !role ||
      !gender ||
      !phone_number
    ) {
      return res
        .status(500)
        .json({ data: req.body, message: 'Not enough information' });
    }

    const dataOfUser = {
      username: username,
      password: password,
      email: email,
      address: address,
      fullname: fullname,
      role: role,
      gender: gender,
      phone_number: phone_number,
      dob: new Date(),
      balance: 0,
    };
    const newUser = new User(dataOfUser);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save(async function (err) {
      if (!err) {
        if (newUser?.role == 'tutor') {
          const data = {
            user: newUser._id,
            degree: '',
            facultity: '',
            school: '',
            description: '',
            student_id: '',
            rate_star: 0,
            verified: false,
          };
          const tutor = new Tutors(data);
          await tutor.save(function (err) {
            if (!err) {
              return res
                .status(200)
                .jsonp({ data: tutor, message: 'Sign up successfully!' });
              // res.send('Sign up successfully!');
            } else {
              return res
                .status(500)
                .jsonp({ data: req.body, error: err.message });
            }
          });
        } else if (newUser?.role == 'customer') {
          const customer = new Customers({
            user: newUser._id,
            number_of_course: 0,
          });
          await customer.save(function (err) {
            if (!err) {
              return res
                .status(200)
                .jsonp({ data: customer, message: 'Sign up successfully!' });
            } else {
              res.status(500).jsonp({ data: req.body, error: err.message });
              return;
            }
          });
        }
      } else res.status(500).jsonp({ data: req.body, error: err.message });
    });
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      // Validate username and password
      if (!username || !password) {
        return res
          .status(500)
          .json({ data: req.body, message: 'Authentification failed' });
      }
      var user = await User.findOne({
        username,
      });
      if (!user) {
        res
          .status(500)
          .json({ data: req.body, message: 'Authentification failed' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({
          data: req.body,
          message: 'Authentification failed',
        });
        return;
      }

      const accessToken = await createAccessToken({
        username: user.username,
        password: password,
      });
      const refreshToken = await createRefreshToken({
        username: user.username,
        password: password,
      });

      res.cookie('refreshtoken', refreshToken, {
        path: '/user/refresh_token',
        httpOnly: true,
      });

      res.json({ user: user, accessToken });
    } catch (error) {
      res.status(500).json({ data: req.body, error: error.message });
    }
  }
}
async function createAccessToken(user) {
  return jwt.sign(user, Key, { expiresIn: '1d' });
}
async function createRefreshToken(user) {
  return jwt.sign(user, Key, {
    expiresIn: '1d',
  });
}
module.exports = new authController();
