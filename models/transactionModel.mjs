import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    entry: {
        type: String,
        required: true,
        enum: ['debit', 'credit']
    },
    type: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const model = mongoose.model('Transaction', transactionSchema)
export default model
