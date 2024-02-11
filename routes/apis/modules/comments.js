const express = require('express')
const router = express.Router()

const commentController = require('./../../../controllers/apis/comment-controller.js')

const { jwtAuthenticatedAdmin } = require('../../../middleware/apiAuth.js')
const { requestLoggerHandler } = require('../../../logger/winston.js')

router.delete('/:id', jwtAuthenticatedAdmin, requestLoggerHandler, commentController.deleteComment)

router.post('/', requestLoggerHandler, commentController.postComment)

module.exports = router
