import Transaction from '../../models/transactionModel.mjs'
import Store from '../../models/storeModel.mjs'

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ entry: 'credit' }).sort({ createdAt: -1 }).populate({
            path: 'store',
            select: 'storeName'
        }).populate({ path: 'executive', select: 'username' })
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
        const transactions = await Transaction.find({ $and: [{ executive: req.params.id }, { entry: 'credit' }] }).sort({ createdAt: -1 }).populate({
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
        const { entry, date, store, executive, amount, type } = req.body

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
            type: type
        })

        res.send({ success: true, message: 'Transaction Added Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


export const updateTransaction = async (req, res) => {
    try {
        const id = req.params.id
        const { date, store, amount, type } = req.body

        const transaction = await Transaction.findById(id)

        const relatedStore = await Store.findById(store)
        relatedStore.balance += transaction.amount
        relatedStore.paidAmount -= transaction.amount

        transaction.store = store
        transaction.date = date
        transaction.type = type
        transaction.amount = amount
        await transaction.save()

        relatedStore.balance -= amount
        relatedStore.paidAmount += amount
        await relatedStore.save()
        res.send({ success: true, message: 'Transaction Updated Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


export const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id
        const transaction = await Transaction.findById(id)

        const store = await Store.findById(transaction.store)
        store.paidAmount -= transaction.amount
        store.balance += transaction.amount
        await store.save()

        await transaction.deleteOne()

        res.send({ success: true, message: 'Transaction Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}