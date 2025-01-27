const mongoose = require('mongoose')

const validator = require('validator')

const task_schema = new mongoose.Schema({
    title:{type: String, required: true},
    description:{type: String, required: true},
    priority:{type: String, enum:["Low", "Medium", "High"], default:"Medium", required: true},
    user:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
    createdAt:{type: Date,  default: Date.now, required: true},
    dueDate:{type: Date, required: true, 
            validate: {validator: function (value) {
                return value > (this.createdAt || new Date())},
                message: "Due date must be after the creation date."
            } },

    completed: {type: Boolean, default: false},
    reminderSent: {type: Boolean, default: false}

})

module.exports = mongoose.model("Task", task_schema )