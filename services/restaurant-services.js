const { Restaurant, User, Category, Comment, Sequelize } = require('../models')
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
      return callback(err, null)
    }
  },

  getRestaurant: async (req, callback) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category, { model: Comment, include: [{ model: User, attributes: { exclude: ['password'] } }], separate: true, order: [['createdAt', 'DESC']] }] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      const isFavorited = req.user?.FavoritedRestaurants.some(favo => favo.id === restaurant.id)
      const isLiked = req.user?.LikedRestaurants.some(like => like.id === restaurant.id)
      return callback(null, { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (err) {
      return callback(err, null)
    }
  },

  getDashboard: async (req, callback) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category, Comment] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return callback(null, { restaurant: restaurant.toJSON() })
    } catch (err) {
      return callback(err, null)
    }
  },

  getFeeds: async (req, callback) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({ raw: true, nest: true, limit: 10, order: [['createdAt', 'DESC']], include: [Category] }),
        Comment.findAll({ raw: true, nest: true, limit: 10, order: [['createdAt', 'DESC']], include: [{ model: User, attributes: { exclude: ['password'] } }, Restaurant] })
      ])
      restaurants.forEach(rest => rest.description = rest.description.substring(0, 30))
      return callback(null, { restaurants, comments })
    } catch (err) {
      return callback(err, null)
    }
  },

  getTopRestaurants: async (req, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        nest: true,
        include: [{ model: User, as: 'FavoritedUsers', attributes: [], through: { attributes: [] } }],
        attributes: ['id', 'image', 'name', 'description', [Sequelize.fn('COUNT', Sequelize.col('FavoritedUsers.id')), 'favoritedCounts']],
        group: ['id'],
        order: [['favoritedCounts', 'DESC']]
      })
      const restaurantsData = restaurants.map(restaurant => {
        const description = restaurant.description.substring(0, 300)
        const isFavorited = req.user?.FavoritedRestaurants.some(rest => restaurant.id === rest.id)
        return Object.assign(restaurant.toJSON(), { description, isFavorited })
      }).slice(0, 10)
      return callback(null, { restaurants: restaurantsData })
    } catch (err) {
      return callback(err, null)
    }
  }
}

module.exports = restaurantServices
