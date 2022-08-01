const express = require('express')
const helmet = require('helmet')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(morgan('combined'))
const { verifyToken, signAccessToken, signRefreshToken, verifyRefreshToken } = require('./init_jwt')
app.use(helmet({
      crossOriginResourcePolicy: false,
    }))
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        mess: 'hello ae'
    })
})

app.get('/api/refreshToken',verifyRefreshToken, async (req, res)=> {
   return res.status(200).json({
        status: 'success',
        element: {
              accessToken: await signAccessToken()
        }
    })
})
// api
app.get('/api/login', async (req, res)=> {
    return res.status(200).json({
        status: 'success',
        element: {
              accessToken: await signAccessToken(),
              refreshToken: await signRefreshToken()
        }
    })
})

app.get('/api/user', verifyToken,(req, res)=> {
    return res.status(200).json({
        status: 'success',
        element: {
                name: 'test jwt',
                mess: 'done'
        }
    })
})
app.listen(port, (req)=> {
    console.log('hello listen on port : '+ port)
})