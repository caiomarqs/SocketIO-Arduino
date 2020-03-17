'use strict'
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const SerialApp = require('./serialapp')

//Instancia do servidor
const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

//Listening serial port
const config = { log: false }
const serialApp = new SerialApp(config);
serialApp.start();

app.use(express.static('public'))

sockets.on('connection', (socket) => {
    const userId = socket.id
    console.log(`User connected: ${userId}`)
})

let oldDataSerial
serialApp.on('data-serial', (dataSerial) => {

    if (oldDataSerial != dataSerial) {
        sockets.emit('new-value', dataSerial.toString('utf8').trim())
        oldDataSerial = dataSerial
        console.log('new')

    } else {
        oldDataSerial = dataSerial
    }

})

server.listen(8080, () => {
    console.log(`Server listening on port: 8080`)
})