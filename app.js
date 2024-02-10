const express = require('express')
const exphbs = require('express-handlebars')
const expSession = require('express-session')
const connectFlash = require('connect-flash')
const methodOverride = require('method-override')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { pages, apis } = require('./routes')
const passport = require('./config/passport.js')
const { getUser } = require('./helpers/auth-helpers.js')

const app = express()
const port = process.env.PORT || 3000
const corsOptions = {
  origin: [
    'http://localhost:3030',
    'https://linzh-1995.github.io'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.engine('hbs', exphbs({ extname: '.hbs', helpers: require('./helpers/hbs-helpers.js') }))
app.set('view engine', 'hbs')

app.use(helmet())
app.use(cors(corsOptions))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(expSession({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(connectFlash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use('/api', apis)
app.use(pages)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
