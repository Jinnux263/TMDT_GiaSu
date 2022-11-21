const PAYMENT_TYPE = {
  MOMO: 'momo',
};

class PaymentsController {
  async getPayments(req, res) {
    res.send('OK');
  }

  async makePayment(req, res) {
    res.send('OK');
  }
}

module.exports = new PaymentsController();
