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

        const storeData = await Store.findById(store);
        if (!storeData) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }
        await Transaction.create({
            store: storeData._id,
            amount: amount,
            date: billDate,
            executive: storeData.executive,
            entry: "debit"
        });
        await Invoice.create({
            store,
            amount,
            billDate,
            dueDate,
            reference
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
        await Invoice.findByIdAndUpdate(id, {
            store: store,
            amount: amount,
            billDate: billDate,
            dueDate: dueDate,
            reference: reference
        }, { new: true })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}