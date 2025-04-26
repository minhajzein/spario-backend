import Transaction from '../../models/transactionModel.mjs'
import Store from '../../models/storeModel.mjs'
import mongoose from 'mongoose';



export const getDashboard = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $match: {
                    executive: new mongoose.Types.ObjectId(req.params.id),
                }
            },
            {
                $group: {
                    _id: "$entry",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const totalDebit = await Store.aggregate([{
            $match: {
                executive: new mongoose.Types.ObjectId(req.params.id),
            }
        }, {
            $group: { _id: null, totalAmount: { $sum: "$totalOutstanding" } }
        }])



        const totals = { credit: 0, debit: 0 };

        result.forEach(entry => {
            if (entry._id === 'credit') {
                totals.credit = entry.totalAmount;
            }
        });

        totals.debit = totalDebit[0]?.totalAmount || 0

        const totalStores = await Store.find({ executive: req.params.id }).countDocuments()
        res.json({ totalStores, totals })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Internal server error' })
    }
}