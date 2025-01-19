var validator = require('validator');

const mongoose = require('mongoose');

const UserRole = require('../utils/UserRole')


const user_schema= new mongoose.Schema({
    email: {type: String,required: true, unique: true, validate: [validator.isEmail, "Faild be most a valid Email"], index: true},
    name:  {type: String, required: true},
    googleId: {type: String, unique: true, sparse: true},
    password: {type: String, required: function() {return !this.googleId} },
    createdAt: {type: Date,  default: Date.now},
    token: {type: String},
    role: {type: String, enum: [UserRole.USER,UserRole.ADMIN,UserRole.MANAGER], default: 'USER'},
    avatar: {type: String, default: 'uploads/profile.png'}

})



module.exports = mongoose.model("User", user_schema)
