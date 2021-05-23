import React, { useState, useEffect } from "react";
import queryString from "query-string";
// To retrieve data from the URL

import io from "socket.io-client";

import './Chat.css'

let socket;
var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity", "timeout": 10000, "transport": ["websocket"]
};

// location prop comes from react router
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = 'localhost:5000';
    // Initiate requests for connection and disconnection of socket io instance
    useEffect(() => {
        // retrieve the data users entered while joining
        const { name, room } = queryString.parse(location.search);
        // console.log(location.search);
        socket = io(ENDPOINT, connectionOptions);
        setName(name);
        setRoom(room);
        // console.log(socket);
        // emit events from client side socket.
        socket.emit("join", { name, room }, () => {

        });
        // unmounting of component, disconnect effects.
        return () => {
            socket.emit("disconnect");
            // Disconnect 1 instance of client socket
            socket.off();
        }
    }, [ENDPOINT, location.search])
    return (

        <div>Chat</div>
    )
};

export default Chat;