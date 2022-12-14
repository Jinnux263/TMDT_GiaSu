const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');
const generateMoMoPayment = require('../service/Momo');
const axios = require('axios');

function isNumeric(str) {
  if (typeof str != 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
class Transaction {
  // Todo: hien thuc ba loai giao dich o day
  async deposit(req, res) {
    // Chekc destination
    const { desUserId } = req.body;
    if (!desUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.params,
        message: 'there is no user with id ' + desUserId,
      });
    }

    // Tim user de kiem tra lai
    const user = await UserModel.findOne({
      _id: desUserId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // Luu giao dich, cap nhat so du
    if (!isNumeric(req.body.amount)) {
      return res
        .status(500)
        .json({ data: req.body, message: 'amount must be a number' });
    }
    user.balance += parseInt(req.body.amount);
    const result = await user.save();
    return res
      .status(500)
      .json({ data: result, message: 'Deposit successfully' });
  }

  async withdrawal(req, res) {
    // User nay la destination
    const { srcUserId } = req.body;
    if (!srcUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.params,
        message: 'there is no user with id ' + srcUserId,
      });
    }

    const user = await UserModel.findOne({
      _id: srcUserId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // Luu giao dich, cap nhat so du
    if (!isNumeric(req.body.amount)) {
      return res
        .status(500)
        .json({ data: req.body, message: 'amount must be a number' });
    }
    user.balance -= parseInt(req.body.amount);
    const result = await user.save();
    return res
      .status(500)
      .json({ data: result, message: 'Withdrawal successfully' });
  }

  async makePayment(req, res) {
    // User nay la source
    const { srcUserId } = req.body;
    if (!srcUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.params,
        message: 'there is no user with id ' + srcUserId,
      });
    }
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
    if (!desUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.params,
        message: 'there is no user with id ' + desUserId,
      });
    }
    const desUser = await UserModel.findOne({
      _id: desUserId,
    });
    if (!desUser) {
      return res
        .status(404)
        .json({ data: req.params, message: 'user not found' });
    }

    // Chuyen tien tu hai tai khoan toi nhau
    // Luu giao dich, cap nhat so du
    if (!isNumeric(req.body.amount)) {
      return res
        .status(500)
        .json({ data: req.body, message: 'amount must be a number' });
    }
    srcUser.balance -= parseInt(req.body.amount);
    desUser.balance += parseInt(req.body.amount);
    const result1 = await srcUser.save();
    const result2 = await desUser.save();
    return res.status(400).json({
      data: { transaction: req.body, srcUser: result1, desUser: result2 },
      message: 'Transaction successfully',
    });
  }
  // Todo: Ham ben ngoai su dung
  async makeTransaction(req, res) {
    const transactionDto = req.body;
    try {
      if (transactionDto.type === 'Deposit') {
        return this.deposit(req, res);
      } else if (transactionDto.type === 'Withdrawal') {
        return this.withdrawal(req, res);
      } else if (transactionDto.type === 'Payment') {
        return this.makePayment(req, res);
      } else {
        return res.status(500).json({
          data: transactionDto,
          message: 'transaction type incorrect',
        });
      }
    } catch (error) {
      return res.status(500).json({
        data: transactionDto,
        message: 'Internal error when make transaction',
      });
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
        desination: user._id,
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

  async getBillPaymentMethod(req, res) {
    const amount = req.body.amount;
    const MoMoPayment = generateMoMoPayment(amount);
    try {
      const result = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        MoMoPayment,
      );

      res.send(result.data);
    } catch (error) {
      // console.log('ERR: ', error.message);
      res.status(500).json({ message: error.message });
    }
    // res.json(momoBill);
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
