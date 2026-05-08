"use client";

import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, XCircle, AlertCircle, TrendingUp, Mic, Eye, BarChart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function InterviewReport() {
  const params = useParams();
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendFeedbackToN8N = async () => {
    if (!feedback) return;
    setIsSending(true);
    try {
      // Call our own backend proxy instead of n8n directly for security and reliability
      const webhookUrl = "http://localhost:3001/api/n8n/feedback";
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: params.id,
          feedback: feedback,
          timestamp: new Date().toISOString(),
          score: 84 // From the static state below
        }),
      });

      if (response.ok) {
        setSent(true);
        setFeedback("");
      } else {
        alert("Failed to send feedback to n8n. Make sure n8n is running and the webhook is active.");
      }
    } catch (err) {
      console.error("n8n Error:", err);
      alert("Error connecting to n8n.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="w-full border-b border-white/10 glassmorphism z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">IntervAI</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block mb-4 px-4 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
            Interview Completed
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">Senior Backend Engineer</h1>
          <p className="text-white/50">Session ID: {params.id || 'mock-123'} • Duration: 45m</p>
        </div>

        {/* Global Score */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-l-transparent rotate-45" />
            <div className="text-center">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">84</span>
              <span className="text-xl text-white/40 block">/ 100</span>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-white/80 max-w-2xl text-center">
            "Strong technical foundation and system design approach. However, there were signs of nervousness and excessive filler words during deep-dive questions."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Multi-Modal Breakdown */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" /> Intelligence Breakdown
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Technical Accuracy</span>
                  <span className="text-sm font-bold text-green-400">92%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Communication & Clarity</span>
                  <span className="text-sm font-bold text-yellow-400">71%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-[71%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Body Language (Vision)</span>
                  <span className="text-sm font-bold text-green-400">88%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 w-[88%]" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Key Insights</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80">Excellent use of the STAR method when explaining the Redis migration project.</p>
                </li>
                <li className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80">You spoke at 180 WPM during the architecture question. Try slowing down to 140 WPM for better clarity.</p>
                </li>
                <li className="flex gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80">Lost eye contact and looked away 14 times while explaining database sharding.</p>
                </li>
              </ul>
            </div>
            
            <button className="w-full mt-6 py-3 rounded-lg bg-primary/20 text-primary border border-primary/30 font-medium hover:bg-primary/30 transition-colors flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" /> Add to Training Roadmap
            </button>
          </div>
        </div>

        {/* n8n Feedback Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border border-white/10 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit className="w-24 h-24 text-primary" />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="p-2 rounded-lg bg-primary/20 text-primary">
                <Mic className="w-5 h-5" />
              </span>
              Custom AI Feedback (n8n Automation)
            </h3>
            <p className="text-white/60 mb-6 max-w-2xl">
              Want a deeper analysis? Send your session data to our n8n automation pipeline. 
              Our custom AI agents will review your transcript and provide a detailed improvement roadmap via email.
            </p>

            <div className="flex flex-col gap-4">
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What specific area would you like more feedback on? (e.g., 'My explanation of ACID properties')"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px]"
              />
              
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-white/40 italic">
                  * Powered by n8n Workflow Automation
                </div>
                <button 
                  onClick={sendFeedbackToN8N}
                  disabled={isSending || !feedback}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    sent ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  } disabled:opacity-50`}
                >
                  {isSending ? (
                    "Sending..."
                  ) : sent ? (
                    <><CheckCircle2 className="w-5 h-5" /> Feedback Sent!</>
                  ) : (
                    "Trigger n8n Workflow"
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
