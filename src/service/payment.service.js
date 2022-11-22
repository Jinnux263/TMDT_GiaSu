const axios = require('axios');

const MOMO_CONFIG = {
  PARTNER_CODE: 'momo',
  SECRET_KEY: 'momo',
  ACCESS_KEY: 'momo',
};

class PaymentStrategy {
  async makePayment(req, res) {
    res.send('OK');
  }

  async getPayments(req, res) {
    res.send('OK');
  }

  async getPaymentById(req, res) {
    res.send('OK');
  }

  async getPaymentsOfUser(req, res) {
    res.send('OK');
  }
}

class MomoPayment extends PaymentStrategy {
  async makePayment(req, res) {
    var partnerCode = 'MOMO';
    var accessKey = 'F8BBA842ECF85';
    var secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = 'pay with MoMo';
    var redirectUrl = 'https://momo.vn/return';
    var ipnUrl = 'https://callback.url/notify';
    var amount = '50000';
    var requestType = 'captureWallet';
    var extraData = ''; //pass empty value if your merchant does not have stores

    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    const crypto = require('crypto');
    var signature = crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'en',
    };
    try {
      const result = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
      );

      // Todo: Luu payment vao he thong
      res.send(result.data);
    } catch (err) {
      console.log('ERR: ', err.message);
      res.send(err.message);
    }
  }

  async getPayments(req, res) {
    res.send('OK');
  }

  async getPaymentById(req, res) {
    res.send('OK');
  }

  async getPaymentsOfUser(req, res) {
    res.send('OK');
  }
}

module.exports = new MomoPayment();
