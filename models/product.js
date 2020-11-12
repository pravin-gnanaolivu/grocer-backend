const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 32
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1500
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxLength: 10
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true
    },
    quantity: {
      type: Number
    },
    countryOfOrigin: {
      type: String,
      trim: true,
      maxLength: 30,
      required: true
    },
    nutrientValues: {
      type: String,
      trim: true,
      maxLength: 5000,
      required: true
    },
    unit: {
      type: String,
      trim: true,
      maxLength: 100,
      required: true
    },
    sold: {
      type: Number,
      default: 0
    },
    image: {
      data: Buffer,
      contentType: String
    },
    shipping: {
      type: Boolean,
      required: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
