import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000    // IF Port no is available in env then it will use it else it will use 4000
connectDB()
connectCloudinary()

// middle wares
app.use(express.json())
app.use(cors())  // to use the backend from any IP

// api endpoints

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/',(req,res) => {
  res.send("API Working")
})

app.listen(port,() => console.log('Server started on PORT: ' + port))




