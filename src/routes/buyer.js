const express = require('express')
const Buyer = require('../models/buyer')
const Auth = require('../middleware/Buyerauth')

const BuyerRouter = express.Router()

BuyerRouter.post('/buyer/register', async(req, res) => {
    try {
        const buyer = new Buyer(req.body)
        const token = await buyer.getAuthToken()
        await buyer.save()
        res.status(200).send({ message: "Created Buyer ID", buyer, token })
    } catch (e) {
        res.status(401).send(e)
    }
})

BuyerRouter.get('/buyer/me', Auth, async(req, res) => {
    try {
        const buyer = req.buyer
        if (!buyer) return res.status(200).send({ message: "buyer not found" })
        res.send({ buyer })
    } catch (e) {
        res.send(e)
    }
})

BuyerRouter.patch('/buyer/me', Auth, async(req, res) => {
    const to_update = Object.keys(req.body)
    const valid_keys = ['name', 'email', 'password', 'address']
    const is_valid = to_update.every((update) => valid_keys.includes(update))
    if (!is_valid) return res.status(400).send({ message: "could not edit buyer details" })
    try {
        const buyer = req.buyer
        to_update.forEach(update => buyer[update] = req.body[update])
        await buyer.save()
        if (!buyer) return res.send({ message: "could not update" })
        res.status(200).send({ buyer })
    } catch (e) {
        res.status(500).send(e)
    }
})

BuyerRouter.delete('/buyer/me', Auth, async(req, res) => {
    try {
        const buyer = await Buyer.deleteOne({ _id: req.buyer._id })
        if (!buyer) return res.send({ message: "unable to delete" })
        res.status(200).send({ message: "buyer deleted", buyer })
    } catch (e) {
        res.status(500).send({ message: "unable to delete" })
    }
})

BuyerRouter.post('/buyer/logout', Auth, async(req, res) => {
    try {
        req.buyer.tokens = req.buyer.tokens.filter((token) => token.token != req.token)
        await req.buyer.save()
        res.status(200).send({ message: "buyer logged out" })
    } catch (e) {
        res.status(500).send("internal server error")
    }
})

BuyerRouter.post('/buyer/login', async(req, res) => {
    try {
        const buyer = await Buyer.findByCredentials(req.body.email, req.body.password)
        const token = buyer.getAuthtoken()
        res.status(200).send({ buyer, token })
    } catch (e) {
        res.status(500).send({ message: "unable to login buyer" })
    }
})

BuyerRouter.post('/buyer/buy/:id', Auth, async(req, res) => {
    //Complete this endpoint after DB relations
})
module.exports = BuyerRouter