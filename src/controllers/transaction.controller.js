const customerModel = require('../models/customer.model');
const tutorModel = require('../models/tutor.model');
const userModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');

class Transaction {
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
  async getAllTransactions(req, res) {
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
      const { _id, transaction } = req.body.data;
      const transactionToDelete = await TransactionModel.findOneAndDelete({
        _id,
        transaction,
      });
      res.status(200).send({ courseToDelete: transactionToDelete });
    } catch (error) {
      res
        .status(500)
        .send({ data: 'error', message: 'Lỗi ở API /transaction/delete' });
    }
  }
}
module.exports = new Transaction();
