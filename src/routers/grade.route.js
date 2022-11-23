const express = require('express');
const router = express.Router();
const Grade = require('../models/grade.model')
router.get('/', async (req, res) => {
    try {
        let grades = await Grade.find({})
        res.status(200).send(grades)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const grade = await Grade.create(req.body)
        res.status(201).json(grade)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


module.exports = router