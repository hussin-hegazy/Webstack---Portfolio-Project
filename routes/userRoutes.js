const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt');

const passport = require('passport')


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

// / Get all User:
router.get('/', verifyToken, verifyRole(UserRole.ADMIN), asyncWrapper(async(req, res, next) => {
    const query = req.query
    const limit = query.limit || 20
    const page =  query.page  || 1
    const skip = (page -1) * limit
    const user = await User.find({},{"__v": false, password: false}).limit(limit).skip(skip)
    res.status(200).json({status: "success", data: {user}})
}))



// Ragister User:
router.post('/register', singleUpload, asyncWrapper(async(req, res, next) =>{

    const {email, name, password, createdAt, role} = req.body
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
        avatar: req.file.filename
    })
    const token = await creatJWT({email:user.email, id: user._id, role: user.role})
    user.token = token
    await user.save()

    res.status(201).json({status: "success", data: {user}})

}))



// Log in:
router.post('/login' ,asyncWrapper (async(req, res, next) =>
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
    
    return res.status(200).json({status: "success", data: {token}})
    
  
}
))






router.get("/auth/google",passport.authenticate('google',  {scope: ['profile', 'email']}))

router.get("/auth/google/callback",passport.authenticate('google',  {session: false}), (req, res, next) => {
    const token = creatJWT({ email: req.user.email, id: req.user._id, role: req.user.role })
    res.status(200).json({ status: "success", data: { token } })

})





module.exports = router
