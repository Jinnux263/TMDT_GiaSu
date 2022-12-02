const express = require('express')
const router = express.Router();
const UserController = require('../controllers/user.controller')
const User = require('../models/user.model')
router.get('/', UserController.getFilterUser)
router.get('/:userId', UserController.getUser)
router.patch('/:userId', UserController.editUser)

router.get('/', async (req, res) => {
    try {
        let users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const subject = await Subject.create(req.body)
        res.status(201).json(subject)
    } catch (error) {
        res.status(500).json(error.message)
    }
})
router.post('/create-multiple', async (req, res) => {
    try {
        // const users = req.body.users;
        // console.log(req.body);
        const users = [
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
        for (user of users) {
            await User.create(user);
        }
        // users.map(async user => );
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json(error.message)
    }
});

module.exports = router


