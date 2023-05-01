const { Restaurant, User, Category } = require('../models')

const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers.js')

const adminServices = {
  getRestaurants: async (req, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      return callback(null, { restaurants })
    } catch (err) {
      callback(err, null)
    }
  }
}

module.exports = adminServices