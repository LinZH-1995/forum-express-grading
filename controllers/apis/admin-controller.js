const adminServices = require('../../services/admin-services.js')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  createRestaurant: (req, res, next) => {
    adminServices.createRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  getEditRestaurant: (req, res, next) => {
    adminServices.getEditRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  putEditRestaurant: (req, res, next) => {
    adminServices.putEditRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  putCategory: (req, res, next) => {
    adminServices.putCategory(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  },

  deleteCategory: (req, res, next) => {
    adminServices.deleteCategory(req, (err, data) => err ? next(err) : res.json({ status: 'success', ...data }))
  }
}

module.exports = adminController
