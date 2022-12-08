const courseModel = require('../models/course.model');
const customerModel = require('../models/customer.model');
const userModel = require('../models/user.model')
const tutorCourseModel = require('../models/tutor_course.model');
const tutorModel = require('../models/tutor.model');
const SendNormalMail = require('./mail.controller')
const MailConfig = require('../models/mailSettings.model');

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
  async getAppliedTutors(req, res) {
    try {
      const { courseId } = req.params;
      const course = await courseModel.findById(courseId);
      if (!course) {
        res.status(404).json({ data: courseId, message: 'No course found' });
        return;
      }
      const tutorCourses = await tutorCourseModel
        .find({
          course: courseId,
        })
        .populate('tutor');
      res.status(200).json(tutorCourses);
    } catch (error) {
      res.status(500).json({ data: { courseId: req.params.courseId } });
    }
  }
  async tutorApply(req, res) {
    try {
      const { tutorId } = req.body;
      const courseId = req.params.courseId;
      const tutor = await tutorModel
        .findOne({ _id: tutorId })
        .populate(['user']);
      if (!tutor) {
        res.status(400).json({ data: req.body, message: 'Tutor not found' });
        return;
      }
      const course = await courseModel
        .findOne({ _id: courseId }) // apply course -> có gia sư mới apply vào.
        .populate(['customer']);

      // Module SendMail

      // Begin
      const userCustomer = await course.customer.populate('user');
      const emailRecipent = userCustomer.user.email;
      const mailConfig = await MailConfig.findOne({ type: 1 });
      const subject = 'THÔNG BÁO TÌNH TRẠNG LỚP TRÊN HỆ THỐNG GIA SƯ BÁCH KHOA';
      let content = mailConfig.content.replace('{name}', tutor.user.fullname)
      await SendNormalMail(emailRecipent, content, subject);
      // End

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
      const tutorCourse = await tutorCourseModel.findOne({ // accept Gs
        tutor: tutorId,
        course: courseId,
        status: 'Pending',
      });
      if (!tutorCourse) {
        res.status(400).json({
          data: { tutorId, courseId },
          message: 'Tutor did not apply to this Course',
        });
        return;
      }
      tutorCourse.status = 'Ongoing';
      let otherTutorCourses = await tutorCourseModel.find({ // List reject
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
