const commentServices = require('../../services/comment-services.js')
const { responseLoggerHandler } = require('../../logger/winston.js')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  }
}

module.exports = commentController
