const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');

class Transaction {
  // Todo: hien thuc ba loai giao dich o day
  async deposit(req, res) {
    // User nay la destination
    const { userId } = req.body;

    const user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // Luu giao dich, cap nhat so du
  }

  async withdrawal(req, res) {
    // User nay la destination
    const { desUserId } = req.body;
    const desUser = await UserModel.findOne({
      _id: desUserId,
    });
    if (!desUser) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // Chuyen tien tu hai tai khoan toi nhau
  }

  async makeTransaction(req, res) {
    // User nay la source
    const { srcUserId } = req.body;
    const srcUser = await UserModel.findOne({
      _id: srcUserId,
    });
    if (!srcUser) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // User nay la destination
    const { desUserId } = req.params;
    const desUser = await UserModel.findOne({
      _id: desUserId,
    });
    if (!desUser) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // Chuyen tien tu hai tai khoan toi nhau
  }

  // Todo: Ham ben ngoai su dung
  async makeTransaction(req, res) {
    const transactionDto = req.body;
    if (transactionDto.type === 'Deposit') {
      return this.deposit(req, res);
    } else if (transactionDto.type === 'Withdrawal') {
      return this.withdrawal(req, res);
    } else if (transactionDto.type === 'Payment') {
      return this.makeTransaction(req, res);
    } else {
      return res
        .status(500)
        .json({ data: transactionDto, message: 'transaction type incorrect' });
    }
  }
  async getTransactionById(req, res) {
    try {
      const { transactionId } = req.params;
      if (!transactionId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
          data: req.params,
          message: 'there is no transaction with id ' + transactionId,
        });
      }

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
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
          data: req.params,
          message: 'there is no user with id ' + userId,
        });
      }
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
        source: user._id,
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
