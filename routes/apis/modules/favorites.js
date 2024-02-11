const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.post('/:restaurantId', requestLoggerHandler, userController.addFavorite)

router.delete('/:restaurantId', requestLoggerHandler, userController.removeFavorite)

module.exports = router
