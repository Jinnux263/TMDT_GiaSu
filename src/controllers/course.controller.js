const tutorModel = require('../models/tutor.model');
const courseModel = require('../models/course.model');
const tutorCourseModel = require('../models/tutor_course.model');
class CourseController {
  async applyCourse(req, res) {
    try {
      const { tutorId } = req.body;
      const courseId = req.param.courseId;
      const tutor = await tutorModel.findOne({ _id: tutorId });
      if (!tutor) {
        res.status(400).json({ data: req.body, message: 'Tutor not found' });
      }
      const course = await courseModel.findOne({ _id: courseId });
      if (!course) {
        res.status(400).json({ data: req.body, message: 'Course not found' });
      }
      const tutorCourse = new tutorCourseModel({
        tutor,
        course,
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
}
module.exports = new CourseController();
