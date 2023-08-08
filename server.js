if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express')
const routes = require('./pages/routes')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { firebaseAuthMiddleware } = require('./controllers/auth')
const cookieParser = require('cookie-parser')

//numbers and stuff
const port = 3000

//usage stuff
const app = express()
app.use(cookieParser())
app.use(methodOverride('_method'))

//for pages and stuff
app.set('view engine', 'ejs')
//for css and static stuff
app.use(express.static('public'))
app.use('/img', express.static('public/img'))
//for data parsing
app.use(express.urlencoded({extended: false}))
//for showing one time message
app.use(flash())
//for cookies and stuff
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    secure: true,
    httpOnly: true,
    cookie: { maxAge: 60 * 60 * 1000}
}))

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something died bruh!')
})  
app.use(firebaseAuthMiddleware)

//All routes
app.use('/', routes)

app.listen(port)