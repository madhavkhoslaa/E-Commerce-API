const express = require('express')
const SellerRoute = require('./routes/seller')
require('./db/connection')
const app = express()

app.use(express.json())
app.use(SellerRoute)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})