import Transaction from '../../models/transactionModel.mjs'
import Store from '../../models/storeModel.mjs'



export const getDashboard = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $match: {
                    executive: req.params.id,
                },
                $group: {
                    _id: "$entry",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totals = { credit: 0, debit: 0 };
        result.forEach(entry => {
            if (entry._id === 'credit') {
                totals.credit = entry.totalAmount;
            } else if (entry._id === 'debit') {
                totals.debit = entry.totalAmount;
            }
        });

        const totalStores = await Store.find({ executive: req.params.id }).countDocuments()
        res.json({ totalStores, totals })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Internal server error' })
    }
}