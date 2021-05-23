import React, { useState, useEffect } from "react";
import queryString from "query-string";
// To retrieve data from the URL

import io from "socket.io-client";

import './Chat.css'

let socket;
var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity", "timeout": 10000, "transport": ['websocket', 'polling', 'flashsocket']
};

// location prop comes from react router
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
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
            socket.emit("disconnection");
            // Disconnect 1 instance of client socket
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    // For handling messages
    useEffect(() => {
        // listen for messages
        socket.on('message', message => {
            // push message to messages array.
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        // To avoid whole page refresh

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
            // Input field clears on sending message.
        }
    }
    console.log(message, messages);
    return (
        <div className="outerContainer">
            <div className="container">
                <input value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={event => event.key === "Enter" ? sendMessage(event) : null}
                />
            </div>
        </div>
    );
}




export default Chat;