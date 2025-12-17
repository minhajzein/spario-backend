import Store from '../../models/storeModel.mjs'
import Transaction from '../../models/transactionModel.mjs'
import Invoice from '../../models/invoiceModel.mjs'
import Return from '../../models/returnModel.mjs'


export const getAllStores = async (req, res) => {
    try {
        const { search, page = 1, limit } = req.query

        const query = {}

        if (search && search !== 'null' && search !== '') {
            const regex = new RegExp(search, 'i')
            const searchConditions = [
                { storeName: regex },
                { ownerName: regex }
            ]
            
            // Only search by contactNumber if search is a number
            const contactNumber = Number(search)
            if (!isNaN(contactNumber)) {
                searchConditions.push({ contactNumber: contactNumber })
            }
            
            query.$or = searchConditions
        }

        const findQuery = Store.find(query)
            .sort({ createdAt: -1 })
            .populate({
            path: 'executive',
            select: 'username'
        })

        if (limit && limit !== 'null') {
            const skip = (Number(page) - 1) * Number(limit)
            findQuery.skip(skip).limit(Number(limit))
        }

        const [stores, total] = await Promise.all([
            findQuery,
            Store.countDocuments(query)
        ])

        res.status(200).json({ stores, total })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getStoresByExecutive = async (req, res) => {
    try {
        const { id } = req.params
        const { search, page = 1, limit } = req.query

        const query = {}

        if (id && id !== 'null') {
            query.executive = id
        }

        if (search && search !== 'null' && search !== '') {
            const regex = new RegExp(search, 'i')
            const searchConditions = [
                { storeName: regex },
                { ownerName: regex }
            ]
            
            // Only search by contactNumber if search is a number
            const contactNumber = Number(search)
            if (!isNaN(contactNumber)) {
                searchConditions.push({ contactNumber: contactNumber })
            }
            
            // If executive filter exists, combine with $and to ensure both conditions are met
            if (query.executive) {
                query.$and = [
                    { executive: query.executive },
                    { $or: searchConditions }
                ]
                delete query.executive
            } else {
                query.$or = searchConditions
            }
        }

        const findQuery = Store.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'executive',
                select: 'username'
            })

        if (limit && limit !== 'null') {
            const skip = (Number(page) - 1) * Number(limit)
            findQuery.skip(skip).limit(Number(limit))
        }

        const [stores, total] = await Promise.all([
            findQuery,
            Store.countDocuments(query)
        ])

        res.status(200).json({ stores, total })
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
        await Store.create({
            storeName: storeName,
            ownerName: ownerName,
            contactNumber: contactNumber,
            executive: executive,
            route: route,
            balance: openingBalance,
            paidAmount: 0,
            totalOutstanding: openingBalance,
            openingBalance: openingBalance
        })
        res.send({ success: true, message: 'Store Created Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const updateStore = async (req, res) => {
    try {
        const id = req.params.id

        const { storeName, ownerName, contactNumber, executive, route, openingBalance } = req.body

        const existingStores = await Store.findOne({ storeName: storeName, _id: { $ne: id } })
        if (existingStores) return res.send({ success: false, message: 'Store Already Exists' })

        const store = await Store.findById(id)

        const total = store.totalOutstanding - store.openingBalance


        store.storeName = storeName
        store.ownerName = ownerName
        store.contactNumber = contactNumber
        store.route = route
        store.executive = executive
        store.totalOutstanding = total + openingBalance
        store.balance = store.totalOutstanding - store.paidAmount
        store.openingBalance = openingBalance
        await store.save()

        res.send({ success: true, message: 'Store Updated Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteStore = async (req, res) => {
    try {
        const id = req.params.id

        await Transaction.deleteMany({ store: id })
        await Invoice.deleteMany({ store: id })
        await Return.deleteMany({ store: id })
        await Store.findByIdAndDelete(id)

        res.send({ success: true, message: 'Store Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}