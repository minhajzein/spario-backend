import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'executive']
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    route: {
        type: String,
        required: true
    }
}, { timestamps: true })


const userModel = mongoose.model('User', userSchema)

export default userModel