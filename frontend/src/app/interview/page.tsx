"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, BrainCircuit, Activity } from "lucide-react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";

export default function InterviewRoom() {
  const [isStarted, setIsStarted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [transcript, setTranscript] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Hello John, I'm your AI interviewer today. Whenever you're ready, we can begin the technical round." }
  ]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket Connection
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    
    socketRef.current.on('connect', () => {
      console.log('Connected to backend:', socketRef.current?.id);
    });

    socketRef.current.on('ai_response', (data: { text: string }) => {
      setTranscript(prev => [...prev, { role: 'ai', text: data.text }]);
    });

    socketRef.current.on('user_transcript', (data: { text: string }) => {
      setTranscript(prev => [...prev, { role: 'user', text: data.text }]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Simulate webcam
  useEffect(() => {
    if (isVideoOn && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    } else if (!isVideoOn && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  }, [isVideoOn]);

  const toggleSession = () => {
    setIsStarted(!isStarted);
    if (!isStarted) {
      socketRef.current?.emit('start_interview', { role: 'backend_engineer' });
      // Remove the simulated timeout since the backend should respond now
      // However, as a fallback if backend is not running, we keep a fallback response
      setTimeout(() => {
        if (transcript.length <= 1) {
          setTranscript(prev => [...prev, { role: 'ai', text: "Let's start with a basic question. Can you explain the difference between a process and a thread?" }]);
        }
      }, 1500);
    } else {
      socketRef.current?.emit('end_interview');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-white/80">Senior Backend Engineer Mock</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/60">00:00:00</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Left Video Area */}
        <div className="flex-grow flex flex-col gap-4">
          {/* AI Interviewer Video/Avatar */}
          <div className="flex-grow rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
            <BrainCircuit className="w-32 h-32 text-primary/40 z-0 animate-pulse" />
            
            {/* Visualizer when AI is talking */}
            {isStarted && (
              <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 z-0 flex items-center gap-1 opacity-50">
                {[1,2,3,4,5].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["10px", "40px", "10px"] }}
                    transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1), ease: "easeInOut" }}
                    className="w-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-4 left-4 z-20">
              <span className="px-3 py-1 rounded-md bg-black/50 backdrop-blur-md text-white text-sm font-medium border border-white/10">
                AI Interviewer
              </span>
            </div>
          </div>

          {/* User Webcam Area */}
          <div className="h-64 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            {isVideoOn ? (
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <VideoOff className="w-12 h-12 text-white/20" />
               </div>
            )}
            <div className="absolute bottom-4 left-4 z-20">
              <span className="px-3 py-1 rounded-md bg-black/50 backdrop-blur-md text-white text-sm font-medium border border-white/10">
                You
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-4">
            <button onClick={() => setIsMicOn(!isMicOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsVideoOn(!isVideoOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button onClick={toggleSession} className={`px-6 h-12 rounded-full flex items-center gap-2 font-medium transition-colors ${isStarted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary/90 text-white'}`}>
              {isStarted ? (
                <><PhoneOff className="w-5 h-5" /> End Interview</>
              ) : (
                <><Activity className="w-5 h-5" /> Start Interview</>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar - Transcript & Insights */}
        <div className="w-full lg:w-96 rounded-2xl bg-white/5 border border-white/10 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h3 className="font-medium text-sm text-white/80">Live Transcript</h3>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {transcript.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-white/40 mb-1">{msg.role === 'ai' ? 'AI Interviewer' : 'You'}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-white/90 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <h4 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">Real-time Insights</h4>
            <div className="space-y-2">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-white/70">Speaking Pace</span>
                 <span className="text-green-400 font-medium">Optimal</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-white/70">Eye Contact</span>
                 <span className="text-yellow-400 font-medium">Improve</span>
               </div>
               <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                 <div className="h-full bg-primary w-[75%]" />
               </div>
               <p className="text-xs text-white/40 text-center mt-2">Confidence level: 75%</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
