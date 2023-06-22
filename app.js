require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const User = require("./models/db")
const passport = require("passport")
const argon2 = require("argon2")

const app = express()

app.use(express.urlencoded({ extended: true }))

/******************** Session setup **********************/

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_CONNECT }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
)

/******************** Local password strategy setup *************************/
require("./config/authenticate")
app.use(passport.initialize())
app.use(passport.session())

/******************** Get routes *************************/

app.get("/", (req, res) => {
  // console.log(req.session)
  res.send("This is the home screne.")
})

app.get("/success", (req, res) => {
  // console.log(req.session)
  if (req.isAuthenticated()) {
    res.send("Awesome!!, Logged in Successfully.")
  } else {
    res.send("Please log in first")
  }
})

app.get("/failure", (req, res) => {
  // console.log(req.session)
  res.send("Logging in is Unsuccessfull.")
})

/******************** Post routes ************************/

app.post(
  "/register",
  async (req, res, next) => {
    const newUser = new User({
      username: req.body.username,
      hash: await argon2.hash(req.body.password, { hashLength: 40 }),
    })

    await newUser.save()
    next()
  },
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
)

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
)

app.post("/logout", function (req, res) {
  req.logout(err => {
    if (err) {
      res.send("You are unable to logout")
    }
    req.session.destroy()
    res.send("You are logged out !!")
  })
})

/******************** Listen *************************/

app.listen(3000, () => {
  console.log("server running on port 3000")
})
