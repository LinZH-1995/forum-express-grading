const { Restaurant, User, Category, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers.js')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const DEFAULT_LIMIT = 9
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const page = Number(req.query.page) || 1
      const offset = getOffset(page, limit)
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where: { ...categoryId ? { categoryId } : null }, limit, offset }),
        Category.findAll({ raw: true })
      ])
      restaurants.rows.forEach(r => r = Object.assign(r, { description: r.description.substring(0, 50)}))
      res.render('restaurants', { restaurants: restaurants.rows, categories, categoryId, pagination: getPagination(restaurants.count, page, limit) })
    } catch (err) {
      next(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category, { model: Comment, include: [User], separate: true, order: [['createdAt', 'DESC']] }] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
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
  }
}

module.exports = restaurantController