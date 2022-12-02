
const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model')
const Course = require('../models/course.model')

router.get('/', async (req, res) => {
    try {
        const customers = [
            {
                "id_user": '6384dbd76f8d6e5f0f9f1c73',
                "number_of_course": 0
            },
            {
                "id_user": '6384dbd76f8d6e5f0f9f1c75',
                "number_of_course": 0
            },
            {
                "id_user": '6384dbd76f8d6e5f0f9f1c77',
                "number_of_course": 0
            },
            {
                "id_user": '6384cc7d0407a8cb74f80cee',
                "number_of_course": 0
            }
        ]
        for (let customer of customers) {
            await Customer.create(customer);
        }
        res.status(200).send(customers)
    } catch (error) {
        res.status(500).json(error.message)
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