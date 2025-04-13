import Transaction from '../../models/transactionModel.mjs'
import Store from '../../models/storeModel.mjs'
import Executive from '../../models/userModel.mjs'


export const getDashboard = async (req, res) => {
    try {
        const result = await Transaction.aggregate([
            {
                $group: {
                    _id: "$entry",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        // Format the result into a more readable object
        const totals = {
            credit: 0,
            debit: 0,
        };

        result.forEach(entry => {
            if (entry._id === 'credit') {
                totals.credit = entry.totalAmount;
            } else if (entry._id === 'debit') {
                totals.debit = entry.totalAmount;
            }
        });

        console.log("Totals:", totals);
        const totalStores = await Store.find().countDocuments()
        const totalExecutives = await Executive.find().countDocuments()
        res.json({
            totals,
            totalStores,
            totalExecutives
        })

    } catch (error) {
        console.log(error)
        res.send({ success: false, message: 'Internal server error' })
    }
}