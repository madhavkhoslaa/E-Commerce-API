const express = require('express')
const SellerRoute = require('./routes/seller')
const BuyerRoute = require('./routes/seller')
require('./db/connection')

const app = express()

app.use(express.json())
app.use(SellerRoute)
app.use(BuyerRoute)
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})