const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SellerSchema = new mongoose.Schema({
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
},
 {
    timestamps: true
})

SellerSchema.virtual('product', {
    ref: 'product',
    localField: '_id',
    foreignField: 'owner'
})

SellerSchema.statics.findByCredentials = async function(email, password) {
    const seller = await Seller.findOne({ email })
    if (!seller) throw new Error('unable to log in')
    const isMatch = await bcrypt.compare(password, seller.password)
    if (!isMatch) throw new Error('unable to log in')
    return seller
}
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
        throw new Error('unable to generate auth token')
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
    seller.product.remove()
    next()
})*/

Seller = mongoose.model('seller', SellerSchema)

module.exports = Seller