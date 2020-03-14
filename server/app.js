'use strict'

const express = require('express')
const app = express()

const SerialApp = require('../serialapp')
const serialAppInstance = new SerialApp({ log: false })

// app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {

    req.addListener('data')
    let valueArduino = getArduinoValue();
    console.log(valueArduino);
})

app.listen(8080)