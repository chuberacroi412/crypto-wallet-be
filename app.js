const express = require('express')
const cors = require('cors')
const bodyParse = require('body-parser')
const userService = require('./services/user')

// static
const PORT = 3001;
let blockChain = []

// app
const app = express()

// middleware
app.use(cors())
app.use(bodyParse.json())

// server
app.listen(PORT, () => console.log('on'))

// route
// app.get('*', (req,res, next) => {
//      req.body.chain = blockChain
//      next()
// })

app.get('/user/wallet', (req, res) => {

    const result = userService.CreateWallet()
    res.status(200).send(result)
})

app.get('*', (req,res) => {
    res.status(404).send('Url not found')
})
