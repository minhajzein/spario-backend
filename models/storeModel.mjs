import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        unique: true
    },
    ownerName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    totalOutstanding: {
        type: Number,
        required: true
    },
    openingBalance: {
        type: Number,
        required: true
    },
    route: {
        type: String,
        required: true
    }
}, { timestamps: true })

const storeModel = mongoose.model('Store', storeSchema)

export default storeModel