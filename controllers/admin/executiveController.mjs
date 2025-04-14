import Transaction from '../../models/transactionModel.mjs'
import Executive from '../../models/userModel.mjs'

export const getAllExecutives = async (req, res) => {
    try {
        const executives = await Executive.find({ role: 'executive' }).sort({ createdAt: -1 })
        res.status(200).json(executives)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getAllExecutivesByRoute = async (req, res) => {
    try {
        const executives = await Executive.find({ route: req.params.route }).sort({ createdAt: -1 })
        res.status(200).json(executives)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const getExecutiveById = async (req, res) => {
    try {
        const executive = await Executive.findById(req.params.id)
        if (!executive) return res.send({ success: false, message: 'Executive Not Found' })
        res.status(200).json(executive)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const createExecutive = async (req, res) => {
    try {
        const { username, password, phone, route } = req.body
        const existingExecutives = await Executive.findOne({
            $or: [
                { username: username.toLowerCase() },
                { phone: phone }
            ]
        })
        if (existingExecutives)
            return res.send({ success: false, message: 'Username Or Phone Already Taken' })
        await Executive.create({
            username: username.toLowerCase(),
            password: password,
            phone: phone,
            route: route,
            role: 'executive'
        })
        res.send({ success: true, message: 'Executive Created Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const updateExecutive = async (req, res) => {
    try {
        const { username, password, phone, route } = req.body
        const existingExecutives = await Executive.findOne({
            $or: [
                { username: username.toLowerCase() },
                { phone: phone }
            ]
        })
        if (existingExecutives)
            return res.send({ success: false, message: 'Username Or Phone Already Taken' })
        await Executive.findByIdAndUpdate(req.params.id, {
            username: username.toLowerCase(),
            password: password,
            phone: phone,
            route: route,
        })
        res.send({ success: true, message: 'Executive Updated Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const deleteExecutive = async (req, res) => {
    try {
        await Executive.findByIdAndDelete(req.params.id)
        res.send({ success: true, message: 'Executive Deleted Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}