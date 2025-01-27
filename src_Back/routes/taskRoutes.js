const express = require("express")

const router = express.Router()

const mongoose = require('mongoose')

const Task = require('../models/Task')

const verifyToken = require('../Medelwer/verifyToken');

const AppError = require('../utils/AppError')
const asyncWrapper = require('../Medelwer/asyncWrapper')

const User = require("../models/User");

const socketHandler = require('../utils/instantMessaging/socketHandler')


const taskController = require('../controllers/taskController')

// GetallTasks:
router.get('/', verifyToken, taskController.getAllTasks

)


// getStats:
router.get('/stats', verifyToken, taskController.getStats
)



// Calendar
router.get('/by-date', verifyToken, taskController.getCalendar

)
 

// Get Singel Task:
router.get('/:taskId', verifyToken, taskController.getSingelTask

)


// creat OR Add Task:
router.post('/', verifyToken, taskController.addTask );
 

 
router.patch('/:taskId', verifyToken, taskController.updateTask);



// Dleat Task:
router.delete('/:taskId', verifyToken, taskController.dleatTask )



module.exports = router