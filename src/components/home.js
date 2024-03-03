import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";



function Home() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [rooms, setRooms] = useState([]);

    const [joined, setJoined] = useState(false);
    let navigate = useNavigate()
    const handleJoinChat = () => {
        if (username?.trim() && room?.trim()) {
            let rm= rooms.find(rm=> room==rm._id)
            navigate(
                `/chat/${username}/${room}/${rm.roomName}`
            )
        }
    };
    useEffect(()=>{
      getAllRooms()
    },[])

    const getAllRooms=async()=>{
   try {
    let rooms=await axios.get(`${process.env.REACT_APP_API_KEY}/chat/getAllRooms`)
    setRooms(rooms.data)
   } catch (error) {
    
   }
    }
    return (
        <Container>
            <Row className="mt-5">
                <Col md={{ span: 6, offset: 3 }}>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoom">
                            <Form.Label>Room</Form.Label>
                            <Form.Select onChange={(e) => { setRoom(e.target.value)}} defaultValue="">
                                <option value="">Select Room</option>
                                {
                                    rooms?.map((rm,i)=>{
                                        return rm.private==false &&(<option key={i} value={rm._id}>{rm.roomName}</option>)
                                    })
                                }                             
                            </Form.Select>
                        </Form.Group>
                        <Button className='mt-4' variant="primary" onClick={handleJoinChat}>
                            Join Chat
                        </Button>
                    </Form>
                </Col>
            </Row>

        </Container>
    );
}

export default Home;
