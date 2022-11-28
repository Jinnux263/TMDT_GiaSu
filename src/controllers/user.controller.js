const User = require('../models/user.model')
class UserController{
    async getAllUser(req,res){
        try {
            let users = await User.find({})
            res.status(200).send(users)
        } catch (error) {
            res.status(500).json(error.message)   
        }

    }
    async getUser(req,res){
        try {
            const {userId} = req.params;
            var user = await User.findOne({
                _id: userId
            })
            if (!user){
                return res.status(404).json({data: req.params,message: 'User not found'})
            }
            res.status(200).send(user)
        } catch (error) {
            res.status(500).json({data: req.params, message: error.message})    
        }
    }
    async editUser(req,res){
        try{
            const data = req.body;
            var user = await User.findOne({
                _id: req.params.userId
            })
            if (!user){
                res.status(404).json({data: req.body, message: 'User not found'})
            }
            user.phone_number = data.phone_number || user.phone_number;
            user.name = data.name || user.name;
            user.address = data.address || user.address;
            // user.gender = data.gender || user.gender;
            user.dob = data.dob || user.dob;
            user.email = data.email || user.email;
            user.save().then(savedUser =>{
                user = savedUser;
            });
            res.status(200).json(user)

        } catch (error){
            res.status(500).json({data, message: error.message})
        }
    }
}
module.exports = new UserController();