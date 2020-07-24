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
        res.status(500).send(e)
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
        const token = seller.getAuthtoken()
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
        //#TODO only saves the product details right now and not the seller
        //Add owner in product schema
        const product = new Product(req.body)
        product.save()
        res.status(200).send({ message: "product added" }, product)
    } catch (e) {
        res.status(500).send({ message: "could not add product" })
    }
})

SellerRouter.post('/seller/product/edit/:id', Auth, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.send({ message: "not found" })
        res.send({ product })
    } catch (e) {
        res.send({ message: "not found" })
    }
})

SellerRouter.post('/seller/product/delete/:id', Auth, async(req, res) => {
    try {
        const product = Product.deleteOne({ _id: req.params.id })
        if (!product)
    }
})

SellerRouter.get('/seller/products', Auth, async(req, res) => {
    //need to add product virtial on seller for this method to be done
})
module.exports = SellerRouter