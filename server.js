import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { isAdminAuth } from './src/middlewares/auth.middleware.js'
import productRouter from './src/routers/productRouter.js'
const PORT = process.env.PORT || 8000
//middleware
app.use(helmet())
app.use(cors())
app.use(morgan('tiny'))

app.use(express.urlencoded())
app.use(express.json())
//establish mongodb connection
import mongoClient from './src/config/db.js'
mongoClient()
//load routers
import userRouter from './src/routers/userRouter.js'
import categoryRouter from './src/routers/categoryRouter.js'
import tokenRouter from './src/routers/tokenRouter.js'
//user routers
app.use('/api/v1/user', userRouter)
app.use('/api/v1/category', isAdminAuth, categoryRouter)
app.use('/api/v1/token', tokenRouter)
app.use('/api/v1/product', productRouter)

//category router
app.use('/', (req, res) => {
  res.send('You have reached the end of the router list')
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log(`Server is running at http://localhost:${PORT}`)
})
