import Transaction from '../../models/transactionModel.mjs'
import Store from '../../models/storeModel.mjs'

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 }).populate({
            path: 'store',
            select: 'storeName'
        })
        res.status(200).json(transactions)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getTransactionsByStore = async (req, res) => {
    try {
        const transactions = await Transaction.find({ store: req.params.id }).sort({ createdAt: -1 })
        res.status(200).json(transactions)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getTransactionsByExecutive = async (req, res) => {
    try {
        const transactions = await Transaction.find({ executive: req.params.id }).sort({ createdAt: -1 }).populate({
            path: 'store',
            select: 'storeName'
        })
        res.status(200).json(transactions)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const createTransaction = async (req, res) => {
    try {
        const { entry, date, store, executive, amount } = req.body

        const foundStore = await Store.findById(store)
        if (!foundStore) {
            return res.status(404).send({ success: false, message: 'Store not found' })
        }
        foundStore.paidAmount += Number(amount)
        foundStore.balance -= Number(amount)
        await foundStore.save()

        await Transaction.create({
            entry: entry,
            date: date,
            store: store,
            executive: executive,
            amount: amount,
            description: 'Field Collection'
        })

        res.send({ success: true, message: 'Transaction Added Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}