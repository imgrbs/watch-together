require('dotenv').config()

const express = require('express')
const path = require('path')

const server = express()
const PORT = parseInt(process.env.PORT)

const app = server.listen(PORT, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${PORT}`)
})

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(path.resolve(__dirname, '.', 'build')))
  server.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}

const io = require('socket.io').listen(app)

io.on('connection', (socket) => {
  socket.on('video', (data) => {
    io.emit(`${data.room}`, data)
  })
  socket.on('action', (data) => {
    io.emit(`action_${data.room}`, data)
  })
})
