const express = require('express')
const router = express.Router()

const restController = require('../../../controllers/apis/restaurant-controller.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.get('/top', requestLoggerHandler, restController.getTopRestaurants)

router.get('/feeds', requestLoggerHandler, restController.getFeeds)

router.get('/:id/dashboard', requestLoggerHandler, restController.getDashboard)

router.get('/:id', requestLoggerHandler, restController.getRestaurant)

router.get('/', requestLoggerHandler, restController.getRestaurants)

module.exports = router
