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
    if (user)
      return res
        .status(500)
        .json({ data: req.body, error: 'This account has already existed' });

    const newUser = new User(req.body);
    await newUser.save(async function (err) {
      if (!err) {
        if (newUser?.role == "tutor" ) {
          const data = {
            user: newUser._id,
            degree: '',
            facultity: '',
            school: '',
            description: '',
            student_id: '',
            rate_star: 0,
          };
          const tutor = new Tutors(data);
          await tutor.save(function (err) {
            // đăng ký thành công -> chuyển về trang đăng nhập
            // res.redirect('http://localhost:3000/login');
            if (!err) res.send('add data to tutors table successfully!');
            else res.status(500).jsonp({data: req.body,error: err.message });
          });
        } else if (newUser?.role == "customer") {
          const customer = new Customers({
            user: newUser._id,
            number_of_course: 0,
          });
          await customer.save(function (err) {
            // đăng ký thành công -> chuyển về trang đăng nhập
            // res.redirect('http://localhost:3000/login');
            if (!err) res.send('add data to customers table successfully!');
            else res.status(500).jsonp({data:req.body, error: err.message });
          });
        }
      } else res.status(500).jsonp({ data: req.body,error: err.message });
    });
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      var user = await User.findOne({
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
