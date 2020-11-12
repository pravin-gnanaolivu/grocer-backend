const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const braintreeRoutes = require("./routes/braintree")
const orderRoutes = require("./routes/orders")

//app
const app = express()

//DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Mongo Connected")
  })

mongoose.connection.on("error", err => {
  console.log(`problem while connecting database ${err}`)
})

//middleware
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

//routes
app.use("/", authRoutes)
app.use("/", userRoutes)
app.use("/", categoryRoutes)
app.use("/", productRoutes)
app.use("/", braintreeRoutes)
app.use("/", orderRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`server running in port ${port}`)
})
