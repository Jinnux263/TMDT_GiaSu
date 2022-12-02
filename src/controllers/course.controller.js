const Course = require('../models/course.model');
const Customer = require('../models/customer.model');

class CourseController {
    async getAllCourse(req, res) {
        try {
            let courses = await Course.find({})
            res.status(200).send(courses)
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    async createCourse(req, res) {
        try {
            const data = req.body;
            const course = await Course.create(data);
            const customer = await Customer.findOne({ _id: data.customer });
            await Customer.findOneAndUpdate({ _id: data.customer }, { number_of_course: customer.number_of_course + 1 })
            res.status(201).json(course)
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    async createMultipleCourse(req, res) {
        try {
            const courses = req.body.coures;
            courses.map(async course => await Course.create(course));
            res.status(201).json(courses)
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    async getListCourse(req, res) {
        try {
            const customer = req.query.id;
            const listCourse = await Course.find({ customer }).populate(['subjects', 'grade', 'customer']);
            res.status(201).json(listCourse);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    async getOpenCourse(req, res) {
        try {
            const courseOpen = await Course.find({ status: 'OPEN' }).populate('subjects').populate('grade').populate('customer');

            res.status(200).send(courseOpen)
        } catch (error) {
            res.status(500).send({ data: 'error', message: 'Lỗi ở API /course/get-open-course' })
        }
    }

    async customerDeleteCourse(req, res) {
        try {
            const { _id, customer } = req.body.data;
            const courseToDelete = await Course.findOneAndDelete({ _id, customer });
            res.status(200).send({ courseToDelete });
        } catch (error) {
            res.status(500).send({ data: 'error', message: 'Lỗi ở API /course/delete' })
        }
    }
}

module.exports = new CourseController();