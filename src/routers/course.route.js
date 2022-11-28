
const express = require('express');
const router = express.Router();
const Course = require('../models/course.model')
router.get('/', async (req, res) => {
    try {
        let courses = await Course.find({})
        res.status(200).send(courses)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get('/get-open-course', async (req, res) => {
    try {
        const courseOpen = await Course.find({ status: 'OPEN' }).populate('subjects').populate('grade').populate('customer');

        res.status(200).send(courseOpen)
    } catch (error) {
        res.status(500).send({ data: 'error', message: 'Lỗi ở API /course/get-open-course' })
    }
})

router.delete('/delete-course-by-customer', async (req, res) => {
    try {
        const { _id, customer } = req.body.data;
        const courseToDelete = await Course.findOneAndDelete({ _id, customer });
        res.status(200).send({ courseToDelete });
    } catch (error) {
        res.status(500).send({ data: 'error', message: 'Lỗi ở API /course/delete' })
    }
})

router.put('/sua-thong-tin-lop', async (req, res) => {
    try {
        const id_course = req.body.id;
        const changes = req.body.changes;

        const course = await Course.findOneAndUpdate({ _id: id_course }, changes);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router