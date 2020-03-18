# Socket IO - Arduino

This project is an example of interaction between an Arduino through the serial port and Socket.io. 

*See this document in [Portuguese](./README-ptBR.md).*

<br>
<p align="center">
  <a>
    <img src="./ArduinoProgram/gif_demostration.gif" width="370">
  </a>
</p>

### Run Project
- Install all *Node.js* dependencies:
```
  npm install
```
- Run the server of application on `app.js`:
```
  node app.js
```

### Configure Application

**Before running the application, connect the Arduino and run the program `.ino` on the Arduino IDE.**

This is a quick start, for more information see [Socket.io](https://socket.io/docs/) documentation.

- Configure _Express_ and _Socket io_:
```js
  const express = require('express')
  const http = require('http')
  const socketio = require('socket.io')

  //Instance server
  const app = express()
  const server = http.createServer(app)
  const io = socketio(server)

  app.use(express.static('public'))   //Express use public folder for static content

  server.listen(8080, () => {
    console.log(`Server listening on port: 8080`)
  })
```

- Configure on the client side the _Socket io_:
```html
  <script>
    const socket = io()

    socket.on('connect', () => {
        const playerId = socket.id
        console.log(`Player connected on Client with id: ${playerId}`)
    })
  </script>
```

- Configure _Serial/USB_ port for listening and init the Serial App:
```js
  const SerialArduinoApp = require('./serial-arduino-app')
    
  const config = {
      log: false,
      port: 'COM3',
      baudRate: 9600,
      serialLog: true
  }

  const serialApp = new SerialArduinoApp(config);
```

### Examples of interaction

#### **Send data from client to Arduino:**
- Server side:
```js
  let lastSliderValue
  serialApp.sendDataToSerial()    //Init for send data to serial port

  //Init the io, the socket can manipule data from front-end
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
```
- Client side:
```html
<input type="range" min="0" max="100" value="0" class="slider" id="rangeInput">

<script>
  var slider = document.getElementById("rangeInput")
  slider.oninput = function () {
    socket.emit('slider-data', this.value)
  }
</script>

```

#### **Send data from Arduino to client:**
- Server side:

```js
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

```

- Client side:
```html
  <script>
    socket.on('new-value', (newValue) => {
        const textOptions = { value: newValue, color: "black" }
        potentiometerAnimation(textValue, textOptions, requestAnimationFrame)
    })
  </script>
```


