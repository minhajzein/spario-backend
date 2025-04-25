import Store from '../../models/storeModel.mjs'
import Invoice from '../../models/invoiceModel.mjs'


export const getInvoices = async (req, res) => {
    try {
        const executiveId = req.params.id; // Get the executive ID from the request parameters
        if (!executiveId) return res.status(400).send({ success: false, message: 'Executive ID is required' });

        const stores = await Store.find({ executive: executiveId }).select('_id');
        const storeIds = stores.map(store => store._id);

        // Step 2: Get all invoices for those stores
        const invoices = await Invoice.find({ store: { $in: storeIds } }).sort({ createdAt: -1 })
            .populate('store')
            .populate('transactionId');
        
        res.status(200).json(invoices);

    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}