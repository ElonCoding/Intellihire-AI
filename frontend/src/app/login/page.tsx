"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-50 hover:opacity-80 transition-opacity">
        <BrainCircuit className="w-6 h-6 text-primary" />
        <span className="font-bold text-xl tracking-tight">IntervAI</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 glassmorphism relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p className="text-white/60 text-sm">
              {isLogin ? 'Enter your details to access your dashboard' : 'Start your journey to interview mastery'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button className="w-full py-3 px-4 flex items-center justify-center gap-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>
            <button className="w-full py-3 px-4 flex items-center justify-center gap-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative flex items-center py-4 mb-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/40 text-sm">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <div className="relative">
                <input type="email" placeholder="you@example.com" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                <Mail className="w-5 h-5 text-white/40 absolute left-4 top-3.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>

            <Link href="/dashboard" className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 transition-all mt-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </Link>
          </form>

          <p className="text-center text-sm text-white/60 mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-primary/80 font-medium transition-colors">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
