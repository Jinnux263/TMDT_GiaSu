const MomoPayment = require('../service/payment.service');
const User = require('../models/users.model');
const Payment = require('../models/payments.model');
const PaymentDTO = require('../dto/payment.dto');

class PaymentsController {
  // paymentStrategy = MomoPayment;

  async makePayment(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(400).json({ msg: 'User not found' });
    }
    try {
      const newTransaction = Payment.create(
        PaymentDTO(),
        //Todo: parameter cho paymentDTO o day
      );
      res.status(400).json(newTransaction);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
    // MomoPayment.makePayment(req, res);
  }

  async getPayments(req, res) {
    try {
      const transactions = await Payment.findById(req.params.id).exec();
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  async getPaymentsOfUser(req, res) {
    try {
      const transactions = await Payment.findById(req.params.id).exec();
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  }

  async getPaymentById(req, res) {
    try {
      const transaction = await Payment.findById(req.params.id).exec();
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
