const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')
const EventEmitter = require('events')


const port = new SerialPort('COM3', {
    baudRate: 9600
})

const parser = port.pipe(new Delimiter({ delimiter: '\n' }))

class SerialApp extends EventEmitter {
    constructor(config = { log: false, ...options }) {
        super();
        this.config = config;
    }

    start() {

        let _this = this
        let config = this.config
        const dataObj = { value: "" }

        //open serial connection
        port.on('open', (err) => {
            if (err) {
                return console.error("Serial Connection -> DON'T WORK: \n" + err.message)
            }
            console.log("Serial Connection -> OK!")
        })


        if (config.log == true) {
            console.log("Logging data from Serial... \n")
        }
        else {
            console.log("No logs data from Serial... \n")
        }

        parser.on('data', (data) => {
            dataObj.value = data.toString('utf8')

            if (config.log == true) {
                console.log(dataObj.value)
            }
            _this.emit('data-serial', dataObj.value)
        })
        
    }
}

module.exports = SerialApp