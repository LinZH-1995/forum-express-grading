const jwt = require('jsonwebtoken')

const userServices = require('../../services/user-services.js')
const { responseLoggerHandler } = require('../../logger/winston.js')

const userController = {
  signIn: (req, res, next) => {
    try {
      const user = req.user.toJSON()
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({ status: 'success', token, user })
      responseLoggerHandler(req, res, { status: 'success', token, user }, next)
    } catch (err) {
      next(err)
    }
  },

  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, data) => {
      if (!err) {
        res.json({ status: 'success', ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  },

  getCurrentUser: (req, res, next) => {
    userServices.getCurrentUser(req, (err, data) => {
      if (!err) {
        res.json({ ...data })
        responseLoggerHandler(req, res, { status: 'success', ...data }, next)
      } else {
        next(err)
      }
    })
  }
}

module.exports = userController
