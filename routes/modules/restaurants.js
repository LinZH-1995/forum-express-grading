const express = require('express')
const router = express.Router()

const restController = require('../../controllers/restaurant-controller.js')

router.get('/:id/dashboard', restController.getDashboard)

router.get('/:id', restController.getRestaurant)

router.get('/', restController.getRestaurants)

module.exports = router