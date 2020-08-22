const mongoose = require('mongoose')

ProductSchema = mongoose.Schema({
    item_name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'seller'
    }
}, {
    timestamps: true
})

Product = mongoose.model('product', ProductSchema)

module.exports = Product