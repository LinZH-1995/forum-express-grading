const commentServices = require('../../services/comment-services.js')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      if (err) return next(err)
      req.session.postComment = data.postComment
      res.redirect(`/restaurants/${data.restaurantId}`)
    })
  },

  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      if (err) return next(err)
      req.session.deleteComment = data.deleteComment
      res.redirect(`/restaurants/${data.restaurantId}`)
    })
  }
}

module.exports = commentController