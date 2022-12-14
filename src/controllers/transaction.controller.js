const UserModel = require('../models/user.model');
const TransactionModel = require('../models/transaction.model');
const CourseModel = require('../models/course.model');
const TutorCourseModel = require('../models/tutor_course.model');
const generateMoMoPayment = require('../service/Momo');
const axios = require('axios');

function isNumeric(str) {
  if (typeof str != 'string') return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
class Transaction {
  // async order(req, res) {
  //   // Chekc destination
  //   const { desUserId } = req.body;
  //   if (!desUserId.match(/^[0-9a-fA-F]{24}$/)) {
  //     return res.status(404).json({
  //       data: req.body,
  //       message: 'there is no user with id ' + desUserId,
  //     });
  //   }

  //   // Tim user de kiem tra lai
  //   const user = await UserModel.findOne({
  //     _id: desUserId,
  //   });
  //   if (!user) {
  //     return res
  //       .status(404)
  //       .json({ data: req.body, message: 'user not found' });
  //   }

  //   // Luu giao dich, cap nhat so du
  //   if (!isNumeric(req.body.amount)) {
  //     return res
  //       .status(500)
  //       .json({ data: req.body, message: 'amount must be a number' });
  //   }
  //   user.balance += parseInt(req.body.amount);
  //   const result = await user.save();
  //   return res
  //     .status(500)
  //     .json({ data: result, message: 'Deposit successfully' });
  // }

  // async deposit(req, res) {
  //   // Chekc destination
  //   const { desUserId } = req.body;
  //   if (!desUserId.match(/^[0-9a-fA-F]{24}$/)) {
  //     return res.status(404).json({
  //       data: req.body,
  //       message: 'there is no user with id ' + desUserId,
  //     });
  //   }

  //   // Tim user de kiem tra lai
  //   const user = await UserModel.findOne({
  //     _id: desUserId,
  //   });
  //   if (!user) {
  //     return res
  //       .status(404)
  //       .json({ data: req.body, message: 'user not found' });
  //   }

  //   // Luu giao dich, cap nhat so du
  //   if (!isNumeric(req.body.amount)) {
  //     return res
  //       .status(500)
  //       .json({ data: req.body, message: 'amount must be a number' });
  //   }
  //   user.balance += parseInt(req.body.amount);
  //   const result = await user.save();
  //   return res
  //     .status(500)
  //     .json({ data: result, message: 'Deposit successfully' });
  // }

  async withdrawal(req, res) {
    // User nay la destination
    const { source: srcUserId } = req.body;
    if (!srcUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.body,
        message: 'there is no user with id ' + srcUserId,
      });
    }

    const user = await UserModel.findOne({
      _id: srcUserId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ data: req.body, message: 'user not found' });
    }

    // Luu giao dich, cap nhat so du
    if (!isNumeric(req.body.amount)) {
      return res
        .status(500)
        .json({ data: req.body, message: 'amount must be a number' });
    }
    user.balance -= parseInt(req.body.amount);

    const newTransaction = new TransactionModel({
      transactionType: 'Withdrawal',
      source: user.id,
      destination: user.id,
      amount: req.body.amount,
    });
    await newTransaction.save();
    await user.save();
    return res
      .status(500)
      .json({ data: newTransaction, message: 'Withdrawal successfully' });
  }

  async makePayment(req, res) {
    // User nay la source
    const { source: srcUserId } = req.body;
    if (!srcUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.body,
        message: 'there is no user with id ' + srcUserId,
      });
    }
    const srcUser = await UserModel.findOne({
      _id: srcUserId,
    });
    if (!srcUser) {
      return res
        .status(404)
        .json({ data: req.body, message: 'user not found' });
    }

    // User nay la destination
    const { destination: desUserId } = req.body;
    if (!desUserId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.body,
        message: 'there is no user with id ' + desUserId,
      });
    }
    const desUser = await UserModel.findOne({
      _id: desUserId,
    });
    if (!desUser) {
      return res
        .status(404)
        .json({ data: req.body, message: 'user not found' });
    }

    const { courseId } = req.body;
    if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        data: req.body,
        message: 'there is no course with id ' + courseId,
      });
    }
    const course = await CourseModel.findOne({
      _id: courseId,
    });
    if (!course) {
      return res
        .status(404)
        .json({ data: req.body, message: 'course not found' });
    }

    course.status = 'FINISH';
    await course.save();

    const tutor = await TutorCourseModel.findOne({
      course: courseId,
    });
    if (!tutor) {
      return res
        .status(404)
        .json({ data: req.body, message: 'tutor not found' });
    }
    tutor.status = 'Finish';
    await tutor.save();

    // Chuyen tien tu hai tai khoan toi nhau
    // Luu giao dich, cap nhat so du
    if (!isNumeric(req.body.amount)) {
      return res
        .status(500)
        .json({ data: req.body, message: 'amount must be a number' });
    }

    srcUser.balance -= parseInt(req.body.amount);
    desUser.balance += parseInt(req.body.amount) * 0.9;
    const result1 = await srcUser.save();
    const result2 = await desUser.save();

    const newTransaction = new TransactionModel({
      transactionType: 'Payment',
      source: srcUser.id,
      destination: desUser.id,
      amount: req.body.amount,
    });
    await newTransaction.save();

    return res.status(200).json({
      data: { transaction: req.body, srcUser: result1, desUser: result2 },
      message: 'Transaction successfully',
    });
  }

  // async makeTransaction(req, res) {
  //   const transactionDto = req.body;
  //   try {
  //     if (transactionDto.type === 'Deposit') {
  //       return this.deposit(req, res);
  //     } else if (transactionDto.type === 'Withdrawal') {
  //       return this.withdrawal(req, res);
  //     } else if (transactionDto.type === 'Payment') {
  //       return this.makePayment(req, res);
  //     } else if (transactionDto.type === 'Order') {
  //       return this.order(req, res);
  //     } else {
  //       return res.status(500).json({
  //         data: transactionDto,
  //         message: 'transaction type incorrect',
  //       });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({
  //       data: transactionDto,
  //       message: 'Internal error when make transaction',
  //     });
  //   }
  // }

  async getTransactionById(req, res) {
    try {
      const { transactionId } = req.params;
      if (!transactionId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
          data: req.params,
          message: 'there is no transaction with id ' + transactionId,
        });
      }

      let transaction = await TransactionModel.findOne({
        _id: transactionId,
        transactionType: 'Deposit' | 'Withdrawal' | 'Payment',
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
      let transactions = await TransactionModel.find({
        transactionType: 'Deposit' | 'Withdrawal' | 'Payment',
      });
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
      let user = await UserModel.findOne({
        _id: userId,
      });
      if (!user) {
        return res
          .status(404)
          .json({ data: req.params, message: 'user not found' });
      }

      // let transactions = await TransactionModel.find({
      //   $and: [
      //     { desination: user._id },
      //     {
      //       $or: [
      //         { transactionType: 'Deposit' },
      //         { transactionType: 'Withdrawal' },
      //         { transactionType: 'Payment' },
      //       ],
      //     },
      //   ],
      // });

      let transactions = await TransactionModel.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [{ source: user._id }, { destination: user._id }],
              },
              {
                $or: [
                  { transactionType: 'Deposit' },
                  { transactionType: 'Withdrawal' },
                  { transactionType: 'Payment' },
                ],
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'source',
            foreignField: '_id',
            as: 'source',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'destination',
            foreignField: '_id',
            as: 'destination',
          },
        },
      ]);
      if (!transactions) {
        return res
          .status(404)
          .json({ data: req.params, message: 'transaction not found' });
      }
      // res.status(200).send(
      //   transactions.map((transaction) => {
      //     return transaction.populate('_id');
      //   }),
      // );
      res.status(200).send(transactions);
    } catch (error) {
      res.status(500).json({ data: req.params, message: error.message });
    }
  }
  async createOrder(source, amount) {
    const newOrder = new TransactionModel({
      transactionType: 'Order',
      source: source,
      destination: source,
      amount,
    });
    const res = await newOrder.save(function (err) {});
    return newOrder.id;
  }

  async getBillPaymentMethod(req, res) {
    const amount = req.body.amount;
    const checkUser = await UserModel.findOne({ username: req.user.username });
    const orderId = await this.createOrder(checkUser.id, amount);
    const MoMoPayment = generateMoMoPayment(orderId, amount);
    try {
      const result = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        MoMoPayment,
      );

      res.send(result.data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async ipnHandler(req, res) {
    res.status(204);
    const transaction = await TransactionModel.findOne({
      _id: req.body.orderId,
      transactionType: 'Order',
    });

    const newTransaction = new TransactionModel({
      transactionType: 'Deposit',
      source: transaction.source,
      destination: transaction.destination,
      amount: transaction.amount,
    });
    await newTransaction.save();

    const user = await UserModel.findOne({
      _id: transaction.source,
    });
    user.balance += parseInt(req.body.amount);
    const result = await user.save();
  }
}
module.exports = new Transaction();
