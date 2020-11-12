const mongoose = require("mongoose")
const crypto = require("crypto")
const uuid = require("uuidv1")

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 24
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: 32
    },
    hashed_password: {
      type: String,
      required: true
    },
    about: {
      type: String,
      trim: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
)

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password
    this.salt = uuid()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function (password) {
    return this.password
  })

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex")
    } catch (err) {
      return ""
    }
  }
}

module.exports = mongoose.model("User", userSchema)
