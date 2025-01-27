const express = require("express")

const router = express.Router()

const mongoose = require('mongoose')

const Task = require('../models/Task')

const verifyToken = require('../Medelwer/verifyToken');

const AppError = require('../utils/AppError')
const asyncWrapper = require('../Medelwer/asyncWrapper')

const User = require("../models/User");

const socketHandler = require('../utils/instantMessaging/socketHandler')

// Get all Tasks:
router.get('/', verifyToken, asyncWrapper (async(req, res, next) => {
    // Main_Query
    const query = req.query

    const limit = query.limit || 10
    const page =  query.page  || 1
    const skip = (page -1) * limit

    const filter ={user: req.user_data.id}

    if(query.completed){
        filter.completed = query.completed === 'true'
    }   

    if(query.priority){
        filter.priority = query.priority
    }



    const tasks = await Task.find( filter,{"__v": false}).limit(limit).skip(skip)

    if(tasks.length === 0){
        const error = AppError.create("No tasks found.", 404, "Fail")
        return next(error)
    }

    res.status(200).json({status: "success", data: {tasks}})
}))


// Get Stats:
router.get('/stats', verifyToken, asyncWrapper(async (req, res, next) => {
    const userId = req.user_data.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: "Fail", message: "Invalid user ID" })
    }


    const completedTasks = await Task.countDocuments({ user: userId, completed: true })
    const incompleteTasks = await Task.countDocuments({ user: userId, completed: false })

    const tasksByPriority = await Task.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            completedTasks,
            incompleteTasks,
            tasksByPriority
        }
    })
}))



// Calendar
router.get('/by-date', verifyToken, asyncWrapper(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const userId = req.user_data.id;
  
    if (!startDate || !endDate) {
      return next(AppError.create("Start date and end date are required.", 400, "Fail"));
    }
  
    const tasks = await Task.find({
      user: userId,
      dueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
  
    res.status(200).json({ status: "success", data: { tasks } });
  }));
 


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

    const { title, description, priority, dueDate } = Ntask

    if (!title || !description || !priority || !dueDate) {
        const error = AppError.create("All fields are required.", 400, "Fail");
        return next(error);
    }

    if(!["Low", "Medium", "High"].includes(priority)){
        return next(AppError.create("Prioty must be one of: Low, Medium, High", 400, "Fail"))
    }

    const newTask = new Task({...Ntask, user: req.user_data.id})
    await newTask.save()
    res.status(201).json({ status: "success", data: { task: newTask } })
}));
 


// Updata task:
// router.patch('/:taskId', verifyToken, asyncWrapper(async (req, res, next) => {
//     const taskId = req.params.taskId
//     const user_id = req.user_data.id

//     const task = await Task.findOne({_id: taskId, user: user_id})

//     if(!task){
//         const error = AppError.create("Not Found Task or Unauthorized", 404, "Fail")
//         return next(error)
//     } 

//     const {title, description, priority, dueDate} = req.body
    

//     if(title && typeof title !== 'string'){
//         return next(AppError.create('Title must be asring', 400, "Fail"))
//     }

//     if(description && typeof description !== 'string'){
//         return next(AppError.create('Description must be asring', 400, "Fail"))
//     }

     
//     if(!["Low", "Medium", "High"].includes(priority)){
//         return next(AppError.create("Prioty must be one of: Low, Medium, High", 400, "Fail"))
//     }

//     const updatedTask = await Task.findByIdAndUpdate(taskId, {$set: req.body}, {new: true})
    
//     res.status(200).json({status:"success",data: {task: updatedTask}})

  
// }))


 
router.patch('/:taskId', verifyToken, asyncWrapper(async (req, res, next) => {
    const taskId = req.params.taskId;
    const user_id = req.user_data.id;

    const task = await Task.findOne({ _id: taskId, user: user_id });

    if (!task) {
        const error = AppError.create("Not Found Task or Unauthorized", 404, "Fail");
        return next(error);
    }

    const { title, description, priority, dueDate, completed } = req.body;

    // إنشاء كائن للتحديث يحتوي فقط على الحقول المرسلة في الطلب
    const updateFields = {};

    if (title !== undefined) {
        if (typeof title !== 'string') {
            return next(AppError.create('Title must be a string', 400, "Fail"));
        }
        updateFields.title = title;
    }

    if (description !== undefined) {
        if (typeof description !== 'string') {
            return next(AppError.create('Description must be a string', 400, "Fail"));
        }
        updateFields.description = description;
    }

    if (priority !== undefined) {
        if (!["Low", "Medium", "High"].includes(priority)) {
            return next(AppError.create("Priority must be one of: Low, Medium, High", 400, "Fail"));
        }
        updateFields.priority = priority;
    }

    if (dueDate !== undefined) {
        updateFields.dueDate = dueDate;
    }

    if (completed !== undefined) {
        updateFields.completed = completed;
    }


    // تحديث المهمة باستخدام الحقول المحددة فقط
    const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updateFields }, { new: true });
    res.status(200).json({ status: "success", data: { task: updatedTask } });
}));



// Dleat Task:
router.delete('/:taskId', verifyToken, asyncWrapper(async (req, res, next) => {
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