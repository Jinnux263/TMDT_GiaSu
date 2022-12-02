
const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const Customer = require('../models/customer.model');

router.get('/', async (req, res) => {
    try {
        let courses = await Course.find({})
        res.status(200).send(courses)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const course = await Course.create(data);
        const customer = await Customer.findOne({ _id: data.customer });
        await Customer.findOneAndUpdate({ _id: data.customer }, { number_of_course: customer.number_of_course + 1 })
        res.status(201).json(course)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post('/create-multiple', async (req, res) => {
    try {
        const courses = req.body.coures;
        courses.map(async course => await Course.create(course));
        res.status(201).json(courses)
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.get('/get-list-course', async (req, res) => {
    try {
        const customer = req.query.id;
        const listCourse = await Course.find({ customer }).populate(['subjects', 'grade', 'customer']);
        res.status(201).json(listCourse);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router