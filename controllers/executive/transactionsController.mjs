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
        const { store, date, type, fromDate, toDate, page = 1, limit = 10 } = req.query;
        const { id } = req.params

        const query = {}
        query.executive = id
        query.entry = 'credit'
        if (store && store !== 'null') query.store = store
        if (type && type !== 'null') query.type = type

        if (date && date !== 'null') {
            const parsedDate = new Date(date);
            const nextDate = new Date(parsedDate);
            nextDate.setDate(nextDate.getDate() + 1);

            query.date = { $gte: parsedDate, $lt: nextDate };
        }

        if ((fromDate || toDate) && fromDate !== 'null' && toDate !== 'null') {
            query.date = {};
            if (fromDate && fromDate !== 'null') query.date.$gte = new Date(fromDate);
            if (toDate && toDate !== 'null') query.date.$lte = new Date(toDate);
        }


        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            Transaction.find(query)
                .populate('store executive')
                .sort({ date: -1 })
                .skip(Number(skip))
                .limit(Number(limit)),
            Transaction.countDocuments(query)
        ]);

        res.status(200).json({ total, transactions });

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

        relatedStore.balance -= Number(amount)
        relatedStore.paidAmount += Number(amount)
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