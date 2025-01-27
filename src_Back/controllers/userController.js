const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt');

const passport = require('passport')

const validator =require('validator')

const creatJWT = require('../utils/creatJWT')

const mongoose = require('mongoose');

const User = require('../models/User')
 
const AppError = require('../utils/AppError')
const asyncWrapper = require('../Medelwer/asyncWrapper');

const { accept } = require("expres/utils");

const verifyToken = require('../Medelwer/verifyToken')

const verifyRole = require('../Medelwer/verifyRole')
const UserRole = require('../utils/UserRole')

const { singleUpload } = require('../Medelwer/multerMiddleware')

const sendEmail = require('../utils/emailService')




const getAllUser = asyncWrapper(async(req, res, next) => {
    const query = req.query
    const limit = query.limit || 20
    const page =  query.page  || 1
    const skip = (page -1) * limit
    const user = await User.find({},{"__v": false, password: false}).limit(limit).skip(skip)
    res.status(200).json({status: "success", data: {user}})
})


const gatristerUser = asyncWrapper(async(req, res, next) =>{

    const {email, name, password, createdAt, role} = req.body

    if(!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1
    })){
        return next(AppError.create("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.", 400, "Fail"))
    }

    const Email = await User.findOne({email: email})
    if(Email){
        const error =AppError.create("Email already exists. Please use a different email.", 400, "Fail")
        return next(error)
    }


    
    const passwordHash = await bcrypt.hash(password, 10)
        
    const user = new User({ 
        email, 
        name, 
        password: passwordHash, 
        createdAt,
        role,
        avatar: req.file ? req.file.filename : 'uploads/profile.png'
    })  
    const token = await creatJWT({email:user.email, id: user._id, role: user.role})
    user.token = token
    await user.save()

    return res.status(200).json({status: "success", data: {token, user:{_id: user._id, name: user.name, role: user.role}}})

})


const login = asyncWrapper (async(req, res, next) =>
    {
        const {email,password} = req.body
    
            // التحقق من وجود البريد الإلكتروني وكلمة المرور
    
        if(!email && !password){
           const error = AppError.create("Email and password are required", 400,"Fail")
           return next(error)
        }
    
            // البحث عن المستخدم في قاعدة البيانات
        const user = await User.findOne({email})
        
            // التحقق من وجود المستخدم
        if (! user){
            const error = AppError.create("Invalid email or User not Found", 400,"Fail")
            return next(error)
        }
    
        const mPassword = await bcrypt.compare(password, user.password)
    
        if (!mPassword){
            const error = AppError.create("Invalid password", 401, "Fail");
            return next(error)
        }
    
        const token = await creatJWT({email:user.email, id: user._id, role: user.role})
        
        return res.status(200).json({status: "success", data: {token, user:{_id: user._id, name: user.name, role: user.role}}})
        
    
      
    }
    )




    const  forgotPassword = asyncWrapper (async(req, res, next) => {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return next(AppError.create('user not found', 404, 'Fail'))
        }
    
        const resetToken = await creatJWT({email: user.email, id: user._id})
    
            const resetLink = `http://yourfrontendurl.com/reset-password?token=${resetToken}`
            await sendEmail(user.email, "Reset Password", `Click the following link to reset your password: ${resetLink}`)
    
        res.status(200).json({status: "success", message: "Reset Paword emailent"})
    
    })

    const me = asyncWrapper(async(req, res, next) => {

        email = req.user_data.email
    
        const user = await User.findOne({email})
        
        if (! user){
            const error = AppError.create("Invalid email or User not Found", 400,"Fail")
            return next(error)
        }
    
        return res.status(200).json({status: "success", data: {user}})
        
    
    })


    module.exports = {
        getAllUser,
        gatristerUser,
        login,
        forgotPassword,
        me
    };

