const mongoose = require('mongoose')
const validator = require('validator')


BuyerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Not an Email')
        }
    },
    password: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true,
        trim: true
    }
})

Buyer = mongoose.model('buyer', BuyerSchema)

module.exports = Buyer