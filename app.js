const express = require('express')
const cors = require('cors')
const bodyParse = require('body-parser')

const PORT = 3001;

// app
const app = express()

// middleware
app.use(cors())
app.use(bodyParse.json())

// server
app.listen(PORT, () => console.log('on'))

// route
app.get('/', (req,res) => {
    res.status(200).send('got it')
})