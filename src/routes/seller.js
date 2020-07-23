const express = require('express')
const Seller = require('../models/seller')
const Auth = require('../middleware/Sellerauth')

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

SellerRouter.get('/seller/me', Auth, async(req, res) => {
    try {
        const seller = req.seller
        res.send(seller)
    } catch (e) {
        res.status(500)
    }
})

SellerRouter.patch('/seller/me', Auth, async(req, res) => {
    const to_update = Object.keys(req.body)
    const valid_keys = ['name', 'email', 'password']
    const is_valid = to_update.every((update) => valid_keys.includes(update))
    if (!is_valid) res.status(400).send({ message: "cannot update" })
    try {
        const seller = req.seller
        to_update.forEach(update => seller[update] = req.body[update])
        await seller.save()
        if (!seller) return res.send("s")
        res.status(200).send(seller)
    } catch (e) {
        res.status(500)
    }
})

SellerRouter.delete('/seller/me', Auth, async(req, res) => {
    const seller = req.seller
    seller.remove()
})

SellerRouter.post('/seller/login', async(req, res) => {
    res.send("too")
})

SellerRouter.post('/seller/logout', async(req, res) => {
    res.send("too")
})

module.exports = SellerRouter