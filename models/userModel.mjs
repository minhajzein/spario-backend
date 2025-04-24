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
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active'
    },
}, { timestamps: true })

userSchema.index(
    { username: 1 },
    {
        unique: true,
        collation: { locale: 'en', strength: 2 }
    }
);

const userModel = mongoose.model('User', userSchema)

export default userModel