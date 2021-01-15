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

app.get('*', async (req, res) => {
    res.status(400).send({ message: "method not allowed", 
                        refer: 'https://github.com/madhavkhoslaa/E-Commerce-API/blob/master/README.md'})
})

app.post('*', async (req, res) => {
    res.status(400).send({ message: "method not allowed", 
                        refer: 'https://github.com/madhavkhoslaa/E-Commerce-API/blob/master/README.md'})
})

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})