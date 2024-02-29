const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

const PORT = 8080;
const MONGODB_URL = process.env.MONGODB_URL

const productRoutes = require('./routes')
const mongoose = require('mongoose')

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log('connected to mongodb'))
  .catch(() => console.log('error mongodb'))

app.use(express.json()) // 미들웨어 함수
app.get('/', (req,res,next) => next())

app.use('/api/products', productRoutes)



// app.listen(PORT,() => console.log(`App is running on http://localhost:${PORT}`))

module.exports = app;