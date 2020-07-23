const express = require('express')
const Seller = require('../models/seller')

const SellerRouter = express.Router()

SellerRouter.post('/register/seller', async(req, res) => {
    try {
        const seller = new Seller(req.body)
        const token = await seller.getAuthtoken()
        await seller.save()
        res.status(200).send({ message: "Created Seller ID", seller, token })
    } catch (e) {
        res.status(401).send(e)
    }
})



module.exports = SellerRouter