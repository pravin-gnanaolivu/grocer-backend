const express = require("express")
const router = express.Router()

const { userId } = require("../controller/user")
const { requireSignin, isAuth } = require("../controller/auth")
const { generateToken, processPayment } = require("../controller/braintree")

router.get("/braintree/getToken/:userId", requireSignin, isAuth, generateToken)
router.post("/braintree/payment/:userId", requireSignin, isAuth, processPayment)

router.param("userId", userId)
module.exports = router
