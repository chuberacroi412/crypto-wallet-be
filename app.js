const express = require('express')
const cors = require('cors')
const bodyParse = require('body-parser')
const userService = require('./services/user')

// static
const PORT = 3001;
let blockChain = {
    chain: [],
    difficulty: 1,
    blockTime: 30000
}

const server = {
    wallet : userService.CreateWallet(),
    giftCoin: 10
}

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
    userService.RegisterGift(blockChain, server, result.publicKey)

    res.status(200).send(result)
})

app.get('/user/balance/:id', (req, res) => {
    
    const balance = userService.GetAccountBalance(blockChain.chain, req.params.id)
    res.status(200).send(balance.toString())
})

app.get('/user/history/:id', (req, res) => {

    const history = userService.GetTransactionHistory(blockChain.chain, req.params.id)
    res.status(200).send(history)
})

app.post('/user/wallet', (req, res) => {

    if(req.body.userPublicKey) {
       const result = userService.IsKeyExisted(blockChain.chain, req.body.userPublicKey)

       res.status(200).send(result)
    }
    else
        res.status(400).send('missing wallet address')
})

app.get('/demo', (req, res) => {

    const data = {
        'name' : 'hehehe',
        'age': 12
    }
    userService.AddBlock(blockChain, data)
    res.status(200).send(blockChain.chain)
})

app.get('*', (req,res) => {
    res.status(404).send('Url not found')
})
