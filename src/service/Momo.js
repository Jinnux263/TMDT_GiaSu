const crypto = require('crypto');

const generateMoMoPayment = (
  amountInput,
  ipnUrlInput = 'https://callback.url/notify',
) => {
  const partnerCode = 'MOMO';
  const accessKey = 'F8BBA842ECF85';
  const secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  const requestId = partnerCode + new Date().getTime();
  const orderId = requestId;
  const orderInfo = 'pay with MoMo';
  const redirectUrl = 'https://momo.vn/return';
  const ipnUrl = ipnUrlInput || 'http://localhost:8797/transaction/ipn';
  const amount = String(amountInput) || '50000';
  const requestType = 'captureWallet';
  const extraData = ''; //pass empty value if your merchant does not have stores

  const rawSignature =
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

  const signature = crypto
    .createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');

  return {
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
};

module.exports = generateMoMoPayment;

// const partnerCode = 'MOMO';
// const accessKey = 'F8BBA842ECF85';
// const secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
// const requestId = partnerCode + new Date().getTime();
// const orderId = requestId;
// const orderInfo = 'pay with MoMo';
// const redirectUrl = 'https://momo.vn/return';
// const ipnUrl = 'https://callback.url/notify';
// const amount = '50000';
// const requestType = 'captureWallet';
// const extraData = ''; //pass empty value if your merchant does not have stores

// const rawSignature =
//   'accessKey=' +
//   accessKey +
//   '&amount=' +
//   amount +
//   '&extraData=' +
//   extraData +
//   '&ipnUrl=' +
//   ipnUrl +
//   '&orderId=' +
//   orderId +
//   '&orderInfo=' +
//   orderInfo +
//   '&partnerCode=' +
//   partnerCode +
//   '&redirectUrl=' +
//   redirectUrl +
//   '&requestId=' +
//   requestId +
//   '&requestType=' +
//   requestType;

// const signature = crypto
//   .createHmac('sha256', secretkey)
//   .update(rawSignature)
//   .digest('hex');

//json object send to MoMo endpoint
// const requestBody = {
//   partnerCode: partnerCode,
//   accessKey: accessKey,
//   requestId: requestId,
//   amount: amount,
//   orderId: orderId,
//   orderInfo: orderInfo,
//   redirectUrl: redirectUrl,
//   ipnUrl: ipnUrl,
//   extraData: extraData,
//   requestType: requestType,
//   signature: signature,
//   lang: 'en',
// };
