import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import { configDotenv } from 'dotenv'
import connectDB from './connections/database/connectDB.mjs'
import cookieParser from 'cookie-parser'
import corsOptions from './config/cors/corsOptions.mjs'
import adminMainRoutes from './routes/admin/mainRoutes.mjs'
import authRoutes from './routes/auth/authRoutes.mjs'
import executiveRoutes from './routes/executive/executiveRoutes.mjs'

// configurations...................................................................................................

const app = express()
configDotenv()
connectDB(process.env.DATABASE_URI)


// Middlewares...................................................................................................

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cookieParser())


// Routes...................................................................................................

app.use('/admin', adminMainRoutes)
app.use('/auth', authRoutes)
app.use('/executive', executiveRoutes)

mongoose.connection.once('open', () => {
    app.listen(process.env.PORT, () => console.log(`🌎 - Listening On http://localhost:${process.env.PORT} -🌎`)
    )
})

export default app





