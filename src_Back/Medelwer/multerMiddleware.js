const AppError = require('../utils/AppError')

const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        
        cb(null, `${Date.now()}_${file.originalname}`)
    } 
})
    
const fileFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')
    if(type[0] === "image"){
        cb(null, true)
    }else{
        return cb(AppError.create("file must be an image", 401, "Fail"), false)
    }   
}

const upload = multer({
    storage,
    fileFilter
})



module.exports = {
    singleUpload: upload.single("avatar")
}
