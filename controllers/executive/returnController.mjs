import Return from '../../models/returnModel.mjs'
import Store from '../../models/storeModel.mjs'
import Transaction from '../../models/transactionModel.mjs'
import Executive from '../../models/userModel.mjs'

export const createReturn = async (req, res) => {
    try {
        const { store, amount, date, executive, type } = req.body

        const foundStore = await Store.findById(store)
        if (!foundStore) {
            return res.status(404).send({ success: false, message: 'Store not found' })
        }

        foundStore.paidAmount += Number(amount)
        foundStore.balance -= Number(amount)
        await foundStore.save()

        const transaction = await Transaction.create({
            store: store,
            entry: 'credit',
            amount: amount,
            type: `return: ${type}`,
            date: date,
            executive: executive
        })
        await Return.create({
            store: store,
            executive: executive,
            amount: amount,
            date: date,
            transaction: transaction._id,
            type: type
        })
        res.send({ success: true, message: 'Return Created Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


export const getAllReturns = async (req, res) => {
    try {
        const { search, page = 1, limit } = req.query

        const query = {}

        if (search && search !== 'null') {
            const regex = new RegExp(search, 'i')
            // Search by type, store name, or executive name
            const stores = await Store.find({ storeName: regex }).select('_id')
            const storeIds = stores.map(store => store._id)
            const executives = await Executive.find({ username: regex }).select('_id')
            const executiveIds = executives.map(exec => exec._id)
            
            query.$or = [
                { type: regex },
                { store: { $in: storeIds } },
                { executive: { $in: executiveIds } }
            ]
        }

        const findQuery = Return.find(query)
            .sort({ createdAt: -1 })
            .populate('store')
            .populate('executive')

        if (limit && limit !== 'null') {
            const skip = (Number(page) - 1) * Number(limit)
            findQuery.skip(skip).limit(Number(limit))
        }

        const [returns, total] = await Promise.all([
            findQuery,
            Return.countDocuments(query)
        ])

        res.status(200).json({ returns, total })

    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


export const getReturnsByExecutive = async (req, res) => {
    try {
        const { search, page = 1, limit } = req.query

        const query = { executive: req.params.id }

        if (search && search !== 'null') {
            const regex = new RegExp(search, 'i')
            // Search by type or store name
            const stores = await Store.find({ 
                executive: req.params.id,
                storeName: regex 
            }).select('_id')
            const storeIds = stores.map(store => store._id)
            
            query.$or = [
                { type: regex },
                { store: { $in: storeIds } }
            ]
        }

        const findQuery = Return.find(query)
            .sort({ createdAt: -1 })
            .populate('store')

        if (limit && limit !== 'null') {
            const skip = (Number(page) - 1) * Number(limit)
            findQuery.skip(skip).limit(Number(limit))
        }

        const [returns, total] = await Promise.all([
            findQuery,
            Return.countDocuments(query)
        ])

        res.status(200).json({ returns, total })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteReturn = async (req, res) => {
    try {
        const rtn = await Return.findById(req.params.id)

        const store = await Store.findById(rtn.store)
        store.paidAmount -= rtn.amount
        store.balance += rtn.amount
        await store.save()

        await Transaction.findByIdAndDelete(rtn.transaction)

        await rtn.deleteOne()

        res.send({ success: true, message: 'Return Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const updateReturn = async (req, res) => {
    try {
        const id = req.params.id
        const { date, store, amount, type } = req.body

        const rtn = await Return.findById(id)

        const relatedStore = await Store.findById(store)
        relatedStore.balance += rtn.amount
        relatedStore.paidAmount -= rtn.amount

        const transaction = await Transaction.findById(rtn.transaction)

        transaction.amount = amount
        transaction.store = store
        transaction.date = date
        transaction.type = `return: ${type}`
        await transaction.save()

        rtn.store = store
        rtn.date = date
        rtn.type = type
        rtn.amount = amount
        await rtn.save()

        relatedStore.balance -= Number(amount)
        relatedStore.paidAmount += Number(amount)
        await relatedStore.save()

        res.send({ success: true, message: 'Return Updated Successfully' })

    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}




