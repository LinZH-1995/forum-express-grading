const adminServices = require('../../services/admin-services.js')
const { responseLoggerHandler } = require('../../logger/winston.js')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  putEditRestaurant: (req, res, next) => {
    adminServices.putEditRestaurant(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  putCategory: (req, res, next) => {
    adminServices.putCategory(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  deleteCategory: (req, res, next) => {
    adminServices.deleteCategory(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  }
}

module.exports = adminController
