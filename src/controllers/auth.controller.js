const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const Key = constants.Key;
class authController {
  async register(req, res) {
    res.send('Registerd');
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
