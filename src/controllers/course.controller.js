const courseModel = require('../models/course.model');
const customerModel = require('../models/customer.model');
const userModel = require('../models/user.model');
const tutorCourseModel = require('../models/tutor_course.model');
const tutorModel = require('../models/tutor.model');
const SendNormalMail = require('./mail.controller');
const MailConfig = require('../models/mailSettings.model');
const { populate } = require('../models/course.model');

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
      const customer = await customerModel.findOne({ _id: data.customer });
      const curCourses = await courseModel.find({
        customer: data.customer,
        status: { $ne: 'FINISH' },
      });
      let usedBalance = 0;
      curCourses.forEach((element) => {
        usedBalance += element.salary;
      });
      if (customer.balance < usedBalance + data.salary) {
        return res
          .status(400)
          .json({ data: data, message: 'Not enough in balance' });
      }
      await customerModel.findOneAndUpdate(
        { _id: data.customer },
        { number_of_course: customer.number_of_course + 1 },
      );
      const course = await courseModel.create(data);
      res.status(201).json({ data: course, message: 'New course created' });
    } catch (error) {
      res.status(500).json({ data: req.body, message: error.message });
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
  async cancelCourse(req, res) {
    try {
      const { courseId } = req.params;
      const courseToCancel = await courseModel
        .findById(courseId)
        .populate('subjects grade');
      if (!courseToCancel) {
        return res
          .status(404)
          .json({ data: req.params, message: 'Course not found' });
      }
      await tutorCourseModel.updateMany(
        { course: courseId },
        { $set: { status: 'Reject' } },
      );
      courseToCancel.status = 'CANCEL';
      await courseToCancel.save();
      return res
        .status(200)
        .json({ data: courseToCancel, message: 'Course cancelled' });
    } catch (error) {
      res.status(500).send({ data: req.params, message: error.message });
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
        .populate('tutor')
        .populate({
          path: 'tutor',
          populate: {
            path: 'user',
            model: 'User',
          },
        });
      res.status(200).json(tutorCourses);
    } catch (error) {
      res.status(500).json({
        data: { courseId: req.params.courseId },
        message: error.message,
      });
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
        .findOne({ _id: courseId, status: 'OPEN' }) // apply course -> có gia sư mới apply vào.
        .populate(['customer']);

      if (!course) {
        res.status(400).json({ data: req.body, message: 'Course not found' });
        return;
      }
      let appliedCount = await tutorCourseModel.countDocuments({
        tutor: tutorId,
        course: courseId,
      });
      if (appliedCount > 0) {
        return res.status(400).json({
          data: req.body,
          message: 'Tutor have already apply to this course',
        });
      }

      const tutorCourse = new tutorCourseModel({
        tutor: tutorId,
        course: courseId,
        status: 'Pending',
      });
      // Module SendMail

      // Begin
      const userCustomer = await course.customer.populate('user');
      const emailRecipent = userCustomer.user.email;
      const mailConfig = await MailConfig.findOne({ type: 1 });
      const subject = 'THÔNG BÁO TÌNH TRẠNG LỚP TRÊN HỆ THỐNG GIA SƯ BÁCH KHOA';
      let content = mailConfig.content.replace('{name}', tutor.user.fullname);
      await SendNormalMail(emailRecipent, content, subject);
      // End
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
        // accept Gs
        tutor: tutorId,
        course: courseId,
        status: 'Pending',
      });

      // begin module email
      const tutorAccepted = await tutorCourse.populate('tutor');
      const infoAccepted = await tutorAccepted.tutor.populate('user');
      const emailAccepted = infoAccepted.user.email;
      const subjectSuccess = 'THÔNG BÁO NHẬN LỚP GIA SƯ';
      const mailConfig = await MailConfig.findOne({ type: 3 });
      await SendNormalMail(emailAccepted, mailConfig.content, subjectSuccess);
      // end module email

      if (!tutorCourse) {
        res.status(400).json({
          data: { tutorId, courseId },
          message: 'Tutor did not apply to this Course',
        });
        return;
      }
      let otherTutorCourses = await tutorCourseModel.find({
        // List reject
        course: courseId,
        tutor: { $ne: tutorId },
      });

      const subjectReject = 'THÔNG BÁO NHẬN LỚP';
      const mailConfigMail = await MailConfig.findOne({ type: 2 });
      otherTutorCourses.map(async (item) => {
        const tutor = await item.populate('tutor');
        const userTutor = await tutor.tutor.populate('user');
        const emailTutor = userTutor.user.email;
        await SendNormalMail(emailTutor, mailConfigMail.content, subjectReject);
      });

      await tutorCourseModel.updateMany(
        { course: courseId, tutor: { $ne: tutorId } },
        { $set: { status: 'Reject' } },
      );
      tutorCourse.status = 'Ongoing';
      course.status = 'ONGOING';
      await course.save();
      await tutorCourse.save();
      const tutorCourses = await tutorCourseModel.find({ course: courseId });
      res
        .status(200)
        .json({ data: tutorCourses, message: 'Accept Tutor success' });
    } catch (error) {
      res.status(500).json({
        data: { tutorId: req.body.tutorId, courseId: req.params.courseId },
        message: error.message,
      });
    }
  }
}

module.exports = new CourseController();
