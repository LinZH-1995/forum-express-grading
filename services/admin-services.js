const { Restaurant, User, Category, Comment, sequelize } = require('../models')

const { localFileHandler } = require('../helpers/file-helpers.js')

const adminServices = {
  getRestaurants: async (req, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      const restaurantsData = restaurants.map(restaurant => {
        return {
          ...restaurant,
          opening_hours: restaurant.openingHours,
          CategoryId: restaurant.categoryId
        }
      })

      return callback(null, { restaurants: restaurantsData })
    } catch (err) {
      return callback(err, null)
    }
  },

  postRestaurant: async (req, callback) => {
    try {
      if (!req.body.name || !req.body.address || !req.body.categoryId) throw new Error('Restaurant name is required!')
      const { file } = req
      const filePath = await localFileHandler(file)

      const newRestaurant = await Restaurant.create({
        name: req.body.name,
        categoryId: req.body.categoryId,
        tel: req.body.tel,
        address: req.body.address,
        openingHours: req.body.opening_hours,
        description: req.body.description,
        image: filePath || null
      })

      return callback(null, { newRestaurant })
    } catch (err) {
      return callback(err, null)
    }
  },

  getRestaurant: async (req, callback) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      restaurant.opening_hours = restaurant.openingHours
      restaurant.CategoryId = restaurant.categoryId

      return callback(null, { restaurant })
    } catch (err) {
      return callback(err, null)
    }
  },

  putEditRestaurant: async (req, callback) => {
    try {
      if (!req.body.name) throw new Error('Restaurant name is required!')
      const id = req.params.id
      const { file } = req
      // const filePath = await localFileHandler(file)
      const filePath = await localFileHandler(file)
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const editRestaurant = await restaurant.update(Object.assign({ image: filePath || restaurant.image }, req.body))
      return callback(null, { editRestaurant })
    } catch (err) {
      return callback(err, null)
    }
  },

  deleteRestaurant: async (req, callback) => {
    try {
      const id = req.params.id
      const [restaurant, comments] = await Promise.all([Restaurant.findByPk(id), Comment.findAll({ where: { restaurantId: id } })])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const deletedComments = await Promise.all(Array.from({ length: comments.length }, (e, i) => {
        e = comments[i].destroy()
        return e
      }))
      const deletedRestaurant = await restaurant.destroy()
      return callback(null, { deletedRestaurant, deletedComments })
    } catch (err) {
      return callback(err, null)
    }
  },

  getUsers: async (req, callback) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return callback(null, { users })
    } catch (err) {
      return callback(err, null)
    }
  },

  patchUser: async (req, callback) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === 'root@example.com') return callback(null, { error_messages: '禁止變更 root 權限', redirect: 'back' })
      const isAdmin = !user.isAdmin // user.isAdmin ? false : true || user.isAdmin === false
      const patchedUser = await user.update({ isAdmin })
      return callback(null, { patchedUser })
    } catch (err) {
      return callback(err, null)
    }
  },

  getCategories: async (_req, callback) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return callback(null, { categories })
    } catch (err) {
      return callback(err, null)
    }
  },

  postCategory: async (req, callback) => {
    try {
      if (!req.body.name) throw new Error('Category name is required!')
      const postCategory = await Category.create(Object.assign({}, req.body))
      return callback(null, { categoryId: postCategory.id })
    } catch (err) {
      return callback(err, null)
    }
  },

  putCategory: async (req, callback) => {
    try {
      if (!req.body.name) throw new Error('Category name is required!')
      const id = req.params.id
      const category = await Category.findByPk(id)
      if (!category) throw new Error("Category doesn't exist!")
      const putCategory = await category.update({ name: req.body.name })
      return callback(null, { categoryId: putCategory.id })
    } catch (err) {
      return callback(err, null)
    }
  },

  deleteCategory: async (req, callback) => {
    try {
      const id = req.params.id

      // disable FOREIGN_KEY_CHECKS
      await sequelize.query('SET FOREIGN_KEY_CHECKS=0')
      const category = await Category.destroy({ where: { id } })

      if (category === 0) {
        // no data to destroy, enable FOREIGN_KEY_CHECKS
        await sequelize.query('SET FOREIGN_KEY_CHECKS=1')
        throw new Error("Category doesn't exist!")
      } else if (category === 1) {
        await Restaurant.update({ categoryId: 0 }, { where: { categoryId: id } })
      }

      // enable FOREIGN_KEY_CHECKS
      await sequelize.query('SET FOREIGN_KEY_CHECKS=1')

      return callback(null, { deleteCategoryCount: category })
    } catch (err) {
      return callback(err, null)
    }
  }
}

module.exports = adminServices
