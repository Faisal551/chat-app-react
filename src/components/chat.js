import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { IoSend } from 'react-icons/io5';
import { useLocation, useParams,useNavigate } from 'react-router-dom';

import { io } from 'socket.io-client';
const socket = io(`${process.env.REACT_APP_API_KEY}`);
// Use a function to create the socket instance
let timeout = 0

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState('');
    const [loading, setLoading] = useState('');
    let [users, setUsers] = useState([])
    let [isTyping, setIsTyping] = useState(false)

    const { username, room, roomname } = useParams();   
     let navigate = useNavigate()


    useEffect(() => {
        socket?.on('message', (receivedMessage) => {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        socket?.on('joinRoomMessage', (receivedMessage) => {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);

        });

        socket?.on('updateGroupOnlineUsers', (receivedMessage) => {
            setUsers(receivedMessage)

        });
        socket?.on('leaveRoomMessage', (receivedMessage) => {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
        socket?.on('typingMsg', (receivedMessage) => {
            console.log(receivedMessage)
            setTyping(`${receivedMessage.username} is Typing...`)
            setIsTyping(receivedMessage.isTyping)
        });

        return () => {
            socket?.emit('leaveRoom', { username, room });
        };
    }, []);

    useEffect(() => {
        socket?.emit('joinRoom', { username, room });
        getAllMessages()
    }, [username, room, roomname])
    useEffect(() => {
        const confirmationMessage = 'Are you sure you want to leave?';
        const handleWindowClose = (e) => {
            e.preventDefault();
            e.returnValue = confirmationMessage;
            alert(confirmationMessage);
            socket?.emit('leaveRoom', { username, room });
            socket?.disconnect();
        };

        window.addEventListener('beforeunload', handleWindowClose);

        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
        };
    }, [])
    console.log(messages)


    const sendMessage = () => {
        if (message.trim()) {
            // Use a consistent property name for the message content
            socket.emit('message', { content: message, username, room });
            setMessage('');
            setTyping('');
        }
    };
    const handleTyping = () => {
        socket.emit('typing', { username, room, isTyping: true });
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log("aa")
            socket.emit('typing', { username, room, isTyping: false });
        }, 1000);

    };

    const getAllMessages = async (msg) => {
        let receivedMessage = await axios.get(`${process.env.REACT_APP_API_KEY}/chat/getMessages/${room}`)
        if (receivedMessage) {
            setTimeout(() => {
                setMessages(receivedMessage.data);

            }, 2000)

        }

    }
    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>{roomname}</h2>
            </div>
            <div style={{ display: "flex", backgroundColor: "gray", padding: "10PX" }}>
                {
                    users && users.map((data) => {
                        return (
                            <div
                            onClick={()=>{navigate(
                                `/private-chat/${username}`
                            )}}
                                key={data.id} // Add a unique key for each user
                                style={{
                                    position: "relative",
                                    marginRight: "5px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        background: "black",
                                        textAlign: "center",
                                        paddingTop: "12px",
                                        color: "#ffff",
                                    }}
                                >
                                    {data}
                                </div>

                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "5px",
                                        right: "0px",
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        background: "green",
                                    }}
                                ></div>

                            </div>
                        )
                    })
                }

            </div>
            <div className="chat-messages">
                {messages && messages.map((msg, index) => {
                    return msg.type === "notification" ? (
                        <div key={index} style={{ textAlign: "center", color: "gray", textTransform: "capitalize", marginBottom: "5px" }}>
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

export default Chat;