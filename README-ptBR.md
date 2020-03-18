# Socket IO - Arduino

Este projeto é um exemplo de interação entre um Arduino pela porta serial e o Socket.io.

*Veja a documentação em [Inglês](./README.md).*

<br>
<p align="center">
  <a>
    <img src="https://i.imgur.com/akS7m6F.gif" width="400">
  </a>
</p>

### Rode o projeto
- Instele todas as dependecias do *Node.js*:
```
    npm install
```
- Rode a aplicação do server no `app.js`:
```
  node app.js
```

### Configurando a aplicação

**Antes de rodar a aplicação, ligue o Arduino na porta *Serial/USB* e rode o programa `.ino` na Arduno IDE.**

Esse projeto é um modelo inicial, veja a documentção do [Socket.io](https://socket.io/docs/).

- Configurar _Express_ e _Socket io_:
```
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

- Configurar o _Socket io_ no lado do client:
```
  <script>
    const socket = io()

    socket.on('connect', () => {
        const playerId = socket.id
        console.log(`Player connected on Client with id: ${playerId}`)
    })
  </script>
```

- Configurar porta _Serial/USB_ e iniciar o Serial App:
```
  const SerialArduinoApp = require('./serial-arduino-app')
    
  const config = {
      log: false,
      port: 'COM3',
      baudRate: 9600,
      serialLog: true
  }

  const serialApp = new SerialArduinoApp(config);
```

### Exemplos de interação

#### **Enviado dados do client para o Arduino:**
- Lado do server:
```
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
- Lado do client:
```
<input type="range" min="0" max="100" value="0" class="slider" id="rangeInput">

<script>
  var slider = document.getElementById("rangeInput")
  slider.oninput = function () {
    socket.emit('slider-data', this.value)
  }
</script>

```

#### **Enviando dados do Arduino para o client:**
- Lado do server:

```
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

- Lado do client:
```
  <script>
    socket.on('new-value', (newValue) => {
        const textOptions = { value: newValue, color: "black" }
        potentiometerAnimation(textValue, textOptions, requestAnimationFrame)
    })
  </script>
```


