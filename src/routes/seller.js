const express = require('express')
const Seller = require('../models/seller')
const Auth = require('../middleware/Sellerauth')
const Product = require('../models/product')
const SellerRouter = express.Router()

SellerRouter.post('/seller/register', async (req, res) => {
    try {
        const seller = new Seller(req.body)
        const token = await seller.getAuthtoken()
        await seller.save()
        res.status(201).send({ message: "created seller id", seller, token })
    } catch (e) {
        res.status(500).send({ message: "Incorrect email ID or ID with emails exists" })
    }
})

SellerRouter.get('/seller/me', Auth, async (req, res) => {
    try {
        const seller = req.seller
        if (!seller) return res.status(404).send({ message: "not found" })
        res.status(200).send(seller)
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.patch('/seller/me', Auth, async (req, res) => {
    const to_update = Object.keys(req.body)
    const valid_keys = ['name', 'email', 'password']
    const is_valid = to_update.every((update) => valid_keys.includes(update))
    if (!is_valid) res.status(400).send({ message: "cannot update bad request" })
    try {
        const seller = req.seller
        to_update.forEach(update => seller[update] = req.body[update])
        await seller.save()
        if (!seller) return res.send({ message: "could not update" })
        res.status(200).send(seller)
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.delete('/seller/me', Auth, async (req, res) => {
    try {
        const seller = await Seller.deleteOne({ _id: req.seller._id })
        const products = await Product.deleteMany({ owner: req.seller._id })
        if (!seller) return res.send({ message: "unable to delete" })
        res.status(200).send({ message: "seller deleted", seller })
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
        console.log(e)
    }
})

SellerRouter.post('/seller/login', async (req, res) => {
    try {
        const seller = await Seller.findByCredentials(req.body.email, req.body.password)
        const token = await seller.getAuthtoken()
        res.status(200).send({ seller, token })
    } catch (e) {
        res.status(500).send({ message: e })
        console.log(e)
    }
})

SellerRouter.post('/seller/logout', Auth, async (req, res) => {
    try {
        req.seller.tokens = req.seller.tokens.filter((token) => token.token != req.token)
        await req.seller.save()
        res.status(200).send({ message: "seller logged out" })
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.post('/seller/product/add', Auth, async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            owner: req.seller._id
        })
        product.clicks = 0
        await product.save()
        res.status(201).send({ message: "product added", product })
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.patch('/seller/product/:id', Auth, async (req, res) => {
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
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.delete('/seller/product/:id', Auth, async (req, res) => {
    try {
        const product = await Product.deleteOne({ _id: req.params.id, owner: req.seller._id })
        if (!product) return res.status(404).send({ message: "not found" })
        res.status(200).send({ message: "product deleted", product })
        console.log(product)
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.get('/seller/products/:skip/:limit', Auth, async (req, res) => {
    try {
        const { skip, limit } = req.params
        const products = await Product.find({ owner: req.seller._id })
            .sort({ item_name: 'desc' })
            .skip(skip)
            .limit(limit)
        res.status(200).send({ products })
    } catch (err) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.post('/seller/products/search', Auth, async (req, res) => {
    try {
        const { searchText, skip, limit } = req.body.text
        var reg = new RegExp(searchText, "g");
        const products = await Product.find({
            owner: req.seller._id, $or: [
                { 'item_name': reg },
                { 'description': reg },
                { 'category': reg }
            ]
        })
            .sort({ item_name: 'desc' })
            .skip(skip)
            .limit(limit)
        res.status(200).send({ products })
    } catch (err) {
        res.status(500).send({ message: "internal server error" })
    }
})

SellerRouter.get('/seller/product/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        product.clicks += 1
        await product.save()
        if (!product) return res.status(400).send({ message: "bad request" })
        res.status(200).send({ product })
    } catch (err) {
        res.status(500).send({ message: "internal server error" })
    }
})
module.exports = SellerRouter