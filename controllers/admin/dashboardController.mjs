export const getDashboard = async (req, res) => {
    try {
        const currentFinancialYear = new Date().getFullYear()
        console.log(currentFinancialYear)
        res.json(currentFinancialYear)
    } catch (error) {
        console.log(error)
        res.send({ success: false, message: 'Internal server error' })
    }
}