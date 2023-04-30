const express = require('express')
const router = express.Router()

const restController = require('../../../controllers/apis/restaurant-controller.js')

router.get('/', restController.getRestaurants)

module.exports = router