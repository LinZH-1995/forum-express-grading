const express = require('express')
const router = express.Router()

const passport = require('../../config/passport.js')

const admin = require('./modules/admin.js')
const restaurants = require('./modules/restaurants.js')

const userController = require('../../controllers/apis/user-controller.js')

const { apiErrorHandler } = require('../../middleware/error-handler.js')

router.use('/admin', admin)

router.use('/restaurants', restaurants)

router.post('/signin', passport.authenticate('local', { session: false  }), userController.signIn)

router.use(apiErrorHandler)

module.exports = router