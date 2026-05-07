"use client";

import { motion } from "framer-motion";
import { BrainCircuit, LineChart, Target, Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user document to get name
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserName(userDoc.data().name || "User");
          } else {
            setUserName(user.displayName || "User");
          }
        } catch (e) {
          console.error("Error fetching user data", e);
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
      {/* Sidebar / Topbar */}
      <nav className="w-full border-b border-white/10 glassmorphism z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">IntervAI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-primary font-medium">Dashboard</Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white">Analytics</Link>
            <Link href="/profile" className="text-sm text-white/60 hover:text-white">Profile</Link>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-medium uppercase">
              {userName.substring(0, 2)}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userName.split(' ')[0]}</h1>
            <p className="text-white/60 mt-1">Here is your interview readiness overview.</p>
          </div>
          <Link href="/resume-upload" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <Target className="w-4 h-4" /> Upload Resume to Start
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <LineChart className="w-16 h-16 text-primary" />
            </div>
            <p className="text-sm text-white/60 mb-2 relative z-10">Readiness Score</p>
            <h2 className="text-4xl font-bold text-white relative z-10">72%</h2>
            <p className="text-sm text-green-400 mt-2 flex items-center gap-1 relative z-10"><ArrowUpRight className="w-4 h-4" /> +5% this week</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <Calendar className="w-16 h-16 text-purple-500" />
            </div>
            <p className="text-sm text-white/60 mb-2 relative z-10">Interviews Completed</p>
            <h2 className="text-4xl font-bold text-white relative z-10">14</h2>
            <p className="text-sm text-white/40 mt-2 relative z-10">Last session: 2 days ago</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
              <Clock className="w-16 h-16 text-yellow-500" />
            </div>
            <p className="text-sm text-white/60 mb-2 relative z-10">Practice Time</p>
            <h2 className="text-4xl font-bold text-white relative z-10">8h 45m</h2>
            <p className="text-sm text-white/40 mt-2 relative z-10">Total speaking time</p>
          </motion.div>
        </div>

        {/* Action & History Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Recommended Plan</h3>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">1</div>
                    <div>
                      <p className="font-medium">System Design Basics</p>
                      <p className="text-sm text-white/50">Your technical score was low in this area.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors">Practice</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">2</div>
                    <div>
                      <p className="font-medium">Reduce Filler Words</p>
                      <p className="text-sm text-white/50">You used 'um' 45 times in your last interview.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors">Practice</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors">
                  <div>
                    <p className="font-medium text-sm">FAANG Technical Round</p>
                    <p className="text-xs text-white/50 mt-1">Oct {14 - i}, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-400">8{9 - i}%</p>
                    <p className="text-xs text-white/50 mt-1">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
