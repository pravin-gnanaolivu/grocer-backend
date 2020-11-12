const express = require("express")
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require("../controller/auth")
const { create, categoryId, read, remove, update, list } = require("../controller/category")
const { userId } = require("../controller/user")

router.post("/create/category/:userId", requireSignin, isAuth, isAdmin, create)
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, update)
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove)
router.get("/category/:categoryId", read)

router.get("/categories", list)

router.param("userId", userId)
router.param("categoryId", categoryId)

module.exports = router
