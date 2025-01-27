const jwt = require('jsonwebtoken')

module.exports = (Payload) => {
    const token = jwt.sign(Payload, process.env.Secret_K_JWT, {expiresIn: '30m'}) 
    return token
}