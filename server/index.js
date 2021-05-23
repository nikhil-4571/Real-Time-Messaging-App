const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 5000;
const router = require("./router")
// For realtime data transfer use sockets, not http requests(slow)

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    }
})

// client connection on io instance
// clients register : join and disconnect event from socket.

io.on('connect', (socket) => {
    console.log('new user connected');
    socket.on('join', ({ name, room }, callback) => {
        console.log(name, room);


        // Immediately trigger some response after socket.on event is emitted(user joined)
        // callback helps for error handling.
    })
    socket.on('disconnect', () => {
        console.log("user left")
    })

});




app.use(router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


