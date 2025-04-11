import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    route: {
        type: String,
        required: true,
        unique: true
    }
})

const routeModel = mongoose.model('Route', routeSchema)
export default routeModel