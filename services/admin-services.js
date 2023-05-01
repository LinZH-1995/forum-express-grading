const { Restaurant, User, Category, Comment } = require('../models')

const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers.js')

const adminServices = {
  getRestaurants: async (req, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      return callback(null, { restaurants })
    } catch (err) {
      callback(err, null)
    }
  },

  deleteRestaurant: async (req, callback) => {
    try {
      const id = req.params.id
      const [restaurant, comments] = await Promise.all([Restaurant.findByPk(id), Comment.findAll({ where: { restaurantId: id }})])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const deletedComments = await Promise.all(Array.from({ length: comments.length }, (e, i) => e = comments[i].destroy()))
      const deletedRestaurant = await restaurant.destroy()
      return callback(null, { deletedRestaurant, deletedComments })
    } catch (err) {
      callback(err, null)
    }
  }
}

module.exports = adminServices