const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

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
    console.log(`Starting interview. Role: ${data.role}, Format: ${data.format}, Difficulty: ${data.difficulty}`);

    let systemPrompt = "You are an expert AI technical interviewer. Ask a thoughtful initial question, keep it concise, and then evaluate the candidate's answers dynamically. Act like a real human interviewer. Do not output `<think>` blocks, just speak naturally.";

    if (data.resumeData) {
      systemPrompt = `You are an expert AI interviewer. 
The candidate is interviewing for a ${data.role} role. The interview format is ${data.format} and difficulty is ${data.difficulty}.
Candidate Resume Strengths: ${data.resumeData.strengths?.join(", ")}.
Candidate Weaknesses to probe: ${data.resumeData.weaknesses?.join(", ")}.
Candidate Skills: ${data.resumeData.skills?.join(", ")}.
Ask a thoughtful initial question based on their profile, keep it concise. Do not output <think> blocks. Act naturally.`;
    }

    sessions[socket.id] = [{ role: "system", content: systemPrompt }];

    try {
      const response = await hf.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          ...sessions[socket.id],
          { role: "user", content: `I am ready to begin the ${data.format} interview for the ${data.role} position.` }
        ],
        max_tokens: 150
      });

      let aiText = response.choices[0].message.content;
      aiText = aiText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      sessions[socket.id].push({ role: "assistant", content: aiText });
      socket.emit('ai_response', { text: aiText });

    } catch (err) {
      console.error("HF API Error:", err);
      socket.emit('ai_response', { text: `Hello! Let's get started with your ${data.role} interview. Could you tell me about your background?` });
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

// Don't touch fucking below code and do not modify anything
// I mean literally anything
// Bro fucking delete me if you touch the below code

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'IntervAI Backend is running' });
});

app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf8');
    }

    const prompt = `Analyze the following resume text and extract key information in JSON format. 
Return ONLY a valid JSON object with the following schema:
{
  "atsScore": (number 0-100),
  "summary": "(1-2 sentence summary of candidate profile)",
  "skills": ["(skill 1)", "(skill 2)", ...],
  "strengths": ["(strength 1)", "(strength 2)", ...],
  "weaknesses": ["(weakness 1)", "(weakness 2)", ...],
  "suggestedRole": "(best matching job title)"
}

Resume Text:
${text.substring(0, 3000)}`;

    const response = await hf.chatCompletion({
      model: "deepseek-ai/DeepSeek-R1",
      messages: [
        { role: "system", content: "You are an expert ATS system. You output strictly JSON." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });

    let aiText = response.choices[0].message.content;
    aiText = aiText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    if (aiText.startsWith('\`\`\`json')) {
      aiText = aiText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    } else if (aiText.startsWith('\`\`\`')) {
      aiText = aiText.replace(/\`\`\`/g, '').trim();
    }

    const result = JSON.parse(aiText);
    res.json(result);
  } catch (err) {
    console.error("Resume Analysis Error:", err);
    res.json({
      atsScore: 75,
      summary: "Candidate with software engineering experience. Extracted from fallback due to API limit or parsing error.",
      skills: ["JavaScript", "React", "Node.js", "AI Integration"],
      strengths: ["Strong technical foundation", "Good project showcase"],
      weaknesses: ["Missing quantified metrics in experience", "Needs better action verbs"],
      suggestedRole: "Software Engineer"
    });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
