const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


BuyerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    tokens: [{
        tokens: {
            type: String,
            required: true
        }
    }]
})

BuyerSchema.pre('save', async function(next) {
    const buyer = this
    if (buyer.isModified('password')) user.password = bcrypt.hashSync(buyer.password, 8)
    next()
})

BuyerSchema.methods.toJSON = function() {
    const buyer = this
    const buyer = buyer.toObject()
    delete buyer.password
    delete buyer.tokens
    return buyer
}
BuyerSchema.methods.getAuthTokens = async function() {
    const buyer = this
    const token = jwt.sign({ _id: buyer._id.toString() }, 'password')
    buyer.token = buyer.token.concat({ token })
    try {
        await buyer.save()
    } catch (e) {
        throw new Error('Cannot Create Token')
    }
}
BuyerSchema.statics.FindByCredentials = async function(email, password) {
    buyer = await Buyer.findOne({ email, passpwrd })
    if (!buyer) throw new Error('unable to login')
    isMatch = await bcrypt.compare(buyer.password, password)
    if (!isMatch) throw new Error('unable to login')
    return buyer
}
Buyer = mongoose.model('buyer', BuyerSchema)

module.exports = Buyer