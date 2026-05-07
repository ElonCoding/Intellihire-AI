const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // Handle real-time interview interactions here
  socket.on('start_interview', (data) => {
    console.log(`Starting interview for role: ${data.role}`);
    // Simulate AI taking a moment to think, then sending the first question
    setTimeout(() => {
      socket.emit('ai_response', { text: "Hello! Let's get started. Could you tell me about a time you had to design a highly scalable system? What approach did you take?" });
    }, 1500);
  });

  socket.on('audio_chunk', (data) => {
    // Process audio chunk, send to STT
    // For now, simulate receiving a transcript and responding
    setTimeout(() => {
       socket.emit('user_transcript', { text: "I used microservices and Redis for caching." });
       setTimeout(() => {
         socket.emit('ai_response', { text: "That's a solid approach. Why Redis specifically instead of Memcached?" });
       }, 2000);
    }, 1000);
  });

  socket.on('end_interview', () => {
    console.log(`Interview ended for ${socket.id}`);
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'IntervAI Backend is running' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
