const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SellerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('not a valid email')
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

/*
TODO: Complete connection of seller with prodict
SellerSchema.virtual('product', {
    ref: 
})*/

SellerSchema.methods.toJSON = function() {
    const seller = this
    const sellerobj_ = seller.toObject()
    delete sellerobj_.password
    delete sellerobj_.tokens
    return sellerobj_
}

SellerSchema.methods.getAuthtoken = async function() {
    const seller = this
    const token = jwt.sign({ _id: seller._id.toString() }, "seller_password")
    seller.tokens = seller.tokens.concat({ token })
    try {
        await seller.save()
    } catch (e) {
        console.log(e)
    }
    return token
}

SellerSchema.pre('save', async function(next) {
    const seller = this
    if (seller.isModified('password')) seller.password = bcrypt.hashSync(seller.password, 8)
    next()
})

/*
SellerSchema.post('save', function(next) {
    const seller = this
    seller.populate('product').execPopulate()
    seller.tasks.remove()
    next()
})*/

Seller = mongoose.model('seller', SellerSchema)

module.exports = Seller