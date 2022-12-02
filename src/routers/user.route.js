const express = require('express')
const router = express.Router();
const UserController = require('../controllers/user.controller')
router.get('/',UserController.getFilterUser)
router.get('/:userId', UserController.getUser)
router.patch('/:userId', UserController.editUser)

module.exports = router