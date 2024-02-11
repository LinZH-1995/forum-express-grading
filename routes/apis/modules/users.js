const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller.js')

const upload = require('../../../middleware/multer.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.get('/top', requestLoggerHandler, userController.getTopUsers)

router.put('/:id', requestLoggerHandler, upload.single('image'), userController.putUser)

router.get('/:id', requestLoggerHandler, userController.getUser)

module.exports = router
