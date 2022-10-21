
const Users = require('../models/users.model');
const Payments = require('../models/payments.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils')
const firebaseDB = require("firebase/database");
const Key = "123456";
class usersController {
  async register(req, res, next) {
      try {
          const { email, password } = req.body;
          // console.log("==========req.body=======", req.body)
          // const { name, email, password, address, phone } = req.body;
          // var user = await Users.findOne({
          //     email,
          // });
          // if (user)
          //     return res.status(400).json({ msg: 'Người dùng đã tồn tại' });
          // if (password.length < 6)
          //     return res.status(400).json({
          //         msg: 'Mật khẩu không được nhỏ hơn 6 ký tự',
          //     });
          // // Neu khong co user thi ma hoa mat khau la save vao database
          // // ???
          // var passwordHash = await bcrypt.hash(password, 10);
          // var newUser = new Users({
          //     name,
          //     email,
          //     password: passwordHash,
          //     images,
          // });
          // await newUser.save();
          const { accessToken,refreshToken } = await utils.signUp(email, password , {...req.body, role: 0, id: '', cart: ''})
          // Sau do tao jsonwebtoken de authentication
          // const accessToken = createAccessToken({ id: newUser._id });
          // const refreshToken = createRefreshToken({ id: newUser._id });
          res.cookie('refreshtoken', refreshToken, {
              path: '/user/refresh_token',
              httpOnly: true,
          });
          console.log('register successfully');
          res.json({ accessToken });
      } catch (err) {
          console.log(err);
          return res.status(500).json({ msg: err });      
      }
  }
  async login(req, res, next) {
      try {
          const { email, password } = req.body;
          // var user = await Users.findOne({
          //     email,
          // });
          // console.log(user);
          // if (!user)
          //     return res.status(400).json({ msg: 'Tài khoản không tồn tại' });
          const id = await utils.signIn(email, password)
          // const isMatch = await bcrypt.compare(password, user.password);
          // if (!isMatch)
          //     return res.status(400).json({ msg: 'Mật khẩu không đúng' });
          // Sau do tao jsonwebtoken de authentication
          const accessToken = createAccessToken({ id });
          const refreshToken = createRefreshToken({ id });
          // const accessToken = createAccessToken({ id: user._id });
          // const refreshToken = createRefreshToken({ id: user._id });
          res.cookie('refreshtoken', refreshToken, {
              path: '/user/refresh_token',
              httpOnly: true,
          });
          console.log('login successfully');
          res.json({ accessToken });
      } catch (err) {
          console.log("err when login", err);
          return res.status(500).json({ message: err });
      }
  }
  async logout(req, res, next) {
      try {
          res.clearCookie('refreshtoken', {
              path: '/user/refresh_token',
          });
          console.log('logout successfully');
          res.json({ msg: 'Đăng xuất thành công' });
      } catch (err) {
          console.log(err);
          return res.status(500).json({ message: err });
      }
  }
  async refreshToken(req, res, next) {
      try {
          const refreshtoken = req.cookies.refreshtoken;
          if (!refreshtoken) {
              return res
                  .status(400)
                  .json({ message: 'Please login or register' });
          }
          // Kiem tra token
          jwt.verify(
              refreshtoken,
              Key,
              (err, user) => {
                  if (err)
                      return res.status(400).json({
                          message: 'Please login or register',
                      });
                  const accesstoken = createAccessToken({ id: user.id });
                  console.log('refreshToken successfully');
                  res.json({ accesstoken, refreshtoken });
              },
          );
      } catch (err) {
          return res.status(500).json({ err: err.message });
      }
  }
  async infor(req, res, next) {
      try {
          // const user = await Users.findById(req.user.id).select('-password');
          // console.log("======req.user.id===", req.user.id)
          const user = await utils.getById('/Users', req.user.id);
          if (!user)
              return res.status(400).json({ msg: 'User does not exist.' });
          console.log('get user info successfully');
          res.json(user);
      } catch (err) {
          return res.status(500).json({ msg: err.message });
      }
  }
  async addCart(req, res, next) {
      try {
          // const user = await Users.findById(req.user.id).select('-password');
          const user = await utils.getById('/Users', req.user.id);
          if (!user)
              return res.status(400).json({ msg: 'User does not exist.' });
          // await Users.findOneAndUpdate(
          //     { _id: req.user.id },
          //     {
          //         cart: req.body.cart,
          //     },
          // );
          console.log("======req.body.car", JSON.stringify(req.body.cart))
          const test = req.body.cart.length !== 0 ? Object.assign({}, req.body.cart) : ''
          await utils.updateById('/Users', req.user.id, {cart: test})
          console.log('add cart successfully');
          return res.json({ msg: 'Added to cart' });
      } catch (err) {
          return res.status(500).json({ msg: err.message });
      }
  }
  async history(req, res, next) {
      try {
          // const history = await Payments.find({ user_id: req.user.id });
          const database = firebaseDB.getDatabase();
          const ref = firebaseDB.query(firebaseDB.ref(database, '/Payments'), firebaseDB.orderByChild('user_id'), firebaseDB.equalTo(req.user.id));
          firebaseDB.onValue(ref,
              snapshot => {
                  const val = snapshot.val()
                  res.json(Object.values(val != null ? val : {}))
              },
              error => {
                  console.log(error);
          });
          // console.log("========", req.user.id)
          // const history = await utils.filterByField('/Payments', 'user_id', req.user.id)
          // await new Promise(function (res, rej) {
              // setTimeout(() => {}, 1000)
              // res('')
          // })
          // console.log("=======history====", history)
          // res.json(history);
      } catch (err) {
          return res.status(500).json({ msg: err.message });
      }
  }
  async updateUser(req, res, next) {
      try {
       //    const { name, email, images, password } = req.body;
       //    var passwordHash = await bcrypt.hash(password, 10);
       //    const user = await Users.findByIdAndUpdate(
       //        { user_id: req.user.id },
       //        {
       //            name,
       //            email,
       //            images,
       //            password: passwordHash,
       //        },
       //    );
       console.log("========req.params.id====", req.params.id)
       await utils.updateById('/Users', req.params.id, req.body)
          res.json({ msg: 'Edit user successfully' });
      } catch (err) {
          return res.status(500).json({ msg: err.message });
      }
  }
  async updatePassword(req, res, next) {
      try {
       //    const { name, email, images, password } = req.body;
       //    var passwordHash = await bcrypt.hash(password, 10);
       //    const user = await Users.findByIdAndUpdate(
       //        { user_id: req.user.id },
       //        {
       //            name,
       //            email,
       //            images,
       //            password: passwordHash,
       //        },
       //    );
       console.log("==========newPassword=====", req.body)
       await utils.updatePassword(req.body.newPassword)
       res.json({ msg: 'Update password user successfully' });
      } catch (err) {
          return res.status(500).json({ msg: err.message });
      }
  }

  async forgotPassword(req, res, next) {
    try {
    //  console.log("==========newPassword=====", req.body)
     await utils.forgotPassword(req.body.email)
     res.json({ msg: 'Update password user successfully' });
    } catch (err) {
        
        return res.status(500).json({ msg: err.message });
    }
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