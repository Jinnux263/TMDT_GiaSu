const customerModel = require('../models/customer.model');
const tutorModel = require('../models/tutor.model');
const userModel = require('../models/user.model');
class UserController {
  async getAllUser(req, res) {
    try {
      let users = await userModel.find({});
      res.status(200).send(users);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getFilterUser(req, res) {
    try {
      let filter = req.query;
      let users = await userModel.find(filter);
      // customers
      if (filter?.role == 'customer') {
        let customers = await Promise.all(
          users.map(async (user) => {
            return await customerModel
              .findOne({ user: user._id.toString() })
              .populate('user');
          }),
        );
        res.status(200).json(customers);
      }
      // Tutor
      else if (filter?.role == 'tutor') {
        let tutors = await Promise.all(
          users.map(async (user) => {
            return await tutorModel
              .findOne({ user: user._id.toString() })
              .populate('user');
          }),
        );
        res.status(200).json(tutors);
      } else {
        res.status(400).json({ data: req.query, message: 'No role specified' });
      }
    } catch (error) {
      res.status(500).json({ data: req.query, message: error.message });
    }
  }
  async getUser(req, res) {
    try {
      const { userId } = req.params;
      var user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ data: req.params, message: 'User not found' });
      }
      let publicFields = [
        '_id',
        'username',
        'phone_number',
        'fullname',
        'address',
        'gender',
        'dob',
        'email',
        'role',
        'balance',
      ];
      let populatedUser =
        user.role == 'tutor'
          ? await tutorModel
              .findOne({ user: user._id.toString() })
              .populate('user', publicFields)
          : await customerModel
              .findOne({ user: user._id.toString() })
              .populate('user', publicFields);
      res.status(200).send(populatedUser);
    } catch (error) {
      res.status(500).json({ data: req.params, message: error.message });
    }
  }
  async editUser(req, res) {
    try {
      const data = req.body;
      let userId = req.params.userId;
      // return "Oke"
      var user = await userModel.findById(userId);
      if (!user) {
        res.status(404).json({ data: req.body, message: 'User not found' });
      } else {
        user.phone_number = data.phone_number || user.phone_number;
        user.fullname = data.fullname || user.fullname;
        user.address = data.address || user.address;
        // user.gender = data.gender || user.gender;
        user.dob = data.dob || user.dob;
        user.email = data.email || user.email;
        if (user.role == 'tutor') {
          var tutor = await tutorModel.findOne({ user: userId });
          console.log('Tutor', tutor);
          tutor.degree = data.degree || tutor.degree;
          tutor.faculity = data.faculity || tutor.faculity;
          tutor.school = data.school || tutor.school;
          tutor.description = data.description || tutor.description;
          tutor.student_id = data.student_id || tutor.student_id;
        }
        await tutor.save();
        await user.save().then((savedUser) => {
          user = savedUser;
        });
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ data: req.body, message: error.message });
    }
  }
}
module.exports = new UserController();
