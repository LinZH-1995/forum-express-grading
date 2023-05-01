const express = require('express')
const router = express.Router()

const admin = require('./modules/admin.js')
const restaurants = require('./modules/restaurants.js')

const { apiErrorHandler } = require('../../middleware/error-handler.js')

router.use('/admin', admin)

router.use('/restaurants', restaurants)

router.use(apiErrorHandler)

module.exports = router