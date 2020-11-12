const express = require("express")
const router = express.Router()
const { userSignUpValidators } = require("../validators/index")

const { signUp, signIn, signOut } = require("../controller/auth")

router.post("/signUp", userSignUpValidators, signUp)
router.post("/signIn", signIn)
router.post("/signOut", signOut)

module.exports = router
