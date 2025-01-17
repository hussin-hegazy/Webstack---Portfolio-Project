const jwt = require('jsonwebtoken')

const AppError = require('../utils/AppError')
const asyncWrapper = require('../Medelwer/asyncWrapper')

const  verifyToken = asyncWrapper (async(req, res, next) => {
        const Auth_token = req.headers['Authorization']|| req.headers['authorization']
        if(! Auth_token){
           const error = AppError.create("'Access denied. No token provided.'", 401, 'Fail')
           return next(error)
        }
        const token = Auth_token.split(" ")[1]
        
        const decoded = jwt.verify(token, process.env.Secret_K_JWT)
        req.user_data = decoded
        console.log(decoded)
         next()

}
)

module.exports = verifyToken