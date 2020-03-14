'use strict'

const SerialPort = require('serialport');
const Delimiter = require('@serialport/parser-delimiter')
const port = new SerialPort('COM3', {
    baudRate: 9600
})

const parser = port.pipe(new Delimiter({ delimiter: '\n' }))

class SerialAplication {
    constructor(config = { log : false, ...options }) {

        this.port = port
        this.parser = parser
        this.config = config
    
        this.log = config.log
        if(config.log == true){
            console.log("Logging data from Serial... \n")
        }
        else{
            console.log("No logs data from Serial... \n")
        }
      
        port.on('open', (err) => {
            if (err) {
                return console.error("Serial Connection -> DON'T WORK: \n" + err.message)
            }
            console.log("Serial Connection -> OK!")
        })
  
    }

    getData(){
        let dataValue
        parser.on('data', (data) => {
            dataValue = data.toString('utf8')    
            if (this.log == true) {
                console.log(dataValue)
            }
        }) 
        return dataValue 
    }
}


module.exports = SerialAplication



