const { Restaurant, User, Category, Comment } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helpers.js')
const restaurantServices = require('../../services/restaurant-services.js')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },

  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category, { model: Comment, include: [User], separate: true, order: [['createdAt', 'DESC']] }] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      const isFavorited = req.user?.FavoritedRestaurants.some(favo => favo.id === restaurant.id)
      const isLiked = req.user?.LikedRestaurants.some(like => like.id === restaurant.id)
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category, Comment] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },

  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({ raw: true, nest: true, limit: 10, order: [['createdAt', 'DESC']], include: [Category] }),
        Comment.findAll({ raw: true, nest: true, limit: 10, order: [['createdAt', 'DESC']], include: [User, Restaurant] })
      ])
      restaurants.forEach(rest => rest.description = rest.description.substring(0, 30))
      res.render('feeds', { restaurants, comments })
    } catch (err) {
      next(err)
    }
  },

  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        nest: true,
        include: [{ model: User, as: 'FavoritedUsers' }]
      })
      const restaurantsData = restaurants.map(rest => {
        const description = rest.description.substring(0, 300)
        const favoritedCount = rest.FavoritedUsers.length
        const isFavorited = req.user?.FavoritedRestaurants.some(restaurant => restaurant.id === rest.id)
        return Object.assign(rest.toJSON(), { favoritedCount, description, isFavorited })
      }).sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
      res.render('top-restaurants', { restaurants: restaurantsData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController