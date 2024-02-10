const bcrypt = require('bcryptjs')

const { User, Comment, Restaurant, Favorite, Like, Followship, Sequelize } = require('../models')

const { localFileHandler } = require('../helpers/file-helpers.js')

const userServices = {
  signUp: async (req, callback) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.create(Object.assign(req.body, { password: hash }))
      return callback(null, newUser.toJSON())
    } catch (err) {
      return callback(err, null)
    }
  },

  getUser: async (req, callback) => {
    try {
      // SELECT
      // Comment.restaurant_id AS restaurantId,
      // MAX(Comment.created_at ) AS createdAt,
      // Restaurant.image AS `Restaurant.image`,
      // Restaurant.id AS `Restaurant.id`
      // FROM Comments AS Comment
      // LEFT JOIN Restaurants AS Restaurant
      // ON Comment.restaurant_id = Restaurant.id
      // WHERE Comment.user_id IN (20)
      // GROUP BY restaurantId
      // ORDER BY createdAt DESC;
      // --> query Comments and filter the same comments(restaurantId) by GROUP BY
      // --> query the MAX createdAt of comment to find the latest comment
      // --> get the finally data ORDER BY ceartedAt DESC in the end
      const id = req.params.id
      const [user, comments] = await Promise.all([
        User.findByPk(id, {
          nest: true,
          include: [
            { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['image', 'id'], through: { attributes: [] } },
            { model: User, as: 'Followings', attributes: ['image', 'id'], through: { attributes: [] } },
            { model: User, as: 'Followers', attributes: ['image', 'id'], through: { attributes: [] } }
          ],
          order: [
            [{ model: Restaurant, as: 'FavoritedRestaurants' }, Favorite, 'createdAt', 'DESC'],
            [{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC'],
            [{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']
          ],
          attributes: { exclude: ['password'] }
        }),
        Comment.findAndCountAll({
          raw: true,
          nest: true,
          where: { userId: id },
          include: [{ model: Restaurant, attributes: ['image', 'id'] }],
          attributes: [[Sequelize.fn('MAX', Sequelize.col('Comment.created_at')), 'createdAt']],
          group: ['Comment.restaurant_id'],
          order: [['createdAt', 'DESC']],
          limit: 10
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      const userData = user.toJSON()
      return callback(null, {
        profile: { ...userData, Comments: comments.rows },
        isFollowed: req.user.Followings.some(e => e.id === userData.id)
      })
    } catch (err) {
      return callback(err, null)
    }
  },

  putUser: async (req, callback) => {
    try {
      if (!req.body.name) throw new Error('User name is required!')
      const id = req.params.id
      const { file } = req
      const [filePath, user] = await Promise.all([localFileHandler(file), User.findByPk(id)])
      if (!user) throw new Error("User didn't exist!")
      const editUser = await user.update({ image: filePath || user.image, name: req.body.name })
      return callback(null, { editUser, id })
    } catch (err) {
      return callback(err, null)
    }
  },

  addFavorite: async (req, callback) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({ where: { restaurantId, userId } })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      const addedFavorite = await Favorite.create({ restaurantId, userId })
      return callback(null, { addedFavorite })
    } catch (err) {
      return callback(err, null)
    }
  },

  removeFavorite: async (req, callback) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const favorite = await Favorite.findOne({ where: { restaurantId, userId } })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      const removedFavorite = await favorite.destroy()
      return callback(null, { removedFavorite })
    } catch (err) {
      return callback(err, null)
    }
  },

  addLike: async (req, callback) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({ where: { restaurantId, userId } })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')
      const addedLike = await Like.create({ restaurantId, userId })
      return callback(null, { addedLike })
    } catch (err) {
      return callback(err, null)
    }
  },

  removeLike: async (req, callback) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const like = await Like.findOne({ where: { restaurantId, userId } })
      if (!like) throw new Error("You haven't liked this restaurant")
      const removedLike = await like.destroy()
      return callback(null, { removedLike })
    } catch (err) {
      return callback(err, null)
    }
  },

  getTopUsers: async (req, callback) => {
    try {
      const users = await User.findAll({
        nest: true,
        include: [{ model: User, as: 'Followers' }],
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('Followers.id')), 'FollowerCount']],
          exclude: ['password']
        },
        group: ['id'],
        includeIgnoreAttributes: false,
        order: [['FollowerCount', 'DESC']]
      })
      const userData = users.map(user => {
        const isFollowed = req.user.Followings.some(follow => follow.id === user.id)
        return Object.assign(user.toJSON(), { isFollowed })
      })
      return callback(null, { users: userData })
    } catch (err) {
      return callback(err, null)
    }
  },

  addFollowing: async (req, callback) => {
    try {
      const userId = req.user?.id
      const followingId = req.params.followingId
      if (userId.toString() === followingId) throw new Error("You can't follow your self !")
      const [user, followship] = await Promise.all([User.findByPk(followingId), Followship.findOne({ where: { followerId: userId, followingId } })])
      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')
      const addedFollowing = await Followship.create({ followerId: userId, followingId })
      return callback(null, { addedFollowing })
    } catch (err) {
      return callback(err, null)
    }
  },

  removeFollowing: async (req, callback) => {
    try {
      const userId = req.user?.id
      const followingId = req.params.followingId
      const followship = await Followship.findOne({ where: { followerId: userId, followingId } })
      if (!followship) throw new Error("You haven't followed this user!")
      const removedFollowing = await followship.destroy()
      return callback(null, { removedFollowing })
    } catch (err) {
      return callback(err, null)
    }
  },

  getCurrentUser: async (req, callback) => {
    try {
      const user = req.user
      delete user.password
      return callback(null, user)
    } catch (err) {
      return callback(err, null)
    }
  }
}

module.exports = userServices
