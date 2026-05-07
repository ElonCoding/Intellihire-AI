const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HF_TOKEN);
const sessions = {}; // Store conversation history per socket ID

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

  // Initialize session history
  sessions[socket.id] = [
    { role: "system", content: "You are an expert AI technical interviewer. Ask a thoughtful initial question, keep it concise, and then evaluate the candidate's answers dynamically. Act like a real human interviewer. Do not output `<think>` blocks, just speak naturally." }
  ];

  // Handle real-time interview interactions here
  socket.on('start_interview', async (data) => {
    console.log(`Starting interview for role: ${data.role}`);
    
    try {
      const response = await hf.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          ...sessions[socket.id],
          { role: "user", content: `I am interviewing for a ${data.role} position. Let's start.` }
        ],
        max_tokens: 150
      });

      let aiText = response.choices[0].message.content;
      // Remove think blocks if deepseek-r1 returns them
      aiText = aiText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      sessions[socket.id].push({ role: "assistant", content: aiText });
      socket.emit('ai_response', { text: aiText });

    } catch (err) {
      console.error("HF API Error:", err);
      socket.emit('ai_response', { text: "Hello! Let's get started. Could you tell me about a time you had to design a highly scalable system? What approach did you take?" });
    }
  });

  socket.on('user_message', async (data) => {
    try {
      // User says something
      sessions[socket.id].push({ role: "user", content: data.text });
      socket.emit('user_transcript', { text: data.text }); // Echo back for UI

      const response = await hf.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: sessions[socket.id],
        max_tokens: 200
      });

      let aiText = response.choices[0].message.content;
      aiText = aiText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      sessions[socket.id].push({ role: "assistant", content: aiText });
      socket.emit('ai_response', { text: aiText });
    } catch (err) {
      console.error("HF API Error:", err);
      socket.emit('ai_response', { text: "I see. Let's move on to the next topic." });
    }
  });

  socket.on('audio_answer', async (audioBuffer) => {
    try {
      console.log(`Received audio answer from ${socket.id}, size: ${audioBuffer.length} bytes`);
      
      // Convert buffer to Blob for HuggingFace API if necessary
      // Actually, HfInference can take a Buffer or Blob directly for data
      const response = await hf.automaticSpeechRecognition({
        model: "openai/whisper-large-v3",
        provider: "fal-ai",
        data: audioBuffer
      });

      const transcript = response.text;
      console.log(`Whisper Transcript: ${transcript}`);

      // Emit transcript back to UI
      socket.emit('user_transcript', { text: transcript });
      sessions[socket.id].push({ role: "user", content: transcript });

      // Forward to DeepSeek
      const aiResponse = await hf.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: sessions[socket.id],
        max_tokens: 200
      });

      let aiText = aiResponse.choices[0].message.content;
      aiText = aiText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      sessions[socket.id].push({ role: "assistant", content: aiText });
      socket.emit('ai_response', { text: aiText });

    } catch (err) {
      console.error("Whisper API Error:", err);
      socket.emit('ai_response', { text: "I couldn't hear that clearly. Could you repeat?" });
    }
  });

  socket.on('end_interview', () => {
    console.log(`Interview ended for ${socket.id}`);
    delete sessions[socket.id];
  });
  
  socket.on('disconnect', () => {
    delete sessions[socket.id];
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'IntervAI Backend is running' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
