const User = require("../models/user")
const braintree = require("braintree")
require("dotenv").config()

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "qkk742699jgrz248",
  publicKey: "6wg34fbc5kxkfks7",
  privateKey: "fba5b872344bb6b09ef4b1ead90196d3"
})

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(response)
    }
  })
}

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce
  let amountFromTheClient = req.body.amount
  // charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error)
      } else {
        res.json(result)
      }
    }
  )
}
