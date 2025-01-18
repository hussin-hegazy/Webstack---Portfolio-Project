const express = require("express")
const router = express.Router()

const mongoose = require('mongoose');

const Task = require('../models/Task')
 
const AppError = require('../utils/AppError')
const asyncWrapper = require('../Medelwer/asyncWrapper')


const verifyToken = require('../Medelwer/verifyToken');
const User = require("../models/User");


// Get all Tasks:
router.get('/', verifyToken, asyncWrapper (async(req, res, next) => {
    const query = req.query
    const limit = query.limit || 10
    const page =  query.page  || 1
    const skip = (page -1) * limit
    const tasks = await Task.find({user:req.user_data.id},{"__v": false}).limit(limit).skip(skip)

    if(tasks.length === 0){
        const error = AppError.create("No tasks found.", 404, "Fail")
        return next(error)
    }

    res.status(200).json({status: "success", data: {tasks}})
}))





// Get Singel Task:
router.get('/:taskId', verifyToken, asyncWrapper( async (req, res, next) => {
    const taskId =req.params.taskId
    const user_id = req.user_data.id
    // if (!mongoose.Types.ObjectId.isValid(taskId)) {
    //     const error = AppError.create("Invalid task ID.", 400, "Fail");
    //     return next(error);
    // }


    const task = await Task.findOne({_id: taskId, user: user_id})
    if(!task){
        const error = AppError.create("Not Found Task or Unauthorized", 404, "Fail")
        return next(error)
    } 
  
        
    res.status(200).json({status: "success", data: {task}})
}))




// creat OR Add Task:
router.post('/', verifyToken, asyncWrapper(async (req, res, next) => {

    const Ntask = req.body;

        // التحقق من صحة البيانات المدخلة
    // const { title, description, priority, dueDate } = Ntask;
    // if (!title || !description || !priority || !dueDate) {
    //     const error = AppError.create("All fields are required.", 400, "Fail");
    //     return next(error);
    // }

    const task = new Task({...Ntask, user: req.user_data.id});
    await task.save();
    res.status(201).json({ status: "success", data: { task } });
}));
 


// Updata task:
router.patch('/:taskId', verifyToken, asyncWrapper(async (req, res, next) => {
    const taskId = req.params.taskId
    const user_id = req.user_data.id
    const task = await Task.findOne({_id: taskId, user: user_id})
    if(!task){
        const error = AppError.create("Not Found Task or Unauthorized", 404, "Fail")
        return next(error)
    } 
    const {title, description, priority, dueDate} = req.body
    if(!title|| !description || !priority || !dueDate){
        const error = AppError.create("All fields are required. ", 400, "Fail")
        return next(error)
    } 


    const updatedTask = await Task.findByIdAndUpdate(taskId, {$set: req.body}, {new: true})
    
    res.status(200).json({status:"success",data: {task: updatedTask}})

  
}))


// Dleat Task:
router.delete('/:taskId', asyncWrapper(async (req, res, next) => {
    const taskId = req.params.taskId
    const user_id = req.user_data.id
    const task = await Task.findOne({_id: taskId, user: user_id})
    if(!task){
        const error = AppError.create("Not Found Task or Unauthorized", 404, "Fail")
        return next(error)
    } 

    await Task.deleteOne({_id: taskId})
    res.status(200).json({status: "success", data: null  })
}))











module.exports = router
