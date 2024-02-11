const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.post('/:restaurantId', requestLoggerHandler, userController.addLike)

router.delete('/:restaurantId', requestLoggerHandler, userController.removeLike)

module.exports = router
