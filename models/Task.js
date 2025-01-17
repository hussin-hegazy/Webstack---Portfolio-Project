const mongoose = require('mongoose');

const task_schema = new mongoose.Schema({
    title:{type: String, required: true},
    description:{type: String, required: true},
    priority:{type: String, required: true},
    // adate anather tiem
    user:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}, 
    createdAt:{type: Date,  default: Date.now},
    dueDate:{type: Date, required: true}
})

module.exports = mongoose.model("Task", task_schema )