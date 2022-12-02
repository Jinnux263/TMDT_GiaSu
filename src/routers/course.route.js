const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const Course = require('../models/course.model');
const Customer = require('../models/customer.model');
router.get('/', async (req, res) => {
  try {
    let courses = await Course.find({});
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/:courseId/apply', courseController.applyCourse);
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const course = await Course.create(data);
    const customer = await Customer.findOne({ _id: data.customer });
    await Customer.findOneAndUpdate(
      { _id: data.customer },
      { number_of_course: customer.number_of_course + 1 },
    );
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post('/create-multiple', async (req, res) => {
  try {
    const courses = req.body.coures;
    courses.map(async (course) => await Course.create(course));
    res.status(201).json(courses);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/get-list-course', async (req, res) => {
  try {
    const customer = req.query.id;
    const listCourse = await Course.find({ customer }).populate([
      'subjects',
      'grade',
      'customer',
    ]);
    res.status(201).json(listCourse);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/get-open-course', async (req, res) => {
  try {
    const courseOpen = await Course.find({ status: 'OPEN' })
      .populate('subjects')
      .populate('grade')
      .populate('customer');

    res.status(200).send(courseOpen);
  } catch (error) {
    res
      .status(500)
      .send({ data: 'error', message: 'Lỗi ở API /course/get-open-course' });
  }
});

router.delete('/delete-course-by-customer', async (req, res) => {
  try {
    const { _id, customer } = req.body.data;
    const courseToDelete = await Course.findOneAndDelete({ _id, customer });
    res.status(200).send({ courseToDelete });
  } catch (error) {
    res
      .status(500)
      .send({ data: 'error', message: 'Lỗi ở API /course/delete' });
  }
});

router.put('/sua-thong-tin-lop', async (req, res) => {
  try {
    const id_course = req.body.id;
    const changes = req.body.changes;

    const course = await Course.findOneAndUpdate({ _id: id_course }, changes);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
