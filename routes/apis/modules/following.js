const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.post('/:followingId', requestLoggerHandler, userController.addFollowing)

router.delete('/:followingId', requestLoggerHandler, userController.removeFollowing)

module.exports = router
