const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {gererateMessage , gererateLocation} = require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/users') 

const app = express()
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket)=>{
    console.log('New WebSocket Connection')

    socket.on('join',(options, callback) => { 

        const {error, user} = addUser({id:socket.id, ...options})
        if(error)
            return callback(error) 

        socket.join(user.room)

        socket.emit('message',gererateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',gererateMessage('Admin',`${user.username} has joined!`))
        
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserInRoom(user.room)
        })
        // callback()
    })

    socket.on('sendMsg', (message , callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message',gererateMessage(user.username,message))
        callback()
    })

   
    socket.on('sendLocation', (coords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', gererateLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',gererateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })

})

server.listen(port ,()=>{
    console.log('Server is run on port',port)
})