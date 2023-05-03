const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { User, Restaurant } = require('../models')

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOpts, async (jwt_payload, cb) => {
  try {
    const user = await User.findByPk(jwt_payload.id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['id'], through: { attributes: [] } },
        { model: Restaurant, as: 'LikedRestaurants', attributes: ['id'], through: { attributes: [] } },
        { model: User, as: 'Followers', attributes: { exclude: ['password'] }, through: { attributes: [] } },
        { model: User, as: 'Followings', attributes: { exclude: ['password'] }, through: { attributes: [] } }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
}))

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, cb) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    const match = await bcrypt.compare(password, user.password)
    if (match) return cb(null, user)
    return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
  } catch (err) {
    return cb(err, false)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      nest: true,
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['id'], through: { as: 'Favorite', attributes: [] } },
        { model: Restaurant, as: 'LikedRestaurants', attributes: ['id'], through: { as: 'Like', attributes: [] } },
        { model: User, as: 'Followers', attributes: { exclude: ['password'] }, through: { as: 'Followship', attributes: [] } },
        { model: User, as: 'Followings', attributes: { exclude: ['password'] }, through: { as: 'Followship', attributes: [] } }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
})

module.exports = passport