const User = require("../models/user")
const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.signUp = (req, res) => {
  const user = new User(req.body)

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    res.json({
      user
    })
  })
}

exports.signIn = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user doesn't exist. please signUp"
      })
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password doesn't match"
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.cookie("t", token, { expire: new Date() + 9999 })
    const { _id, name, email, role } = user
    return res.json({ token, user: { _id, name, email, role } })
  })
}

exports.signOut = (req, res) => {
  res.clearCookie("t")
  res.json({ message: "successfully signed out" })
}

exports.requireSignin = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth"
})

exports.isAuth = (req, res, next) => {
  let user = req.auth && req.profile && req.profile._id == req.auth._id
  if (!user) {
    res.status(403).json({
      error: "Access Denied"
    })
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (!req.profile.role === 0) {
    res.status(403).json({
      error: "Admin resource unauthorised access"
    })
  }
  next()
}
