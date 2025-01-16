module.exports = (FnSanyc) => {
    return (req, res, next) =>{
        FnSanyc (req, res, next).catch((err) => {
            next(err)
        })
    }
}
            