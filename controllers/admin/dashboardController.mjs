import Transaction from '../../models/transactionModel.mjs'
import Store from '../../models/storeModel.mjs'
import Executive from '../../models/userModel.mjs'


export const getDashboard = async (req, res) => {
    try {
        const totolOutstanding = await Transaction.find({ entry: 'debit' }).aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ])

        const totalPaid = await Transaction.find({ entry: 'credit' }).aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const totalStores = await Store.find().countDocuments()
        const totalExecutives = await Executive.find().countDocuments()
        res.send({
            success: true,
            data: {
                totalOutstanding: totolOutstanding[0] ? totolOutstanding[0].total : 0,
                totalPaid: totalPaid[0] ? totalPaid[0].total : 0,
                totalStores: totalStores,
                totalExecutives: totalExecutives
            }
        })

    } catch (error) {
        console.log(error)
        res.send({ success: false, message: 'Internal server error' })
    }
}