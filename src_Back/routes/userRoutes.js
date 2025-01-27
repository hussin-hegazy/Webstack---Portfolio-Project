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


const userController =  require('../controllers/userController')


// / Get all User:
router.get('/', verifyToken, userController.getAllUser )



// Ragister User:
router.post('/register', singleUpload, userController.gatristerUser)



// Log in:
router.post('/login', userController.login)






router.get("/auth/google",passport.authenticate('google',  {scope: ['profile', 'email']}))

router.get("/auth/google/callback",passport.authenticate('google',  {session: false}), (req, res, next) => {
    const token = creatJWT({ email: req.user.email, id: req.user._id, role: req.user.role })
    // res.status(200).json({ status: "success", data: { token } })
    res.redirect(`http://localhost:3000/login?token=${token}`)

})


router.post('/forgot-password', userController.forgotPassword)




// me:
router.get('/me', verifyToken, userController.me)






module.exports = router