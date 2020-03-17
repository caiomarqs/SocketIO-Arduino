'use strict'
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const SerialArduinoApp = require('./serial-arduino-app/index')

//Instancia do servidor
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Listening serial port
const config = {
    log: false,
    port: 'COM3',
    baudRate: 9600,
    serialLog: false
}
const serialApp = new SerialArduinoApp(config);

app.use(express.static('public'))   //Exepress use public folder for static content

let lastSliderValue
serialApp.sendDataToSerial()    //Init for send data to serial port

//Init the io, the socket can manipule data from a front-end
io.sockets.on('connection', (socket) => {
    const userId = socket.id
    console.log(`User connected: ${userId}`)

    //Listening slider from front-end
    socket.on('slider-data', (sliderValue) => {
        if (lastSliderValue != sliderValue) {
            serialApp.emit('send-data', sliderValue) // emit to a serialport the value recived from client
            lastSliderValue = sliderValue
        } else {
            lastSliderValue = sliderValue
        }
    })

})

let lastSerialData
serialApp.reciveDataToSerial() // Init to recive data from serialport

//Listening data recived from serialport
serialApp.on('serial-data', (serialData) => {
    if (lastSerialData != serialData) {
        io.emit('new-value', serialData)    // emit to client the serial data
        lastSerialData = serialData

    } else {
        lastSerialData = serialData
    }
})

server.listen(8080, () => {
    console.log(`Server listening on port: 8080`)
})