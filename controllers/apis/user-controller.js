const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const user = req.user.toJSON()
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: { token, user }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController