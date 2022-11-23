const MomoPayment = require('../service/payment.service');
const User = require('../models/users.model');
const Payment = require('../models/payments.model');
const PaymentDTO = require('../dto/payment.dto');

class PaymentsController {
  // paymentStrategy = MomoPayment;

  async makePayment(req, res) {
    // Todo: Check when user can login
    // const user = await User.findOne({ email: req.user.email });
    // if (!user) {
    //   res.status(404).json({ msg: 'User not found' });
    //   return;
    // }

    try {
      const newTransaction = await Payment.create(
        PaymentDTO(
          'user_id1',
          'name',
          'email',
          'paymentID',
          {},
          ['cart'],
          false,
        ),
      );
      res.status(400).json(newTransaction);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
    // MomoPayment.makePayment(req, res);
  }

  async getPayments(req, res) {
    try {
      const transactions = await Payment.find({});
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  async getPaymentsOfUser(req, res) {
    try {
      // Todo: User xac dinh bang gi? email hay user_id
      const transactions = await Payment.find({ email: req.user.email }).exec();
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }

    // TODO: REAL CODE
    // try {
    //   const user = await User.findOne({ email: req.user.email });
    //   if (!user) {
    //     res.status(404).json({ msg: 'User not found' });
    //     return;
    //   }

    //   // Todo: User xac dinh bang gi? email hay user_id
    //   const transactions = await Payment.find({ user_id: user._id }).exec();
    //   res.status(200).json(transactions);
    // } catch (err) {
    //   res.status(500).json({ msg: 'Internal Server Error' });
    // }
  }

  async getPaymentById(req, res) {
    try {
      const transaction = await Payment.findById(req.params.id).exec();

      if (!transaction) {
        res.status(404).json({ msg: 'There is no such transaction' });
        return;
      }
      res.status(200).json(transaction);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  // async updatePaymentById(req, res) {
  //   try {
  //     const transaction = await Payment.findById(req.params.id).exec();
  //     res.status(200).json(transaction);
  //   } catch (err) {
  //     res.status(500).json({ msg: 'Internal Server Error' });
  //   }
  // }

  // async deletePaymentById(req, res) {
  //   try {
  //     const transaction = await Payment.findById(req.params.id).exec();
  //     res.status(200).json(transaction);
  //   } catch (err) {
  //     res.status(500).json({ msg: 'Internal Server Error' });
  //   }
  // }
}

module.exports = new PaymentsController();
