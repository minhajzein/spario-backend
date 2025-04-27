import Return from '../../models/returnModel.mjs'
import Transaction from '../../models/transactionModel.mjs'

export const createReturn = async (req, res) => {
    try {
        const { store, amount, date, executive, type } = req.body
        const transaction = await Transaction.create({
            store: store,
            entry: 'credit',
            amount: amount,
            type: type,
            date: date,
            executive: executive
        })
        await Return.create({
            store: store,
            executive: executive,
            amount: amount,
            date: date,
            transaction: transaction._id,
            type: type
        })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}