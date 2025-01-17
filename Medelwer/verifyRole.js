
module.exports = (...roles) => {
    return (req, res, next) => {
       if(!roles.includes(req.user_data.role)){
        return res.status(403).send('Access denied')
       }
    next()
    }

}