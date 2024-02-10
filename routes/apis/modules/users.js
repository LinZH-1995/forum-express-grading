const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller.js')

const upload = require('../../../middleware/multer.js')

router.get('/top', userController.getTopUsers)

router.put('/:id', upload.single('image'), userController.putUser)

router.get('/:id', userController.getUser)

module.exports = router
