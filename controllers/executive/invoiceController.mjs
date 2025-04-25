import Invoice from '../../models/invoiceModel.mjs'

export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ execut }).sort({ createdAt: -1 })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}