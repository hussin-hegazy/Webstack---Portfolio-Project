const express = require("express")
const router = express.Router()

const mongoose = require('mongoose');

const Task = require('../models/Task')
 
const AppError = require('../utils/AppError')
const asyncWrapper = require('../Medelwer/asyncWrapper')



// Get all Tasks:
router.get('/' ,asyncWrapper (async(req, res, next) => {
    const query = req.query
    const limit = query.limit || 10
    const page =  query.page  || 1
    const skip = (page -1) * limit
    const tasks = await Task.find({},{"__v": false}).limit(limit).skip(skip)
    res.status(200).json({status: "success", data: {tasks}})
}))





// Get Singel Task:
router.get('/:taskId' ,asyncWrapper( async (req, res, next) => {
    const taskId =req.params.taskId
    const task = await Task.findById(taskId)
    if(!task){
        const error = AppError.create("Not Found Task", 404, "Fail")
        return next(error)
    }

    //   const error = AppError.creat("Not Found Task", 404, "Fail" )
    //     return next(error)
    // 
        
    res.status(200).json({status: "success", data: {task}})
}))




// creat OR Add Task:
router.post('/', asyncWrapper(async (req, res, next) => {
    const Ntask = req.body;
    const task = new Task(Ntask);
    await task.save();
    res.status(201).json({ status: "success", data: { task } });
}));
 


// Updata task:
router.patch('/:taskId', asyncWrapper(async (req, res, next) => {
    const taskId = req.params.taskId
    const task = await Task.findByIdAndUpdate(taskId, {$set: req.body}, {new: true})
    if(!task){
        const error = AppError.create("Not Found Task", 404, "Fail")
        return next(error)
    }
    res.status(200).json({status:"success",data: {task}})

  
}))


// Dleat Task:
router.delete('/:taskId', asyncWrapper(async (req, res, next) => {
    const taskId = req.params.taskId
    const task = await Task.deleteOne({_id: taskId})
    res.status(200).json({status: "success", data: null  })
}))











module.exports = router

