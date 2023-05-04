const express = require('express')
const router = express.Router()

const commentController = require('./../../../controllers/pages/comment-controller.js')

const { authenticatedAdmin } = require('../../../middleware/auth.js')

router.delete('/:id', authenticatedAdmin, commentController.deleteComment)

router.post('/', commentController.postComment)

module.exports = router