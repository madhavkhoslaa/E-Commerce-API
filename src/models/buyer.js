const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

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

BuyerSchema.pre('save', async function(next) {
    const user = this.user
    if (user.isModified('password')) user.password = bcrypt.hashSync(user.password, 8)
    next()
})
Buyer = mongoose.model('buyer', BuyerSchema)

module.exports = Buyer