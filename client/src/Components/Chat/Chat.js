import React, { useState, useEffect } from "react";
import queryString from "query-string";
// To retrieve data from the URL

import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';


import './Chat.css'

let socket;
const ENDPOINT = 'http://localhost:5000';
var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity", "timeout": 10000, "transport": ['websocket', 'polling', 'flashsocket']
};

// location prop comes from react router
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [totalUsers, setTotalUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

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
        socket.emit("join", { name, room }, (error) => {
            console.log(error);
            // alert(error);
        });
        // unmounting of component, disconnect effects.
        return () => {
            socket.emit("disconnect");
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
            console.log(messages);
            // setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users, totalUsers }) => {
            setUsers(users);
            setTotalUsers(users);
            console.log(users, "users")
            console.log(totalUsers, "totalUsers")
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
    console.log(totalUsers, users, message, messages);
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} totalUsers={totalUsers}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} totalUsers={totalUsers} />
        </div>
    );
}




export default Chat;