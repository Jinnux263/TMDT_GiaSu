const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const Key = constants.Key;

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ msg: 'Not Authorized' });
    jwt.verify(token.split(' ')[1], Key, (err, user) => {
      if (err) return res.status(400).json({ msg: 'Not Authorized' });
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Can not authorize' });
  }
};

module.exports = auth;
