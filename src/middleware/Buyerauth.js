const express = require('express')
const jwt = require('jsonwebtoken')
const Buyer = require('../models/buyer')

const BuyerAuth = async(req, res, next) => {
    try {
        const Authtoken = req.header("Authorization").replace("Bearer", "").trim()
        const decoded = jwt.verify(Authtoken, "buyer_password")
        const buyer = await Buyer.findOne({ _id: decoded._id, 'tokens.token': Authtoken })
        req.buyer = buyer
        req.token = Authtoken
        next()
    } catch (error) {
        res.status(401).send({ error: "unable to authorise" })
    }
}

module.exports = BuyerAuth