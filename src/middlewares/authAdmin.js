const Users = require('../models/user.model');

async function authAdmin(req, res, next) {
  try {
    const user = await Users.findOne({
      _id: req.user.id,
    });
    if (!user)
      return res.status(400).json({ msg: 'There is no user in the system' });
    if (user.role === 0) {
      return res.status(400).json({
        msg: 'User is not Authorized',
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      err: err.messages,
      msg: 'Error at authAdmin',
    });
  }
}

module.exports = authAdmin;
