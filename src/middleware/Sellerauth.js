const express = require('express')
const jwt = require('jsonwebtoken')
const Seller = require('../models/seller')

const BuyerAuth = async(req, res, next) => {
    try {
        const Authtoken = req.headers("Authorization").replace("bearer", '').trim()
        const decoded = jwt.verify(Authtoken, "seller_password")
        const seller = Seller.findOne({ _id: decoded._id, 'tokens.token': Authtoken })
        req.seller = seller[0]
        req.token = Authtoken
        next()
    } catch (error) {
        res.status(401).send({ error: "unable to authorise" })
    }
}

module.exports = BuyerAuth