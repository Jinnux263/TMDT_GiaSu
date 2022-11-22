const MomoPayment = require('../service/payment.service');

const PAYMENT_TYPE = {
  MOMO: 'momo',
};

class PaymentsController {
  paymentStrategy = MomoPayment;

  async makePayment(req, res) {
    MomoPayment.makePayment(req, res);
  }

  async getPayments(req, res) {
    this.paymentStrategy.getPayments(req, res);
  }

  async getPaymentsOfUser(req, res) {
    this.paymentStrategy.getPaymentsOfUser(req, res);
  }

  async getPaymentById(req, res) {
    this.paymentStrategy.getPaymentById(req, res);
  }

  // async updatePaymentById(req, res) {
  //   res.send('OK');
  // }

  // async deletePaymentById(req, res) {
  //   res.send('OK');
  // }
}

module.exports = new PaymentsController();
