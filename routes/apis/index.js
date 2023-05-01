const express = require('express')
const router = express.Router()

const admin = require('./modules/admin.js')
const restaurants = require('./modules/restaurants.js')

router.use('/admin', admin)

router.use('/restaurants', restaurants)

module.exports = router