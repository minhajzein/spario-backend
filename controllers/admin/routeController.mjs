import Route from '../../models/routeModel.mjs'

export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find()
        res.status(200).json(routes)
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}

export const createRoute = async (req, res) => {
    try {
        const { route } = req.body
        const existingRoute = await Route.findOne({ route: route })
        if (existingRoute) return res.send({ success: false, message: 'Route Already Exists' })
        await Route.create({ route: route })
        res.send({ success: true, message: 'Route Added Successfully' })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal Server Error' })
    }
}
