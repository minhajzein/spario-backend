import Invoice from '../../models/invoiceModel.mjs'
import Store from '../../models/storeModel.mjs'
import Transaction from '../../models/transactionModel.mjs'

export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('store', 'storeName').sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createInvoice = async (req, res) => {
    try {
        const { store, amount, billDate, dueDate, reference } = req.body;
        const exists = await Invoice.findOne({ reference: reference })
        if (exists) {
            return res.status(400).json({ success: false, message: "Invoice with this reference already exists" });
        }
        if (!store || !amount || !billDate || !dueDate || !reference) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const storeData = await Store.findById(store);
        if (!storeData) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        const transaction = await Transaction.create({
            store: storeData._id,
            amount: amount,
            date: billDate,
            executive: storeData.executive,
            entry: "debit",
            type: reference,
        });

        storeData.balance += Number(amount);
        storeData.totalOutstanding += Number(amount);
        await storeData.save();

        await Invoice.create({
            transactionId: transaction._id,
            store: store,
            amount: amount,
            billDate: billDate,
            dueDate: dueDate,
            reference: reference,
        });
        res.status(201).json({ success: true, message: "Invoice created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { store, amount, billDate, dueDate, reference } = req.body;

        const invoice = await Invoice.findById(id)

        const exists = await Invoice.findOne({ reference: { $ne: invoice.reference } })
        if (exists)
            return res.status(400).json({ success: false, message: "Invoice with this reference already exists" });

        const storeData = await Store.findById(store);
        if (!storeData)
            return res.status(404).json({ success: false, message: "Store not found" });

        if (!store || !amount || !billDate || !dueDate || !reference)
            return res.status(400).json({ success: false, message: "All fields are required" });



        storeData.balance -= Number(invoice.amount);
        storeData.totalOutstanding -= Number(invoice.amount);


        invoice.store = store
        invoice.billDate = billDate
        invoice.dueDate = dueDate
        invoice.reference = reference
        invoice.amount = amount
        await invoice.save()

        const transaction = await Transaction.findById(invoice.transactionId)

        transaction.amount = amount
        transaction.date = billDate
        await transaction.save()

        storeData.balance += Number(amount)
        storeData.totalOutstanding += Number(amount)
        await storeData.save();

        res.send({ success: true, message: 'Invoice Updated Successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteInvoice = async (req, res) => {
    try {
        const id = req.params.id

        const invoice = await Invoice.findById(id)

        const store = await Store.findById(invoice.store)
        store.balance -= Number(invoice.amount);
        store.totalOutstanding -= Number(invoice.amount);
        await store.save()

        await Transaction.findByIdAndDelete(invoice.transactionId)

        await invoice.deleteOne()

        res.send({ success: true, message: 'Invoice Deleted Successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}