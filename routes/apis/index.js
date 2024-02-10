const express = require('express')
const router = express.Router()

const passport = require('../../config/passport.js')

const admin = require('./modules/admin.js')
const restaurants = require('./modules/restaurants.js')
const users = require('./modules/users.js')
const favorites = require('./modules/favorites.js')
const likes = require('./modules/likes.js')
const following = require('./modules/following.js')
const comments = require('./modules/comments.js')

const userController = require('../../controllers/apis/user-controller.js')

const { apiErrorHandler } = require('../../middleware/error-handler.js')
const { jwtAuthenticated, jwtAuthenticatedAdmin } = require('../../middleware/apiAuth.js')

router.use('/admin', jwtAuthenticated, jwtAuthenticatedAdmin, admin)

router.use('/restaurants', jwtAuthenticated, restaurants)

router.use('/users', jwtAuthenticated, users)

router.use('/favorite', jwtAuthenticated, favorites)

router.use('/like', jwtAuthenticated, likes)

router.use('/following', jwtAuthenticated, following)

router.use('/comments', jwtAuthenticated, comments)

router.get('/get_current_user', jwtAuthenticated, userController.getCurrentUser)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.post('/signup', userController.signUp)

router.use(apiErrorHandler)

module.exports = router
