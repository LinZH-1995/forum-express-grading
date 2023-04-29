const bcrypt = require('bcryptjs')

const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')

const Sequelize = require('sequelize')

const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers.js')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ name: req.body.name, email: req.body.email, password: hash })
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  signOut: (req, res) => {
    req.logout()
    req.flash('success_messages', '登出成功！')
    res.redirect('/signin')
  },

  getUser: async (req, res, next) => {
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
//--> query Comments and filter the same comments(restaurantId) by GROUP BY
//--> query the MAX createdAt of comment to find the latest comment
//--> get the finally data ORDER BY ceartedAt DESC in the end
      const id = req.params.id
      const user = await User.findByPk(id, {
          nest: true,
          include: [
            { model: Comment, include: [{ model: Restaurant, attributes: ['image', 'id'] }], separate: true, attributes: ['restaurantId'], order: [['createdAt', 'DESC']] },
            { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['image', 'id'], through: { attributes: [] } },
            { model: User, as: 'Followings', attributes: ['image', 'id'] },
            { model: User, as: 'Followers', attributes: ['image', 'id'] },
          ],
          order: [
            [{ model: Restaurant, as: 'FavoritedRestaurants' }, Favorite, 'createdAt', 'DESC'],
            [{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC'],
            [{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']
          ]
        })
      if (!user) throw new Error("User didn't exist!")
      const userData = user.toJSON()
      const map = new Map()
      userData.Comments?.forEach(comment => {
        const restId = comment.restaurantId
        if (!map.has(restId)) map.set(restId, comment.Restaurant)
      })
      console.log(userData)
      const FavoritedRestaurants = userData.FavoritedRestaurants.slice(0, 10)
      const Followings = userData.Followings.slice(0, 10)
      const Followers = userData.Followers.slice(0, 10)
      const comment_restaurants = Array.from(map.values()).slice(0, 10)
      res.render('users/profile', { user: userData, userOfLogin: req.user, commentCounts: map.size, comment_restaurants, FavoritedRestaurants, Followings, Followers })
    } catch (err) {
      next(err)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const userId = req.user?.id
      if (id !== userId.toString()) return res.redirect(`/users/${req.params.id}`)
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },

  putUser: async (req, res, next) => {
    try {
      if (!req.body.name) throw new Error('User name is required!')
      const id = req.params.id
      const { file } = req
      const [filePath, user] = await Promise.all([imgurFileHandler(file), User.findByPk(id)])
      if (!user) throw new Error("User didn't exist!")
      await user.update(Object.assign({ image: filePath || user.image }, req.body))
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (err) {
      next(err)
    }
  },

  addFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({ where: { restaurantId, userId } })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({ restaurantId, userId })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const favorite = await Favorite.findOne({ where: { restaurantId, userId } })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },

  addLike: async (req, res, next) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({ where: { restaurantId, userId } })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')
      await Like.create({ restaurantId, userId })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const userId = req.user.id
      const restaurantId = req.params.restaurantId
      const like = await Like.findOne({ where: { restaurantId, userId } })
      if (!like) throw new Error("You haven't liked this restaurant")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },

  getTopUsers: async (req, res, next) => {
    try {
      const { or, and, gt, lt } = Sequelize.Op
      const users = await User.findAll({
        nest: true,
        include: [{ model: User, as: 'Followers' }],
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('Followers.id')), 'FollowersCounts']]
        },
        group: ['id'],
        includeIgnoreAttributes: false,
        order: [['FollowersCounts', 'DESC']]
      })
      const userData = users.map(user => {
        const isFollowed = req.user.Followings.some(follow => follow.id === user.id)
        return Object.assign(user.toJSON(), { isFollowed })
      })
      res.render('top-users', { users: userData })
    } catch (err) {
      next(err)
    }
  },

  addFollowing: async (req, res, next) => {
    try {
      const userId = req.user?.id
      const followingId = req.params.followingId
      if (userId.toString() === followingId) throw new Error("You can't follow your self !")
      const [user, followship] = await Promise.all([User.findByPk(followingId), Followship.findOne({ where: { followerId: userId, followingId } })])
      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')
      await Followship.create({ followerId: userId, followingId })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      const userId = req.user?.id
      const followingId = req.params.followingId
      const followship = await Followship.findOne({ where: { followerId: userId, followingId } })
      if (!followship) throw new Error("You haven't followed this user!")
      await followship.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController