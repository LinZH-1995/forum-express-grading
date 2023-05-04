const { Restaurant, User, Category } = require('../../models')

const { localFileHandler, imgurFileHandler } = require('../../helpers/file-helpers.js')

const adminServices = require('../../services/admin-services.js')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },

  createRestaurant: (req, res, next) => {
    adminServices.createRestaurant(req, (err, data) => err ? next(err) : res.render('admin/create-restaurant', data))
  },

  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if(err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      req.session.createdData = data.newRestaurant
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.render('admin/restaurant', data))
  },

  getEditRestaurant: (req, res, next) => {
    adminServices.getEditRestaurant(req, (err, data) => err ? next(err) : res.render('admin/edit-restaurant', data))
  },

  putEditRestaurant: (req, res, next) => {
    adminServices.putEditRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.editRestaurant = data.editRestaurant
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.deleteData = data
      console.log(req.session)
      return res.redirect('/admin/restaurants')
    })
  },

  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.render('admin/users', data))
  },

  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, data) => {
      if (err) return next(err)
      if (data.redirect) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect(data.redirect)
      }
      req.session.patchedUser = data.patchedUser
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    })
  },

  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => err ? next(err) : res.render('admin/categories', data))
  },

  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err, data) => {
      if (err) return next(err)
      req.session.postCategory = data.postCategory
      req.flash('success_messages', 'category was successfully created')
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res, next) => {
    adminServices.putCategory(req, (err, data) => {
      if (err) return next(err)
      req.session.putCategory = data.putCategory
      req.flash('success_messages', 'category was successfully to update')
      res.redirect('/admin/categories')
    })
  },

  deleteCategory: async (req, res, next) => {
    adminServices.deleteCategory(req, (err, data) => {
      if (err) return next(err)
      req.session.deleteCategory = data.deleteCategory
      req.session.deleteCategory_restaurants = data.deleteCategory_restaurants
      req.flash('error_messages', `category "${data.deleteCategory.name}" was already delete`)
      res.redirect('/admin/categories')
    })
  }
}

module.exports = adminController