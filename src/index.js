const express = require('express')
require('dotenv').config()
const SellerRoute = require('./routes/seller')
const BuyerRoute = require('./routes/buyer')
require('./db/connection')

const app = express()

app.use(express.json())
app.use(SellerRoute)
app.use(BuyerRoute)
const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})