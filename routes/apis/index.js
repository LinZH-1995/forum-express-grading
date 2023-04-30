const express = require('express')
const router = express.Router()

const restaurants = require('./modules/restaurants.js')

router.use('/restaurants', restaurants)

module.exports = router