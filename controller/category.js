const Category = require("../models/category")
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.categoryId = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: "Category doesn't exists"
      })
    }
    req.category = category
    next()
  })
}

exports.create = (req, res) => {
  const category = new Category(req.body)
  category.save((err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: errorHandler(err)
      })
    }

    res.json({ category })
  })
}

exports.read = (req, res) => {
  res.json(req.category)
}

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json(data)
  })
}

exports.remove = (req, res) => {
  let category = req.category
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json({
      message: "category deleted successfully",
      data
    })
  })
}

exports.update = (req, res) => {
  let category = req.category
  category.name = req.body.name
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Error in update category"
      })
    }
    res.json(category)
  })
}
