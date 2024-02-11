const restaurantServices = require('../../services/restaurant-services.js')
const { responseLoggerHandler } = require('../../logger/winston.js')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  }
}

module.exports = restaurantController
