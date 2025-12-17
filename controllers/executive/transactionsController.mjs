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
        const { date, fromDate, toDate, page = 1, limit } = req.query;
        const { id } = req.params;

        const query = { store: id };

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

        const findQuery = Transaction.find(query)
            .populate('store executive')
            .sort({ date: -1 });

        // Only apply skip/limit if `limit` is present and not 'null'
        if (limit && limit !== 'null' && limit !== 'export') {
            const skip = (Number(page) - 1) * Number(limit);
            findQuery.skip(skip).limit(Number(limit));
        }

        const [transactions, total] = await Promise.all([
            findQuery,
            Transaction.countDocuments(query),
        ]);

        res.status(200).json({ transactions, total });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};


export const getTransactionsByExecutive = async (req, res) => {
    try {
        const { store, date, type, fromDate, toDate, search, page, limit } = req.query;
        const { id } = req.params

        const query = {}
        if (id && id !== 'null') query.executive = id;

        query.entry = 'credit'
        if (store && store !== 'null') query.store = store
        if (type && type !== 'null') query.type = type
        
        if (search && search !== 'null') {
            const regex = new RegExp(search, 'i')
            // Search by type or store name
            const stores = await Store.find({ 
                executive: id,
                storeName: regex 
            }).select('_id')
            const storeIds = stores.map(store => store._id)
            
            query.$or = [
                { type: regex },
                { store: { $in: storeIds } }
            ]
        }

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
        let skip = 0;

        if (limit && limit !== 'export' && limit !== 'null') {
            skip = (page - 1) * limit;
        }

        const [transactions, total] = await Promise.all([
            Transaction.find(query)
                .populate('store executive')
                .sort({ date: -1 })
                .skip(Number(skip))
                .limit(Number(limit !== 'export' && limit !== 'null' ? limit : null)),
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