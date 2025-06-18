// backend/server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', ws => {
  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', data => {
    const parsed = JSON.parse(data);
    if (parsed.type === 'message') {
      const message = {
        user: parsed.user,
        text: parsed.text,
        timestamp: new Date().toISOString(),
      };
      messages.push(message);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', message }));
        }
      });
    }
  });
});

server.listen(8080, () => console.log('WebSocket server on ws://localhost:8080'));