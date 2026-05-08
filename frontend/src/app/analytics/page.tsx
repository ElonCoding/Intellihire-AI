"use client";

import { motion } from "framer-motion";
import { 
  BarChart, LineChart, PieChart, Activity, 
  BrainCircuit, TrendingUp, AlertTriangle, 
  CheckCircle, Target, FileText
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("resume");
  const [userName, setUserName] = useState("Guest");
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user doc for name
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) setUserName(userDoc.data().name || "User");
          else setUserName(user.displayName || "User");

          // Fetch resume data
          const resumeDoc = await getDoc(doc(db, "users", user.uid, "data", "resume"));
          if (resumeDoc.exists()) {
            setResumeData(resumeDoc.data());
          } else {
            // Check local storage as fallback
            const localResume = localStorage.getItem('resumeAnalysis');
            if (localResume) setResumeData(JSON.parse(localResume));
          }
        } catch (e) {
          console.error("Error fetching data", e);
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="w-full border-b border-white/10 glassmorphism z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">IntervAI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">Dashboard</Link>
            <Link href="/analytics" className="text-sm text-primary font-medium">Analytics</Link>
            <Link href="/profile" className="text-sm text-white/60 hover:text-white">Profile</Link>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-medium uppercase">
              {userName.substring(0, 2)}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Intelligence Dashboard</h1>
          <p className="text-white/60">Comprehensive insights into your career readiness.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: "resume", label: "Resume Intelligence", icon: <FileText className="w-4 h-4" /> },
            { id: "growth", label: "Career Growth", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "insights", label: "AI Insights", icon: <BrainCircuit className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "resume" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumeData ? (
                <>
                  <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                    <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">ATS Score</h3>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-5xl font-bold">{resumeData.atsScore || 0}</span>
                      <span className="text-white/40 mb-1">/100</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${resumeData.atsScore || 0}%` }} />
                    </div>
                    <p className="text-xs text-white/50 mt-4">{resumeData.summary}</p>
                  </div>

                  <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">Extracted Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills?.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                      <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Resume Weaknesses</h3>
                      <ul className="space-y-3">
                        {resumeData.weaknesses?.map((w: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                      <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Strong Points</h3>
                      <ul className="space-y-3">
                        {resumeData.strengths?.map((s: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-1 md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                  <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Resume Found</h3>
                  <p className="text-white/60 mb-6">Upload your resume to unlock your personalized intelligence dashboard.</p>
                  <Link href="/resume-upload" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                    Upload Resume
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "growth" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Placement Readiness", val: "78%", trend: "+5%", icon: <Target className="w-5 h-5 text-purple-400" /> },
                  { label: "Confidence Score", val: "85/100", trend: "+12%", icon: <Activity className="w-5 h-5 text-green-400" /> },
                  { label: "Communication", val: "B+", trend: "Steady", icon: <BrainCircuit className="w-5 h-5 text-blue-400" /> },
                  { label: "Tech Growth", val: "92%", trend: "+8%", icon: <BarChart className="w-5 h-5 text-yellow-400" /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
                      <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{stat.trend}</span>
                    </div>
                    <p className="text-white/50 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-80 flex flex-col justify-center items-center text-white/40">
                 <LineChart className="w-12 h-12 mb-4 opacity-50" />
                 <p>Interactive Growth Chart Visualization</p>
                 <p className="text-xs mt-2">(Requires Recharts or similar chart library)</p>
              </div>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" /> Most Repeated Mistakes</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <p className="font-medium text-sm text-white/90">Saying "I think" instead of "I know/I did"</p>
                    <p className="text-xs text-white/50 mt-1">Found 14 times across 3 interviews.</p>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <p className="font-medium text-sm text-white/90">Rushing through System Design constraints</p>
                    <p className="text-xs text-white/50 mt-1">You often skip requirement gathering.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Strongest Attributes</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <p className="font-medium text-sm text-white/90">Behavioral STAR Format</p>
                    <p className="text-xs text-white/50 mt-1">Consistently excellent structuring of past experiences.</p>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <p className="font-medium text-sm text-white/90">Frontend Architecture</p>
                    <p className="text-xs text-white/50 mt-1">Deep knowledge demonstrated in state management.</p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-purple-500/10 to-primary/10 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Anxiety & Speaking Analysis</h3>
                  <p className="text-sm text-white/60 max-w-xl">
                    Your speaking pace increases by 20% when asked about Database Indexing. Take a deep breath before answering complex backend questions. Overall tone is confident and professional.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                   <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
