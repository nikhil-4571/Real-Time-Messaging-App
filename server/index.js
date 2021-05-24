const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 5000;
const router = require("./router.js");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users.js');

// For realtime data transfer use sockets, not http requests(slow)

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    }
})


app.use(cors());
app.use(router);

// client connection on io instance
// clients register : join and disconnect event from socket.

io.on('connection', (socket) => {
    // console.log('new user connected');
    socket.on('join', ({ name, room }, callback) => {
        // console.log(name, room);
        // console.log("socket id", socket.id)
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) {
            return callback(error)
        }
        // Immediately trigger some response after socket.on event is emitted(user joined)
        // callback helps for error handling.

        socket.join(user.room);

        // Messaging events
        // System messages when some user joins.
        // Emit event from bakend to front end
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), totalUsers: users });
        callback();

    });

    // creating events for user generated message(from front end)
    // Expecting event on the backend, waiting..  
    // emit event happens on fronend and after that callback is executed.
    socket.on('sendMessage', (message, callback) => {
        // specific client instance
        const user = getUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: user.name, text: message });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), totalUsers: users });
        }

        callback();
    });

    socket.on('disconnect', () => {
        // console.log("user left");
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), totalUsers: users });
        }
    });

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


