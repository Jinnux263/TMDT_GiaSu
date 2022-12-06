const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// Todo: Them middleware auth voi authAdmin vo router nay
router.post('/', auth, TransactionController.makeTransaction);

router.get('/', auth, TransactionController.getAllTransactions);

router.get('/:transactionId', auth, TransactionController.getTransactionById);

router.get(
  '/user/:userId',
  auth,
  TransactionController.getAllTransactionOfUser,
);

module.exports = router;
