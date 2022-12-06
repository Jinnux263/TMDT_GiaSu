const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');
const TransactionController = require('../controllers/transaction.controller');

// Todo: Them middleware auth voi authAdmin vo router nay

router.get('/', TransactionController.getAllTransactions);

router.get('/:transactionId', TransactionController.getTransactionById);

router.get('/user/:userId', TransactionController.getAllTransactions);

module.exports = router;
