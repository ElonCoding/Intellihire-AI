"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Settings, Target, Video, Mic, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InterviewSetup() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [interviewFormat, setInterviewFormat] = useState("technical");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isMicReady, setIsMicReady] = useState(false);
  const [isTestingMedia, setIsTestingMedia] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('resumeAnalysis');
    if (data) {
      setAnalysisResult(JSON.parse(data));
    }
  }, []);

  const testMedia = async () => {
    setIsTestingMedia(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (stream.getVideoTracks().length > 0) setIsCameraReady(true);
      if (stream.getAudioTracks().length > 0) setIsMicReady(true);
      
      // Stop tracks after test
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Media permission denied", err);
      alert("Please allow camera and microphone permissions to proceed.");
    } finally {
      setIsTestingMedia(false);
    }
  };

  const startInterview = () => {
    // Store setup configuration
    localStorage.setItem('interviewConfig', JSON.stringify({
      format: interviewFormat,
      difficulty,
      role: analysisResult?.suggestedRole || "Software Engineer"
    }));
    router.push('/interview');
  };

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <BrainCircuit className="w-16 h-16 text-primary mb-6 animate-pulse" />
        <h2 className="text-2xl font-bold mb-4">No Resume Data Found</h2>
        <p className="text-white/60 mb-8">Please upload your resume to generate a personalized interview setup.</p>
        <Link href="/resume-upload" className="px-6 py-3 bg-primary text-white rounded-xl font-medium">
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Configure Your Interview</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Based on your resume, you're a great fit for <strong>{analysisResult.suggestedRole}</strong>. 
            Customize the interview parameters before we begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Setup Panel */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 glassmorphism">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Interview Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Interview Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'technical', label: 'Technical Round' },
                      { id: 'hr', label: 'HR / Behavioral' },
                      { id: 'system_design', label: 'System Design' },
                      { id: 'stress', label: 'Stress Interview' }
                    ].map(format => (
                      <button
                        key={format.id}
                        onClick={() => setInterviewFormat(format.id)}
                        className={`p-3 rounded-xl border text-sm transition-all ${
                          interviewFormat === format.id 
                            ? "bg-primary/20 border-primary text-white" 
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['junior', 'intermediate', 'senior'].map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`p-3 rounded-xl border text-sm capitalize transition-all ${
                          difficulty === level 
                            ? "bg-purple-500/20 border-purple-500 text-white" 
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Check Panel */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 glassmorphism">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" /> Equipment Check
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-white/60" />
                    <span>Camera</span>
                  </div>
                  {isCameraReady ? <CheckCircle className="w-5 h-5 text-green-500" /> : <span className="text-white/40 text-sm">Not Tested</span>}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-white/60" />
                    <span>Microphone</span>
                  </div>
                  {isMicReady ? <CheckCircle className="w-5 h-5 text-green-500" /> : <span className="text-white/40 text-sm">Not Tested</span>}
                </div>
              </div>

              <button 
                onClick={testMedia}
                disabled={isTestingMedia || (isCameraReady && isMicReady)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isTestingMedia ? "Testing..." : (isCameraReady && isMicReady) ? "Equipment Ready" : "Test Camera & Microphone"}
              </button>
            </div>
          </div>

          {/* AI Plan Preview */}
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-white/10 rounded-3xl p-8 glassmorphism flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-400" /> AI Interview Plan
            </h3>
            
            <div className="flex-1 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Targeted Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.skills.slice(0, 5).map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-black/30 rounded-full text-sm border border-white/5 text-blue-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Focus Areas</h4>
                <ul className="space-y-3">
                  {analysisResult.weaknesses.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</div>
                      <span className="text-sm text-white/80">Probe on: {w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button 
              onClick={startInterview}
              disabled={!isCameraReady || !isMicReady}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 mt-8 ${
                isCameraReady && isMicReady ? "bg-primary hover:bg-primary/90 text-white" : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
            >
              Start Live Interview <ArrowRight className="w-5 h-5" />
            </button>
            {(!isCameraReady || !isMicReady) && (
              <p className="text-center text-xs text-yellow-400/80 mt-3">Please test your equipment before starting.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
