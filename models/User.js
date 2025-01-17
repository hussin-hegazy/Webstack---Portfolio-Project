var validator = require('validator');

const mongoose = require('mongoose');

const UserRole = require('../utils/UserRole')


const user_schema= new mongoose.Schema({
    email: {type: String,required: true, unique: true, validate: [validator.isEmail, "Faild be most a valid Email"]},
    name:  {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date,  default: Date.now},
    token: {type: String},
    role: {type: String, enum: [UserRole.USER,UserRole.ADMIN,UserRole.MANAGER], default: 'USER'},
    avatar: {type: String, default: 'uploads/profile.png'}

})


// user_schema.pre("save", async function (next)  {
//     if(this.isModified('password')){
//         this.password = await bcrypt.hash(this.password, 10)
//     }
//     next()
// })

module.exports = mongoose.model("User", user_schema)
