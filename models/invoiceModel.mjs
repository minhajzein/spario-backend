import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
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
        type: Number,
        required: true
    }
}, { timestamps: true })

const model = mongoose.model('Invoice', invoiceSchema)
export default model