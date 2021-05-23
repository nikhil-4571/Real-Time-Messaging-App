import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

console.log("inside messages");
const Messages = ({ messages, name, totalUsers}) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name} totalUsers={totalUsers}/></div>)}
  </ScrollToBottom>
);

export default Messages;