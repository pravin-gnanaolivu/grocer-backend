const express = require("express")
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require("../controller/auth")
const { create, read, productId, remove, update, list, relatedList, listCategories, listBySearch, image, forSearch } = require("../controller/product")
const { userId } = require("../controller/user")

router.post("/create/product/:userId", requireSignin, isAuth, isAdmin, create)
router.delete("/delete/product/:userId/:productId", requireSignin, isAuth, isAdmin, remove)
router.put("/update/product/:userId/:productId", requireSignin, isAuth, isAdmin, update)
router.get("/product/:productId", read)
router.get("/product/related/:productId", relatedList)
router.get("/products/categories", listCategories)
router.post("/products/by/search", listBySearch)
router.get("/product/image/:productId", image)
router.get("/products", list)
router.get("/products/forSearch", forSearch)

router.param("userId", userId)
router.param("productId", productId)

module.exports = router
