import mongoose from 'mongoose'
import Transaction from '../../models/transactionModel.mjs'
import Executive from '../../models/userModel.mjs'
import Store from '../../models/storeModel.mjs'


export const getAllExecutives = async (req, res) => {
    try {
        const executives = await Executive.find({ role: 'executive' }).sort({ createdAt: -1 })
        res.status(200).json(executives)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getAllExecutivesByRoute = async (req, res) => {
    try {
        const executives = await Executive.find({ route: req.params.route }).sort({ createdAt: -1 })
        res.status(200).json(executives)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getExecutiveById = async (req, res) => {
    try {
        const executive = await Executive.findById(req.params.id)
        if (!executive) return res.send({ success: false, message: 'Executive Not Found' })
        const result = await Transaction.aggregate([
            {
                $match: {
                    executive: new mongoose.Types.ObjectId(executive._id), // or whatever your ID source
                    entry: 'credit',
                    description: 'Field Collection'
                }
            },
            {
                $group: {
                    _id: '$executive',
                    totalCollected: { $sum: '$amount' }
                }
            }
        ]);
        const total = result.length > 0 ? result[0].totalCollected : 0;
        const toCollect = await Store.aggregate([
            {
                $match: {
                    executive: new mongoose.Types.ObjectId(executive._id)
                }
            },
            {
                $group: {
                    _id: '$executive',
                    totalToCollect: { $sum: '$balance' }
                }
            }
        ]);
        const totalToCollect = toCollect.length > 0 ? toCollect[0].totalToCollect : 0;
        res.status(200).json({ executive, totalCollected: total, totalToCollect: totalToCollect })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const createExecutive = async (req, res) => {
    try {
        const { username, password, phone } = req.body
        const existingExecutives = await Executive.findOne({
            $or: [
                { username: username.toLowerCase() },
                { phone: phone }
            ]
        })
        if (existingExecutives)
            return res.send({ success: false, message: 'Username Or Phone Already Taken' })
        await Executive.create({
            username: username.toLowerCase(),
            password: password,
            phone: phone,
            role: 'executive'
        })
        res.send({ success: true, message: 'Executive Created Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const updateExecutive = async (req, res) => {
    try {
        const { username, password, phone } = req.body
        const existingExecutives = await Executive.findOne({
            $or: [
                { username: username.toLowerCase() },
                { phone: phone }
            ]
        })
        if (existingExecutives)
            return res.send({ success: false, message: 'Username Or Phone Already Taken' })
        await Executive.findByIdAndUpdate(req.params.id, {
            username: username.toLowerCase(),
            password: password,
            phone: phone,
        })
        res.send({ success: true, message: 'Executive Updated Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteExecutive = async (req, res) => {
    try {
        await Executive.findByIdAndDelete(req.params.id)
        res.send({ success: true, message: 'Executive Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}