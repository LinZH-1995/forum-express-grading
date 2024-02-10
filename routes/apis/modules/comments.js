const express = require('express')
const router = express.Router()

const commentController = require('./../../../controllers/apis/comment-controller.js')

const { jwtAuthenticatedAdmin } = require('../../../middleware/apiAuth.js')

router.delete('/:id', jwtAuthenticatedAdmin, commentController.deleteComment)

router.post('/', commentController.postComment)

module.exports = router
