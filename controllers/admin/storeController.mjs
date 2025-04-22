import dayjs from 'dayjs'
import Store from '../../models/storeModel.mjs'
import Transaction from '../../models/transactionModel.mjs'

export const getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 }).populate({
            path: 'executive',
            select: 'username'
        })
        res.status(200).json(stores)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getStoresByExecutive = async (req, res) => {
    try {
        const stores = await Store.find({ executive: req.params.id }).sort({ createdAt: -1 }).populate({
            path: 'executive',
            select: 'username'
        })
        res.status(200).json(stores)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const createStore = async (req, res) => {
    try {
        const { storeName, ownerName, contactNumber, executive, openingBalance, route } = req.body
        const existingStores = await Store.find({ storeName: storeName })
        if (existingStores[0] !== undefined)
            return res.send({ success: false, message: 'Store Already Exists' })
        const storeData = await Store.create({
            storeName: storeName,
            ownerName: ownerName,
            contactNumber: contactNumber,
            executive: executive,
            route: route,
            balance: openingBalance,
            paidAmount: 0,
            totalOutstanding: openingBalance
        })
        res.send({ success: true, message: 'Store Created Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const updateStore = async (req, res) => {
    try {
        const { storeName, ownerName, contactNumber, executive, route } = req.body
        const existingStores = await Store.find({ storeName: storeName })
        if (existingStores[0] !== undefined)
            return res.send({ success: false, message: 'Store Already Exists' })
        await Store.findByIdAndUpdate(req.params.id, {
            storeName: storeName,
            ownerName: ownerName,
            contactNumber: contactNumber,
            route: route,
            executive: executive,
        })
        res.send({ success: true, message: 'Store Updated Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteStore = async (req, res) => {
    try {
        await Store.findByIdAndDelete(req.params.id)
        res.send({ success: true, message: 'Store Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}