const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.model');

router.get('/', async (req, res) => {
  try {
    let subjects = await Transaction.find({});
    res.status(200).send(subjects);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const subject = await Transaction.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
