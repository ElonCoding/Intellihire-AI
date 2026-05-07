"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle, BrainCircuit, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Check if pdf or docx
    if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".docx")) {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF or DOCX file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 500);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:3001/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(100);
        
        if (auth.currentUser) {
          try {
            await setDoc(doc(db, "users", auth.currentUser.uid, "data", "resume"), {
              ...data,
              updatedAt: new Date().toISOString()
            });
          } catch (e) {
            console.error("Failed to save to Firestore", e);
          }
        }

        setTimeout(() => {
          setAnalysisResult(data);
          setIsAnalyzing(false);
        }, 500);
      } else {
        alert("Error analyzing resume");
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server.");
      setIsAnalyzing(false);
    } finally {
      clearInterval(interval);
    }
  };

  const proceedToInterview = () => {
    // Store analysis in local storage or state management to be used by interview setup
    if (analysisResult) {
      localStorage.setItem('resumeAnalysis', JSON.stringify(analysisResult));
      router.push('/interview/setup');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center py-20 px-6">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">AI Resume Intelligence</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Upload your resume to receive a deep AI analysis. We'll extract your skills, detect weaknesses, and generate a customized interview strategy just for you.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isAnalyzing && !analysisResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div
                className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all ${
                  isDragging ? "border-primary bg-primary/5" : "border-white/10 bg-white/5 hover:border-white/20"
                } glassmorphism cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {file ? "File Selected" : "Drag & Drop your resume"}
                </h3>
                <p className="text-white/50 text-center mb-6">
                  {file ? file.name : "Supports PDF and DOCX formats up to 5MB"}
                </p>

                {file && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload();
                    }}
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2"
                  >
                    Analyze with AI <BrainCircuit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 glassmorphism text-center"
            >
              <div className="w-24 h-24 relative mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div
                  className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                ></div>
                <BrainCircuit className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Resume...</h3>
              <p className="text-white/60 mb-8 h-6">
                {progress < 30 && "Extracting raw text..."}
                {progress >= 30 && progress < 60 && "Identifying key skills & frameworks..."}
                {progress >= 60 && progress < 90 && "Evaluating experience & impact..."}
                {progress >= 90 && "Generating tailored interview plan..."}
              </p>
              
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-right text-sm text-white/40 mt-2">{progress}%</p>
            </motion.div>
          ) : analysisResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-6"
            >
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ATS Score Card */}
                <div className="col-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 glassmorphism flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white/10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${analysisResult.atsScore}, 100`}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{analysisResult.atsScore}</span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">ATS Score</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold">Resume Status</h4>
                  <p className="text-sm text-white/60 mt-2">{analysisResult.summary}</p>
                </div>

                {/* Extracted Data Card */}
                <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 glassmorphism">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" /> Extracted Profile
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider">Top Skills Found</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.skills.map((skill: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-blue-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" /> Strengths
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-green-400 mt-0.5">•</span> <span className="text-white/80">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white/50 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" /> Improvement Areas
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-yellow-400 mt-0.5">•</span> <span className="text-white/80">{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Interview Strategy */}
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 glassmorphism relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] -z-10 rounded-full" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <BrainCircuit className="w-6 h-6 text-primary" /> AI Interview Strategy Generated
                    </h3>
                    <p className="text-white/70 max-w-2xl">
                      Based on your resume, the AI has prepared a personalized interview focusing on <strong>{analysisResult.suggestedRole}</strong>. 
                      Expect deep-dives into your projects and specific technical questions to validate your expertise.
                    </p>
                  </div>
                  
                  <button 
                    onClick={proceedToInterview}
                    className="whitespace-nowrap px-8 py-4 bg-white text-black hover:bg-white/90 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                  >
                    Setup Interview <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
