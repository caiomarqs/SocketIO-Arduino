const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')
const EventEmitter = require('events')

/**
 * This class have methods for manipule serial data from Arduino
 * @class SerialArduinoApp
 * @extends EventEmitter
 * @author caiomarqs
 */
class SerialArduinoApp extends EventEmitter {
    /**
     * This constructor recive the configuration object
     * @param {*} config 
     */
    constructor( config = { 
                            log: false,         //Log when send-data to SerialPort
                            port: 'COM3',       //SerialPort 
                            baudRate: 9600,     
                            serialLog: false,   //Log when SeriaPort send data to Node
                            ...options } ) {                     
        super();
        this.config = config;

        //Config serial port
        this.port = new SerialPort(this.config.port || 'COM3', {
            baudRate: this.config.baudRate
        })
        
        //Start serial port
        this.start();
    }

    start() {
        
       this.port.on('open', (err) => {
            if (err) {
                return console.error("Serial Connection -> DON'T WORK: \n" + err.message)
            }
            console.log("Serial Connection -> OK!")
        })
    }

    /**
     * This method listening data from serialPort and emit data to node
     * @method reciveDataToSerial
     */
    reciveDataToSerial() {
        const parser = this.port.pipe(new Delimiter({ delimiter: '\n' }))
        const dataObj = { value: "" }

        if (this.config.serialLog == true) {
            console.log("Logging data from Serial... \n")
        }
        else {
            console.log("No logs data from Serial... \n")
        }

        parser.on('data', (data) => {
            dataObj.value = data.toString('utf8')

            if (this.config.serialLog == true) {
                console.log(dataObj.value)
            }

            this.emit('serial-data', dataObj.value.trim())
        })
    }

    /**
     * This method emit data to serialPort wher node listening this data.
     * @method sendDataToSerial
     */
    sendDataToSerial(){
        this.on('send-data', (data) => {
            this.port.write(data+'\n')
            
            if (this.config.log == true) {
                console.log(data)
            }
        })
    }
}

module.exports = SerialArduinoApp