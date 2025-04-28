import Return from '../../models/returnModel.mjs'
import Transaction from '../../models/transactionModel.mjs'

export const createReturn = async (req, res) => {
    try {
        const { store, amount, date, executive, type } = req.body
        const transaction = await Transaction.create({
            store: store,
            entry: 'credit',
            amount: amount,
            type: `return: ${type}`,
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
        res.send({ success: true, message: 'Return Created Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


export const getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find().sort({ createdAt: -1 })
        res.status(200).json(returns)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


export const getReturnsByExecutive = async (req, res) => {
    try {
        const returns = await Return.find({ executive: req.params.id }).sort({ createdAt: -1 })
        res.status(200).json(returns)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}


