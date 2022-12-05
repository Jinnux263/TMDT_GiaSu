const customerModel = require('../models/customer.model');
const tutorModel = require('../models/tutor.model');
const userModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');

class PaymentController {
  // Todo: hien thuc ba loai giao dich o day
  async deposit(req, res) {}

  async withdrawal(req, res) {}

  async makePayment(req, res) {}

  // Todo: Ham ben ngoai su dung
  async makeTransaction(req, res) {
    try {
      const { tutorId: transactionId } = req.params;
      var transaction = await TransactionModel.findOne({
        _id: transactionId,
      });
      if (!transaction) {
        return res
          .status(404)
          .json({ data: req.params, message: 'transaction not found' });
      }
      res.status(200).send(transaction.populate('_id'));
    } catch (error) {
      res.status(500).json({ data: req.params, message: error.message });
    }
  }

  // Todo: Cac ham de lay thong tin cua transaction
  async getTransactionById(req, res) {
    try {
      const { transactionId } = req.params;
      var transaction = await TransactionModel.findOne({
        _id: transactionId,
      });
      if (!transaction) {
        return res
          .status(404)
          .json({ data: req.params, message: 'transaction not found' });
      }
      res.status(200).send(transaction.populate('_id'));
    } catch (error) {
      res.status(500).json({ data: req.params, message: error.message });
    }
  }
  async getAllTransaction(req, res) {
    try {
      let transactions = await TransactionModel.find({});
      res.status(200).send(
        transactions.map((transaction) => {
          return transactions.populate('_id');
        }),
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getAllTransactionOfUser(req, res) {
    try {
      const { userId } = req.params;
      var user = await User.findOne({
        _id: tutorId,
      });
      if (!user) {
        return res
          .status(404)
          .json({ data: req.params, message: 'user not found' });
      }

      // Todo: Tim bang user id
      var transactions = await TransactionModel.find({
        _id: userId,
      });

      if (!transactions) {
        return res
          .status(404)
          .json({ data: req.params, message: 'transaction not found' });
      }
      res.status(200).send(
        transactions.map((transaction) => {
          return transactions.populate('_id');
        }),
      );
    } catch (error) {
      res.status(500).json({ data: req.params, message: error.message });
    }
  }

  // Todo: Chi lam trong truong hop admin muon chinh sua he thong
  async deleteTransaction(req, res) {
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
module.exports = new PaymentController();
