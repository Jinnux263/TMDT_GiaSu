const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');

class Transaction {
  // Todo: hien thuc ba loai giao dich o day
  async deposit(req, res) {
    const { userId } = req.params;
    var user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }
  }

  async withdrawal(req, res) {
    const { userId } = req.params;
    var user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }
  }

  async makePayment(req, res) {
    const { userId } = req.params;
    var user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }
  }

  // Todo: Ham ben ngoai su dung
  async makeTransaction(req, res) {
    const transactionDto = req.body;
    if (transactionDto.type === 'Deposit') {
      return this.deposit(req, res);
    } else if (transactionDto.type === 'Withdrawal') {
      return this.withdrawal(req, res);
    } else if (transactionDto.type === 'Payment') {
      return this.makePayment(req, res);
    } else {
      return res
        .status(500)
        .json({ data: transactionDto, message: 'transaction type incorrect' });
    }
  }
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
      var user = await UserModel.findOne({
        _id: userId,
      });
      if (!user) {
        return res
          .status(404)
          .json({ data: req.params, message: 'user not found' });
      }

      // Todo: Tim transaction bang user id
      var transactions = await TransactionModel.find({
        source: { _id: userId },
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
  // async deleteTransaction(req, res) {
  //   // Todo: Chua lam
  //   try {
  //     const { _id, transaction } = req.body.data;
  //     const transactionToDelete = await TransactionModel.findOneAndDelete({
  //       _id,
  //       transaction,
  //     });
  //     res.status(200).send({ courseToDelete: transactionToDelete });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .send({ data: 'error', message: 'Lỗi ở API /transaction/delete' });
  //   }
  // }
}
module.exports = new Transaction();
