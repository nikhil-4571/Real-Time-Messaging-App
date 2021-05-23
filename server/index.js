const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 5000;

const router = require("./router")
// For realtime data transfer use sockets, not http requests(slow)

const app = express();
const server = http.createServer(app);
const io = socketio(server)
app.use(router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


