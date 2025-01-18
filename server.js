const mongoose = require('mongoose');

const express = require("express");

const path = require('path')

require('dotenv').config()

const task_Routes = require('./routes/taskRoutes')

const user_Routes = require('./routes/userRoutes')


const app = express()


mongoose.connect(process.env.M_DB)
.then (() =>{
    console.log("Hi Data Base Taker")
})
.catch((error) => {console.log({status: "Error", Message: error.message})})



app.use(express.json())


app.use('/api/tasks', task_Routes)

app.use('/api/users', user_Routes)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// Hindeler Globel Error
app.use((err, req, res, next) => {
    res.status(err.statusCode || 404)
       .json({
         status: err.statusText || "Error", 
         message: err.message || "This is not found"
       });
  });
  

app.listen(process.env.PORT || 4000, () => {
    console.log("Hi Server Tasker")
})




