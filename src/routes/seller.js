const express = require('express')
const Seller = require('../models/seller')
const Auth = require('../middleware/Sellerauth')
const Product = require('../models/product')
const SellerRouter = express.Router()

SellerRouter.post('/seller/register', async(req, res) => {
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
        if (!seller) return res.status(400).send("not found")
        res.send(seller)
    } catch (e) {
        res.status(500).send()
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
        if (!seller) return res.send({ message: "could not update" })
        res.status(200).send(seller)
    } catch (e) {
        res.status(500).send()
    }
})

SellerRouter.delete('/seller/me', Auth, async(req, res) => {
    try {
        const seller = await Seller.deleteOne({ _id: req.seller._id })
        if (!seller) return res.send({ message: "unable to delete" })
        res.status(200).send({ message: "seller deleted", seller })
    } catch (e) {
        res.status(500).send({ message: "unable to delete" })
    }
})

SellerRouter.post('/seller/login', async(req, res) => {
    try {
        const seller = await Seller.findByCredentials(req.body.email, req.body.password)
        const token = await seller.getAuthtoken()
        res.status(200).send({ seller, token })
    } catch (e) {
        res.status(500).send({ message: "unable to login seller" })
    }
})

SellerRouter.post('/seller/logout', Auth, async(req, res) => {
    try {
        req.seller.tokens = req.seller.tokens.filter((token) => token.token != req.token)
        await req.seller.save()
        res.status(200).send({ message: "seller logged out" })
    } catch (e) {
        res.status(500).send("internal server error")
    }
})

SellerRouter.post('/seller/product/add', Auth, async(req, res) => {
    try {
        const product = new Product({...req.body,
            owner: req.seller._id
        })
        await product.save()
        res.status(200).send({ message: "product added", product })
    } catch (e) {
        res.status(500).send({ message: "could not add product" })
    }
})

SellerRouter.patch('/seller/product/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['item_name', 'description', 'category', 'price']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const product = await Product.findOne({ _id: req.params.id, owner: req.seller._id })
        updates.forEach(update => product[update] = req.body[update])
        await product.save()
        if (!product) return res.status(404).send({ error: "not found" })
        res.status(200).send({ product })
    } catch (e) {
        res.send({ message: "not found" })
    }
})

SellerRouter.delete('/seller/product/:id', Auth, async(req, res) => {
    try {
        const product = await Product.deleteOne({ owner: req.seller._id, _id: req.params.id })
        console.log(product)
        if (!product) return res.status(404).send({ message: "unable to delete" })
        return res.status(200).send({ message: "product deleted", product })
        console.log(product)
    } catch (e) {
        res.status(500)
    }
})

SellerRouter.get('/seller/products', Auth, async(req, res) => {
    try {
        const products = await Product.find({ owner: req.seller._id })
        res.status(200).send({ products })
    } catch (err) {
        res.status(500).send({ message: "error" })
    }
})
module.exports = SellerRouter