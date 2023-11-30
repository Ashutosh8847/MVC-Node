const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const app =express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())
app.use(express.json())
const bodyparser = require('body-parser')
app.use(bodyparser.json())

// Routes here for routing the routes
const user_route= require('./routes/userRoutes')
app.use('/api/auth',user_route) 

const updateuser_route = require('./routes/updateuserRoutes')
app.use('/api/user',updateuser_route)

// MongoDB Connection
try {
    mongoose.connect(process.env.MONGO_DB_URL)
    console.log("****DB conected successfully***")
} catch (error) {
    console.log("**error***",error)  
}

// Server Listin in the port 
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port http://localhost:${process.env.PORT}`)
})



