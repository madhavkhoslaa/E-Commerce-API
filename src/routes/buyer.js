const express = require('express')
const Product = require('../models/product')
const Buyer = require('../models/buyer')
const Auth = require('../middleware/Buyerauth')
const Transaction = require('../models/transaction')
const BuyerRouter = express.Router()

BuyerRouter.post('/buyer/register', async (req, res) => {
    try {
        const buyer = new Buyer(req.body)
        const token = await buyer.getAuthToken()
        await buyer.save()
        res.status(201).send({
            message: "created Buyer id",
            buyer,
            token
        })
    } catch (e) {
        res.status(500).send({
            message: "internal server error"
        })
    }
})

BuyerRouter.get('/buyer/me', Auth, async (req, res) => {
    try {
        const buyer = req.buyer
        if (!buyer) return res.status(200).send({
            message: "buyer not found"
        })
        res.send({
            buyer
        })
    } catch (e) {
        res.status(500).send({
            message: "internal server error"
        })
    }
})

BuyerRouter.patch('/buyer/me', Auth, async (req, res) => {
    const to_update = Object.keys(req.body)
    const valid_keys = ['name', 'email', 'password', 'address']
    const is_valid = to_update.every((update) => valid_keys.includes(update))
    if (!is_valid) return res.status(400).send({
        message: "could not edit buyer details"
    })
    try {
        const buyer = req.buyer
        to_update.forEach(update => buyer[update] = req.body[update])
        await buyer.save()
        if (!buyer) return res.send({
            message: "could not update"
        })
        res.status(201).send({
            buyer
        })
    } catch (e) {
        res.status(500).send({
            message: "internal server error"
        })
    }
})

BuyerRouter.delete('/buyer/me', Auth, async (req, res) => {
    try {
        const buyer = await Buyer.deleteOne({
            _id: req.buyer._id
        })
        if (!buyer) return res.send({
            message: "unable to delete"
        })
        res.status(200).send({
            message: "buyer deleted",
            buyer
        })
    } catch (e) {
        res.status(500).send({
            message: "internal server error"
        })
    }
})

BuyerRouter.post('/buyer/logout', Auth, async (req, res) => {
    try {
        req.buyer.tokens = req.buyer.tokens.filter((token) => token.token != req.token)
        await req.buyer.save()
        res.status(200).send({
            message: "buyer logged out"
        })
    } catch (e) {
        res.status(500).send({
            message: "internal server error"
        })
    }
})

BuyerRouter.post('/buyer/login', async (req, res) => {
    try {
        const buyer = await Buyer.FindByCredentials(req.body.email, req.body.password)
        if (!buyer) return res.status(400).send({
            message: "unable to login"
        })
        const token = await buyer.getAuthToken()
        res.status(200).send({
            buyer,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({
            message: "internal server error"
        })
    }
})

BuyerRouter.post('/buyer/buy/:id', Auth, async (req, res) => {
    const isTransacted = await Transaction.findOne({
        product_id: req.params.id
    })
    if (isTransacted) return res.status(400).send({
        message: `cannot buy this product of id: ${req.params.id}`
    })
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send({
        message: `product with id:${req.params.id} not found`
    })
    const transaction = new Transaction({
        seller_id: product.owner.toString(),
        buyer_id: req.buyer._id,
        product_id: product._id
    })
    await transaction.save()
    await product.remove()
    res.status(200).send(transaction)

})
module.exports = BuyerRouter