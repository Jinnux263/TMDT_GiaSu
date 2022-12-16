const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// Todo: Them middleware auth voi authAdmin vo router nay
// router.post('/', auth, (req, res) =>
//   TransactionController.makeTransaction(req, res),
// );

router.get('/', auth, TransactionController.getAllTransactions);

router.post('/ipn', TransactionController.ipnHandler);

router.post('/payment', (req, res) => {
  TransactionController.makePayment(req, res);
});

router.post('/withdrawal', (req, res) => {
  TransactionController.withdrawal(req, res);
});

router.post('/bill-infor', auth, (req, res) => {
  TransactionController.getBillPaymentMethod(req, res);
});

router.get(
  '/user/:userId',
  auth,
  TransactionController.getAllTransactionOfUser,
);

router.get('/:transactionId', auth, TransactionController.getTransactionById);

module.exports = router;
