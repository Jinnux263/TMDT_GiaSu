const feedbackModel = require('../models/feedback.model');
const tutorModel = require('../models/tutor.model');
const customerModel = require('../models/customer.model');
const courseModel = require('../models/course.model');
class FeedbackController {
  async getTutorFeedbacks(req, res) {
    try {
      let tutorId = req.params.tutorId;
      let tutor = await tutorModel.findById(tutorId);
      if (!tutor) {
        res.status(404).json({ data: req.params, message: 'Tutor not found' });
      }
      let feedbacks = await feedbackModel
        .find({
          tutor: tutorId,
        })
        .populate('course')
        .populate('customer');
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ data: req.params, message: error.message });
    }
  }
  async createFeedback(req, res) {
    try {
      let data = req.body;
      console.log(data);
      let tutor = await tutorModel.findById(data.tutorId);
      if (!tutor) {
        return res.status(404).json({ data: data, message: 'Tutor not found' });
      }
      let customer = await customerModel.findById(data.customerId);
      if (!customer) {
        return res
          .status(404)
          .json({ data: data, message: 'Customer not found' });
      }
      let course = await courseModel.findById(data.courseId);
      if (!course) {
        return res
          .status(404)
          .json({ data: data, message: 'Course not found' });
      }
      let feedback = new feedbackModel({
        description: data.description,
        customer,
        course,
        tutor,
      });
      await feedback.save();
      //   await feedbackModel.create(data);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ data: req.body, message: error.message });
    }
  }
}
module.exports = new FeedbackController();
