const AppError = require('../utils/AppError')


module.exports = (...roles) => {
    return (req, res, next) => {

       if(!roles.includes(req.user_data.role)){
        
        return next(AppError.create("Access denied, You dont have permissionto access this resource", 403, "Fail"))

       }
    next()
    }

}