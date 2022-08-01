const jwt = require('jsonwebtoken')
require('dotenv').config()
const signAccessToken = async () => {
    const payLoad = {
        userId: 1,
        name: 'tips something'
    }
    const token = await jwt.sign(payLoad, process.env.ACC_KEY, { expiresIn: '2s'});
    return token
}

const signRefreshToken = async () => {
     const payload = {
        userId: 1,
        name: 'tips something'
    }
    const token = await jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: '10s'});
    return token
}
const verifyToken = async (req, res, next) => {
    try {
       if(req.headers['x-token']) {
        const token = req.headers['x-token']
        console.log('token: ', token)
           const payload = await jwt.verify(token, process.env.ACC_KEY)
           req.user = payload;
           return next()
        } 
    }catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(200).json({
                code: 401,
                msg: error.message
            })
        }
        return res.status(200).json({
            code: 500,
            msg: error
        })
    }
}

const verifyRefreshToken = async (req, res, next) => {
    try {
       if(req.headers['rf-token']) {
        const token = req.headers['rf-token']
        console.log('token: ', token)
           const payload = await jwt.verify(token, process.env.REFRESH_KEY)
           req.user = payload;
           return next()
        } 
    }catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(200).json({
                code: 401,
                msg: error.message
            })
        }
        return res.status(200).json({
            code: 500,
            msg: error
        })
    }
}

module.exports = {
    verifyRefreshToken,
    verifyToken,
    signAccessToken,
    signRefreshToken
}