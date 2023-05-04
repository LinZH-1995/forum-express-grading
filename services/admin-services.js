const { Restaurant, User, Category, Comment, Sequelize } = require('../models')

const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers.js')

const adminServices = {
  getRestaurants: async (req, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      restaurants.forEach(restaurant => {
        if (!restaurant.Category) return restaurant.Category = { name: 'none' }
      })
      // console.log(restaurants)
      return callback(null, { restaurants })
    } catch (err) {
      return callback(err, null)
    }
  },

  createRestaurant: async (req, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, where: { id: { [Sequelize.Op.ne]: 0 } } })
      return callback(null, { categories })
    } catch (err) {
      return callback(err, null)
    }
  },

  postRestaurant: async (req, callback) => {
    try {
      if (!req.body.name) throw new Error('Restaurant name is required!')
      const { file } = req
      // const filePath = await localFileHandler(file)
      const filePath = await imgurFileHandler(file)
      const newRestaurant = await Restaurant.create(Object.assign({ image: filePath || null }, req.body))
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
      if (!restaurant.Category) {
        restaurant.Category = { name: 'none' }
      }
      console.log(restaurant)
      return callback(null, { restaurant })
    } catch (err) {
      return callback(err, null)
    }
  },

  getEditRestaurant: async (req, callback) => {
    try {
      const id = req.params.id
      const [restaurant, categories] = await Promise.all([Restaurant.findByPk(id, { raw: true }), Category.findAll({ raw: true, where: { id: { [Sequelize.Op.ne]: 0 } } })])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return callback(null, { restaurant, categories })
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
      const filePath = await imgurFileHandler(file)
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
      const [restaurant, comments] = await Promise.all([Restaurant.findByPk(id), Comment.findAll({ where: { restaurantId: id }})])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const deletedComments = await Promise.all(Array.from({ length: comments.length }, (e, i) => e = comments[i].destroy()))
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
      const isAdmin = !user.isAdmin  // user.isAdmin ? false : true || user.isAdmin === false
      const patchedUser = await user.update({ isAdmin })
      return callback(null, { patchedUser })
    } catch (err) {
      return callback(err, null)
    }
  },

  getCategories: async (req, callback) => {
    try {
      const id = req.params.id === "0" || !req.params.id ? null : req.params.id
      const [categories, category] = await Promise.all([Category.findAll({ raw: true, where: { id: { [Sequelize.Op.ne]: 0 } } }), id ? Category.findByPk(id, { raw: true }) : null])
      return callback(null, { categories, category })
    } catch (err) {
      return callback(err, null)
    }
  },

  postCategory: async (req, callback) => {
    try {
      if (!req.body.name) throw new Error('Category name is required!')
      const postCategory = await Category.create(Object.assign({}, req.body))
      return callback(null, { postCategory })
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
      const putCategory = await category.update(Object.assign({}, req.body))
      return callback(null, { putCategory })
    } catch (err) {
      return callback(err, null)
    }
  },

  deleteCategory: async (req, callback) => {
    try {
      const id = req.params.id
      const [category, restaurants] = await Promise.all([
        Category.findByPk(id),
        Restaurant.findAll({ where: { categoryId: id } })
      ])
      if (!category) throw new Error("Category doesn't exist!")
      let deleteCategory_restaurants
      if (restaurants) {
        deleteCategory_restaurants = await Promise.all(Array.from({ length: restaurants.length }, (e, i) => restaurants[i].update({ categoryId: 0 })))
      }
      const deleteCategory = await category.destroy()
      return callback(null, { deleteCategory, deleteCategory_restaurants })
    } catch (err) {
      return callback(err, null)
    }
  }
}

module.exports = adminServices