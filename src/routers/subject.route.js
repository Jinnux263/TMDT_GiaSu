const express = require('express');
const router = express.Router();
const Subject = require('../models/subject.model');

router.get('/:subjectId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const subject = await Subject.find({ _id: subjectId });
    if (!subject) {
      res.status(404).json({ data: req.params, message: 'Subject not found' });
    } else res.status(200).send(subject);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
router.get('/', async (req, res) => {
  try {
    let subjects = await Subject.find({});
    res.status(200).send(subjects);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
