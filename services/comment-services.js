const { Restaurant, User, Comment } = require('../models')

const commentServices = {
  postComment: async (req, callback) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')
      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user || !restaurant) throw new Error("User or Restaurant didn't exist!")
      const postComment = await Comment.create({ text, userId, restaurantId })
      return callback(null, { postComment, restaurantId })
    } catch (err) {
      return callback(err, null)
    }
  },

  deleteComment: async (req, callback) => {
    try {
      const id = req.params.id
      const comment = await Comment.findByPk(id)
      if (!comment) throw new Error("Comment didn't exist!")
      const deleteComment = await comment.destroy()
      return callback(null, { deleteComment, restaurantId: deleteComment.restaurantId })
    } catch (err) {
      return callback(err, null)
    }
  }
}

module.exports = commentServices
