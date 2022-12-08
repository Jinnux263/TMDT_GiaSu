const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const Key = constants.Key;

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ msg: 'Not Authorized' });
    jwt.verify(token.split(' ')[1], Key, async (err, user) => {
      if (err) return res.status(400).json({ msg: 'Not Authorized' });

      const checkUser = await userModel
        .findOne({ username: user.username })
        .exec();
      if (!checkUser) {
        return res.status(400).json({ msg: 'Not Authorized' });
      }
      const isMatch = await bcrypt.compare(user.password, checkUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Not Authorized' });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Can not authorize' });
  }
};

module.exports = auth;
