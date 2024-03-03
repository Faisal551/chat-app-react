import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { IoSend } from 'react-icons/io5';
import { useLocation, useParams } from 'react-router-dom';

import { io } from 'socket.io-client';
const socket = io(`${process.env.REACT_APP_API_KEY}`);
// Use a function to create the socket instance
let timeout=0

const PrivateChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState('');
    let [isTyping,setIsTyping]=useState(false)

    const { username } = useParams();


    useEffect(() => {
        socket?.on('Chatmessage', (receivedMessage) => {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
         
        socket?.on('typingMsg', (receivedMessage) => {
            console.log(receivedMessage)
              setTyping(`${receivedMessage.username} is Typing...`)
              setIsTyping(receivedMessage.isTyping)
        });
    
    }, []);
  
  
   
    console.log(messages)


    const sendMessage = () => {
        if (message.trim()) {
            // Use a consistent property name for the message content
            socket.emit('chatMessage', { content: message, username, });
            setMessage('');
            setTyping('');
        }
    };
    const handleTyping = () => {
        socket.emit('typing', {username,username,isTyping:true});
        if(timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
         console.log("aa")
        socket.emit('typing', {username,username,isTyping:false});
    }, 1000);

    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages && messages.map((msg, index) => {
                    return msg.type === "notification" ? (
                        <div key={index} style={{ textAlign: "center", color: "gray", textTransform: "capitalize",marginBottom:"5px" }}>
                            <strong>{msg.content}</strong>
                        </div>
                    ) : (
                        <div key={index} className={msg.username === username ? 'my-message' : 'other-message'}>
                            <strong>{msg.username}: </strong>
                            {msg.content}
                        </div>
                    );
                })}
                {
                    isTyping && (<div className="typing-indicator">{typing}</div>)
                }
                
            </div>
            <div className="chat-input">
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleTyping}
                    />
                    <Button variant="outline-primary" onClick={sendMessage}>
                        <IoSend />
                    </Button>
                </InputGroup>
            </div>
        </div>
    );
};

export default PrivateChat;