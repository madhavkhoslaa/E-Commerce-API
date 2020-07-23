const express = require('express')
const jwt = require('jsonwebtoken')
const Buyer = require('../models/buyer')

const BuyerAuth = async(req, res, next) => {
    try {
        const Authtoken = req.headers("Authorization").replace("bearer", '').trim()
        const decoded = jwt.verify(Authtoken, "buyer_password")
        const buyer = Buyer.findOne({ _id: decoded._id, 'tokens.token': Authtoken })
        req.buyer = buyer[0]
        req.token = Authtoken
        next()
    } catch (error) {
        res.status(401).send({ error: "unable to authorise" })
    }
}

module.exports = BuyerAuth