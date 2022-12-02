const Tutor = require('../models/tutor.model')
const User = require('../models/user.model')
class TutorController{
    async getAllTutors(req,res){
        try {
            let tutors = await Tutor.find({})
            res.status(200).send(tutors.map(tutor => {return tutor.populate("_id")}))
        } catch (error) {
            res.status(500).json(error.message)   
        }

    }
    async getTutor(req,res){
        try {
            const {tutorId} = req.params;
            var user = await User.findOne({
                _id: tutorId
            })
            if (!user){
                return res.status(404).json({data: req.params,message: 'tutor not found'})
            }
            var tutor = await Tutor.findOne({
                _id: tutorId
            })
            res.status(200).send(tutor.populate("_id"))
        } catch (error) {
            res.status(500).json({data: req.params, message: error.message})    
        }
    }
    async editTutor(req,res){
        try{
            const data = req.body;
            var tutor = await Tutor.findOne({
                _id: req.params.tutorId
            })
            if (!tutor){
                res.status(404).json({data: req.body, message: 'tutor not found'})
            }
            tutor.phone_number = data.phone_number || tutor.phone_number;
            tutor.fullname = data.fullname || tutor.fullname;
            tutor.address = data.address || tutor.address;
            // tutor.gender = data.gender || tutor.gender;
            tutor.dob = data.dob || tutor.dob;
            tutor.email = data.email || tutor.email;
            await tutor.save().then(savedtutor =>{
                tutor = savedtutor;
            });
            res.status(200).json(tutor)

        } catch (error){
            res.status(500).json({data, message: error.message})
        }
    }
}
module.exports = new TutorController();