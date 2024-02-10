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
      const pagination = getPagination(restaurants.count, page, limit)

      return callback(null, {
        restaurants: restaurants.rows,
        categories,
        categoryId,
        page: pagination.currentPage,
        totalPage: pagination.pages,
        prev: pagination.prev,
        next: pagination.next
      })
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
      const rawRestaurant = restaurant.toJSON()
      rawRestaurant.Comments = rawRestaurant.Comments.map(comment => {
        return Object.assign(comment, { UserId: comment.userId, RestaurantId: comment.restaurantId })
      })
      return callback(null, {
        restaurant: { ...rawRestaurant, CategoryId: restaurant.categoryId },
        isFavorited,
        isLiked
      })
    } catch (err) {
      return callback(err, null)
    }
  },

  getDashboard: async (req, callback) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category, Comment] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const rawRestaurant = restaurant.toJSON()
      rawRestaurant.opening_hours = rawRestaurant.openingHours
      rawRestaurant.CategoryId = rawRestaurant.categoryId
      rawRestaurant.Comments = rawRestaurant.Comments.map(comment => {
        return { ...comment, UserId: comment.userId, RestaurantId: comment.restaurantId }
      })

      return callback(null, { restaurant: rawRestaurant })
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

      restaurants.forEach(rest => {
        rest.description = rest.description.substring(0, 50)
        rest.opening_hours = rest.openingHours
        rest.CategoryId = rest.categoryId
      })

      comments.forEach(comment => {
        comment.UserId = comment.userId
        comment.RestaurantId = comment.restaurantId
        comment.Restaurant.opening_hours = comment.Restaurant.openingHours
        comment.Restaurant.CategoryId = comment.Restaurant.categoryId
      })

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
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('FavoritedUsers.id')), 'FavoriteCount']]
        },
        group: ['id'],
        order: [['FavoriteCount', 'DESC']]
      })
      const restaurantsData = restaurants.map(rest => {
        const restaurant = rest.toJSON()
        const description = restaurant.description.substring(0, 200)
        const isFavorited = req.user?.FavoritedRestaurants.some(rest => restaurant.id === rest.id)
        const CategoryId = restaurant.categoryId
        return { ...restaurant, description, isFavorited, CategoryId, opening_hours: restaurant.openingHours }
      }).slice(0, 10)
      return callback(null, { restaurants: restaurantsData })
    } catch (err) {
      return callback(err, null)
    }
  }
}

module.exports = restaurantServices
