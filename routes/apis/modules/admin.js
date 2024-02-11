const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller.js')

const upload = require('../../../middleware/multer.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.put('/restaurants/:id', requestLoggerHandler, upload.single('image'), adminController.putEditRestaurant)

router.get('/restaurants/:id', requestLoggerHandler, adminController.getRestaurant)

router.delete('/restaurants/:id', requestLoggerHandler, adminController.deleteRestaurant)

router.get('/restaurants', requestLoggerHandler, adminController.getRestaurants)

router.post('/restaurants', requestLoggerHandler, upload.single('image'), adminController.postRestaurant)

router.put('/users/:id', requestLoggerHandler, adminController.patchUser)

router.get('/users', requestLoggerHandler, adminController.getUsers)

router.get('/categories/:id', requestLoggerHandler, adminController.getCategories)

router.put('/categories/:id', requestLoggerHandler, adminController.putCategory)

router.delete('/categories/:id', requestLoggerHandler, adminController.deleteCategory)

router.get('/categories', requestLoggerHandler, adminController.getCategories)

router.post('/categories', requestLoggerHandler, adminController.postCategory)

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
