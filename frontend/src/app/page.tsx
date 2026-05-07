"use client";

import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Mic, BarChart3, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="w-full border-b border-white/10 glassmorphism z-50 fixed top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">IntervAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#demo" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Interview Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6"
          >
            Master your interviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Adaptive AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mb-10"
          >
            Not just a chatbot. A fully immersive interview simulation that evaluates your technical knowledge, body language, and communication under pressure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/dashboard" className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all flex items-center gap-2 text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium transition-all flex items-center gap-2 text-lg">
              View Demo
            </Link>
          </motion.div>

          {/* Abstract UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl relative"
          >
            {/* Fake Mac Header */}
            <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fake Video Box */}
              <div className="col-span-2 aspect-video bg-white/5 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                 <Mic className="w-12 h-12 text-white/20 z-0" />
                 <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                     <BrainCircuit className="w-5 h-5 text-white" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-white">AI Interviewer</p>
                     <p className="text-xs text-white/50">Analyzing response...</p>
                   </div>
                 </div>
                 <div className="absolute right-4 top-4 z-20 px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                 </div>
              </div>

              {/* Fake Real-time Stats */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Confidence Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-green-400">87%</span>
                    <BarChart3 className="w-5 h-5 text-green-400 mb-1.5" />
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-green-400 w-[87%]" />
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex-grow">
                  <p className="text-xs text-white/50 mb-3">Live Feedback</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-white/80 leading-tight">Good explanation of the STAR method.</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      </div>
                      <p className="text-white/80 leading-tight">Try to maintain eye contact with the camera.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Features section can be added here */}
    </div>
  );
}
