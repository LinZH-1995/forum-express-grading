const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/pages/user-controller.js')

router.post('/:followingId', userController.addFollowing)

router.delete('/:followingId', userController.removeFollowing)

module.exports = router