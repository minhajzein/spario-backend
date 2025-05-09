import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Transaction'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    amount: {
        type: Number,
        required: true,
    },
    billDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    reference: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

const model = mongoose.model('Invoice', invoiceSchema)
export default model