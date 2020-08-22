const mongoose = require('mongoose')

TransactionSchema = mongoose.Schema({
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

Transaction = mongoose.model('transaction', TransactionSchema)

module.exports = Transaction