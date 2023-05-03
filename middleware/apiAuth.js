const passport = require('../config/passport.js')

const jwtAuthenticated = passport.authenticate('jwt', { session: false })

const jwtAuthenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  jwtAuthenticated,
  jwtAuthenticatedAdmin
}