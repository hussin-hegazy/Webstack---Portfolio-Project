const mongoose = require('mongoose');

const express = require("express");

const cors = require('cors')

const passport = require('passport')

const path = require('path')

const http = require('http')

const { socketHandler } = require('./utils/instantMessaging')


require('dotenv').config()



const task_Routes = require('./routes/taskRoutes')

const user_Routes = require('./routes/userRoutes');
const { Socket } = require('dgram');

require('./config/passport')


const app = express()

const server = http.createServer(app)
socketHandler.init(server)
require('./utils/taskReminder')


app.use(cors())

mongoose.connect(process.env.M_DB)
.then (() =>{
    console.log("Hi Data Base Taker")
})
.catch((error) => {console.log({status: "Error", Message: error.message})})



app.use(express.json())


app.use('/api/tasks', task_Routes)

app.use('/api/users', user_Routes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use(passport.initialize())

// Hindeler Globel Error
app.use((err, req, res, next) => {
    res.status(err.statusCode || 404)
       .json({
         status: err.statusText || "Error", 
         message: err.message || "This is not found"
       });
  });
  





server.listen(process.env.PORT || 4000, () => {
    console.log("Hi Server Tasker")
})


