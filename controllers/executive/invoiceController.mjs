import Store from '../../models/storeModel.mjs'
import Invoice from '../../models/invoiceModel.mjs'


export const getInvoices = async (req, res) => {
    try {
        const executiveId = req.params.id; // Get the executive ID from the request parameters
        if (!executiveId) return res.status(400).send({ success: false, message: 'Executive ID is required' });

        const { search, page = 1, limit } = req.query

        const stores = await Store.find({ executive: executiveId }).select('_id');
        const storeIds = stores.map(store => store._id);

        const query = { store: { $in: storeIds } }

        if (search && search !== 'null') {
            const regex = new RegExp(search, 'i')
            // Search by reference or store name
            const searchStores = await Store.find({ 
                executive: executiveId,
                storeName: regex 
            }).select('_id')
            const searchStoreIds = searchStores.map(store => store._id)
            
            query.$or = [
                { reference: regex },
                { store: { $in: searchStoreIds } }
            ]
        }

        const findQuery = Invoice.find(query)
            .sort({ createdAt: -1 })
            .populate('store')
            .populate('transactionId');

        if (limit && limit !== 'null') {
            const skip = (Number(page) - 1) * Number(limit)
            findQuery.skip(skip).limit(Number(limit))
        }

        const [invoices, total] = await Promise.all([
            findQuery,
            Invoice.countDocuments(query)
        ])

        res.status(200).json({ invoices, total });

    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}