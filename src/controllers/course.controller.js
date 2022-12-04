const courseModel = require('../models/course.model');
const customerModel = require('../models/customer.model');
const tutorCourseModel = require('../models/tutor_course.model');
const tutorModel = require('../models/tutor.model');
const { default: mongoose } = require('mongoose');
class CourseController {
  async getAllCourse(req, res) {
    try {
      let courses = await courseModel.find({});
      res.status(200).send(courses);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createCourse(req, res) {
    try {
      const data = req.body;
      const course = await courseModel.create(data);
      const customer = await customerModel.findOne({ _id: data.customer });
      await customerModel.findOneAndUpdate(
        { _id: data.customer },
        { number_of_course: customer.number_of_course + 1 },
      );
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async createMultipleCourse(req, res) {
    try {
      const courses = req.body.coures;
      courses.map(async (course) => await courseModel.create(course));
      res.status(201).json(courses);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getListCourse(req, res) {
    try {
      const customer = req.query.id;
      const listCourse = await courseModel
        .find({ customer })
        .populate(['subjects', 'grade', 'customer']);
      res.status(201).json(listCourse);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getOpenCourse(req, res) {
    try {
      const courseOpen = await courseModel
        .find({ status: 'OPEN' })
        .populate('subjects')
        .populate('grade')
        .populate('customer');

      res.status(200).send(courseOpen);
    } catch (error) {
      res
        .status(500)
        .send({ data: 'error', message: 'Lỗi ở API /course/get-open-course' });
    }
  }

  async customerDeleteCourse(req, res) {
    try {
      const { _id, customer } = req.body.data;
      const courseToDelete = await courseModel.findOneAndDelete({
        _id,
        customer,
      });
      res.status(200).send({ courseToDelete });
    } catch (error) {
      res
        .status(500)
        .send({ data: 'error', message: 'Lỗi ở API /course/delete' });
    }
  }
  async applyCourse(req, res) {
    try {
      const { tutorId } = req.body;
      const courseId = req.params.courseId;
      console.log('Apply Course', tutorId, courseId);
      const tutor = await tutorModel.findOne({ _id: tutorId });
      if (!tutor) {
        res.status(400).json({ data: req.body, message: 'Tutor not found' });
        return;
      }
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        res.status(400).json({ data: req.body, message: 'Course not found' });
        return;
      }
      const tutorCourse = new tutorCourseModel({
        tutor: tutorId,
        course: courseId,
        status: 'Pending',
      });
      tutorCourse.save((err) => {
        if (!err) res.status(201).json(tutorCourse);
        else res.status(400).json({ data: req.body, message: err.message });
      });
    } catch (error) {
      res.status(500).json({ data: req.body, message: error.message });
    }
  }
  async acceptTutor(req, res) {
    try {
      const { tutorId } = req.body;
      const courseId = req.params.courseId;
      const tutor = await tutorModel.findOne({ _id: tutorId });
      if (!tutor) {
        res
          .status(400)
          .json({ data: { tutorId, courseId }, message: 'Tutor not found' });
        return;
      }
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        res
          .status(400)
          .json({ data: { tutorId, courseId }, message: 'Course not found' });
        return;
      }
      const tutorCourse = await tutorCourseModel.findOne({
        tutor: tutorId,
        course: courseId,
        status: 'Pending',
      });
      if (!tutorCourse) {
        res.status(400).json({
          data: { tutorId, courseId },
          message: 'Tutor did not apply to this Course',
        });
      }
      tutorCourse.status = 'Ongoing';
      let otherTutorCourses = await tutorCourseModel.find({
        course: courseId,
        tutor: { $ne: tutorId },
      });
      console.log('other', otherTutorCourses);
      await tutorCourseModel.updateMany(
        { course: courseId, tutor: { $ne: tutorId } },
        { $set: { status: 'Reject' } },
      );
      await tutorCourse.save();
      res
        .status(200)
        .json({ data: { tutorId, courseId }, message: 'Accept Tutor success' });
    } catch (error) {
      res.status(500).json({
        data: { tutorId: req.body.tutorId, courseId: req.params.courseId },
        message: error.message,
      });
    }
  }
}

module.exports = new CourseController();
