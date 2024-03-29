const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const Product = require("../models/product")
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.productId = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Product not found",
      })
    }
    req.product = product
    next()
  })
}

exports.read = (req, res) => {
  req.product.image = undefined
  return res.json(req.product)
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image cannot be uploaded",
      })
    }

    const {
      title,
      description,
      price,
      category,
      quantity,
      countryOfOrigin,
      nutrientValues,
      shipping,
      unit,
    } = fields

    console.log({
      title,
      description,
      price,
      category,
      quantity,
      countryOfOrigin,
      nutrientValues,
      shipping,
      unit,
    })

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !countryOfOrigin ||
      !nutrientValues ||
      shipping == undefined ||
      !unit
    ) {
      return res.status(400).json({
        error: "All fields are required",
      })
    }

    let product = new Product(fields)

    console.log({ files })
    if (files.image) {
      if (files.image.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1Mb",
        })
      }

      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }

    product.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(data)
    })
  })
}

exports.remove = (req, res) => {
  let product = req.product
  product.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    res.json({
      message: `product with ID ${data._id} is successfully deleted`,
    })
  })
}

exports.update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image cannot be uploaded",
      })
    }

    const {
      title,
      description,
      price,
      category,
      quantity,
      countryOfOrigin,
      nutrientValues,
      shipping,
      unit,
    } = fields

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !countryOfOrigin ||
      !nutrientValues ||
      !shipping ||
      !unit
    ) {
      return res.status(400).json({
        error: "All fields are required",
      })
    }

    let product = req.product
    product = _.extend(product, fields)
    if (files.image) {
      if (files.image.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1Mb",
        })
      }

      product.image.data = fs.readFileSync(files.image.path)
      product.image.contentType = files.image.type
    }

    product.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        })
      }
      res.json(data)
    })
  })
}

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc"
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
  let limit = req.query.limit ? parseInt(req.query.limit) : 10

  Product.find()
    .select("-image")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        console.log(err)
        return res.status(400).json({
          error: "Products not found",
        })
      }
      res.json(products)
    })
}

exports.forSearch = (req, res) => {
  Product.find(
    {},
    {
      sold: false,
      image: false,
      category: false,
      quantity: false,
      countryOfOrigin: false,
      nutrientValues: false,
      shipping: false,
      createdAt: false,
      updatedAt: false,
    }
  ).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      })
    }
    res.json(data)
  })
}

exports.relatedList = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "product not found",
        })
      }

      res.json(products)
    })
}

exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      res.status(400).json({
        error: "Categories not found",
      })
    }

    res.json(categories)
  })
}

exports.listBySearch = (req, res) => {
  console.log("RE: ", req.body)
  let order = req.body.order ? req.body.order : "asc"
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
  let limit = req.body.limit ? parseInt(req.body.limit) : 100
  let skip = parseInt(req.body.skip)
  let findArgs = {}

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        }
      } else {
        findArgs[key] = req.body.filters[key]
      }
    }
  }

  Product.find(findArgs)
    .select("-image")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        })
      }
      res.json(data)
    })
}

exports.image = (req, res, next) => {
  if (req.product.image.data) {
    res.set("Content-Type", req.product.image.contentType)
    return res.send(req.product.image.data)
  }
  next()
}

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }
  })

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update product",
      })
    }
    next()
  })
}
