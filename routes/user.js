const express = require("express")
const router = express.Router()

const { userId, read, update, purchaseHistory } = require("../controller/user")
const { requireSignin, isAuth, isAdmin } = require("../controller/auth")

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  })
})

router.get("/user/:userId", requireSignin, isAuth, read)
router.put("/user/:userId", requireSignin, isAuth, update)
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory)

router.param("userId", userId)

module.exports = router
