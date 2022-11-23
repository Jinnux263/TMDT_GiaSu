const express = require('express');
const paymentsController = require('../controllers/payments.controller');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');
const Router = express.Router();

Router.route('/payment')
  // .get(auth, authAdmin, paymentsController.getPayments)
  // .post(auth, paymentsController.makePayment);
  .get(paymentsController.getPayments)
  .post(paymentsController.makePayment);

Router.route('/payment/:id')
  // .get(auth, authAdmin, paymentsController.getPayments)
  // .update(auth, authAdmin, paymentsController.getPayments)
  // .delete(auth, authAdmin, paymentsController.getPayments)
  .get(paymentsController.getPaymentById);
// .update(paymentsController.updatePaymentById)
// .delete(paymentsController.deletePaymentById);

Router.route('/payment/user/:id')
  // .get(auth, authAdmin, paymentsController.getPayments)
  // .update(auth, authAdmin, paymentsController.getPayments)
  // .delete(auth, authAdmin, paymentsController.getPayments)
  .get(paymentsController.getPaymentsOfUser);
module.exports = Router;
