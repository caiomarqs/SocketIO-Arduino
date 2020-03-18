'use strict'
const SerialArduinoApp = require('../lib/serial-arduino-app.js')
const EventEmitter = require('events')

// Config object 
const config = {
    log: false,
    port: 'COM3',
    baudRate: 9600,
    serialLog: true
}

const serial = new SerialArduinoApp(config)

serial.reciveDataToSerial() //Start recive data from serialport
serial.on('serial-data', (serialdata) => {
    console.log(serialdata)
})


serial.sendDataToSerial() //Start send data to serialport

const emitter = new EventEmitter() //Use to simulate the event
emitter.on('event', () => {
    setInterval(() => {
        serial.emit('send-data', '100') //Emit the data to Serial Port
    }, 50)
})

emitter.emit('event') // Force the event
