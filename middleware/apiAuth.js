const passport = require('../config/passport.js')

const jwtAuthenticated = (req, res, next) => {
   passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    return next()
   })(req, res, next)
}

const jwtAuthenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  jwtAuthenticated,
  jwtAuthenticatedAdmin
}