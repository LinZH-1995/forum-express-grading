const { Restaurant, User, Category, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers.js')

const restaurantServices = {
  getRestaurants: async (req, callback) => {
    try {
      const userFavorites = req.user?.FavoritedRestaurants.map(favo => favo.id) || []
      const userLikes = req.user?.LikedRestaurants.map(like => like.id) || []
      const categoryId = Number(req.query.categoryId) || ''
      const DEFAULT_LIMIT = 9
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const page = Number(req.query.page) || 1
      const offset = getOffset(page, limit)
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where: { ...categoryId ? { categoryId } : null }, limit, offset }),
        Category.findAll({ raw: true })
      ])
      restaurants.rows.forEach(rest => {
        rest.description = rest.description.substring(0, 50)
        rest.isFavorited = userFavorites.includes(rest.id)
        rest.isLiked = userLikes.includes(rest.id)
      })
      return callback(null, { restaurants: restaurants.rows, categories, categoryId, pagination: getPagination(restaurants.count, page, limit) })
    } catch (err) {
      callback(err, null)
    }
  }
}

module.exports = restaurantServices 