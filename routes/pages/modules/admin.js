const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/pages/admin-controller.js')

const upload = require('../../../middleware/multer.js')

router.get('/restaurants/create', adminController.createRestaurant)

router.get('/restaurants/:id/edit', adminController.getEditRestaurant)

router.put('/restaurants/:id', upload.single('image'), adminController.putEditRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.patch('/users/:id', adminController.patchUser)

router.get('/users', adminController.getUsers)

router.get('/categories/:id', adminController.getCategories)

router.put('/categories/:id', adminController.putCategory)

router.delete('/categories/:id', adminController.deleteCategory)

router.get('/categories', adminController.getCategories)

router.post('/categories', adminController.postCategory)

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router