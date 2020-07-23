const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')


const SellerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator(value) {
            if (!validator.isEmail(value)) throw new Error('not a valid email')
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: mongoose.Schema.Types.ObjectId,
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
    const selerobj_ = seller.toObject()
    delete selerobj_.password
    delete selerobj_.tokens
    return selerobj_
}

SellerSchema.methods.getAuthtoken = async function() {
    const seller = this
    const token = jwt.sign({ _id: seller._id.toString() }, "password")
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