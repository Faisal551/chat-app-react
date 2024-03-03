import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Chat from './components/chat';
import NotFound from './components/NotFound';
import "./App.css"
import PrivateChat from './components/privateChat';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/chat/:username/:room/:roomname" element={<Chat />} />
          <Route path="/private-chat/:username" element={<PrivateChat />} />
          <Route path="*"  element={<NotFound />} /> 
        </Routes>
    </Router>
  );
}

export default App;