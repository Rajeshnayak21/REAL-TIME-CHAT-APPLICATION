import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const socket = new WebSocket('ws://localhost:8080');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user] = useState(() => 'User${Math.floor(Math.random() * 1000)}');
  const messagesEndRef = useRef();

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        setMessages(data.messages);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.send(JSON.stringify({ type: 'message', user, text: input }));
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Real-Time Chat</div>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={"chat-message ${msg.user === user ? 'own' : ''}"}>
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;