const mongoose = require('mongoose')

TransactionSchema = mongoose.Schema({
    seller_id: {
        type: String,
        required: true,
        trim: true
    },
    buyer_id: {
        type: String,
        required: true,
        trim: true
    },
    product_id: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

Transaction = mongoose.model('transaction', TransactionSchema)

module.exports = Transaction