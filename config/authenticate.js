const argon2 = require("argon2")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/db")

async function hashPassword(password) {
  const hash = await argon2.hash(password)
  return hash
}

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username })
      .then(user => {
        if (!user) {
          return done(null, false)
        }
        if (!argon2.verify(user.hash, password)) {
          return done(null, false)
        }
        return done(null, user)
      })
      .catch(err => done(err))
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(err => {
      done(err)
    })
})
