"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "./logo";
import { motion, AnimatePresence } from "framer-motion";

interface GlassLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const PROFESSIONAL_MESSAGES = [
  "Initializing Workspace...",
  "Running Structural Audit...",
  "Calibrating Volumetric Data...",
  "Rendering Design Layers...",
  "Syncing Architectural Engine...",
  "Optimizing Layout Assets..."
];

export function GlassLoader({
  fullScreen = true,
  message: initialMessage,
}: GlassLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % PROFESSIONAL_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const messages = initialMessage 
    ? [initialMessage, ...PROFESSIONAL_MESSAGES] 
    : PROFESSIONAL_MESSAGES;

  const currentMessage = messages[msgIndex % messages.length];

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-10">
      {/* Premium Logo Focal Point */}
      <div className="relative group">
        {/* Outer orbital rings - high speed, very thin */}
        <div className="absolute -inset-8 rounded-full border border-[#7A3F91]/5 border-t-[#7A3F91]/30 animate-spin" style={{ animationDuration: '2s' }} />
        <div className="absolute -inset-10 rounded-full border border-dashed border-[#C59DD9]/10 animate-spin" style={{ animationDuration: '8s' }} />
        
        {/* Main Logo Container */}
        <div className="relative w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(122,63,145,0.1)] border border-white/80 overflow-hidden">
          {/* Internal Scanner Effect - Sharp Line */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7A3F91]/20 to-transparent w-full h-[30%] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ animation: 'scan 2s ease-in-out infinite' }}
          />
          <div 
            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7A3F91]/40 to-transparent"
            style={{ animation: 'scan 2s ease-in-out infinite' }}
          />
          
          <Logo size={64} className="relative z-10" />
          
          {/* Subtle pulsate glow */}
          <div className="absolute inset-0 bg-[#7A3F91]/5 animate-pulse" />
        </div>
      </div>

      {/* Dynamic Status Messaging */}
      <div className="text-center w-72 h-16 flex flex-col items-center justify-start gap-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[10px] font-black text-[#2B0D3E] uppercase tracking-[0.4em] font-rethink"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
        
        {/* Progress Bar - Minimalist Line */}
        <div className="w-48 h-[1px] bg-slate-100 overflow-hidden relative">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7A3F91]/60 to-transparent w-full h-full"
            style={{ animation: 'progress 2s linear infinite' }}
          />
        </div>
        
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">
          System Integrity: Stable · Protocol 4.1
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        @keyframes progress {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 w-full h-screen flex items-center justify-center bg-white/40 backdrop-blur-2xl">
        {/* High-end backdrop elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7A3F91]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C59DD9]/5 rounded-full blur-[100px]" />

        <div className="relative p-16 rounded-[4rem] bg-white/40 border border-white/60 shadow-[0_32px_80px_rgba(43,13,62,0.06)] backdrop-blur-md">
          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-[#7A3F91]/20 rounded-tl-xl" />
          <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-[#7A3F91]/20 rounded-br-xl" />
          
          <div className="relative z-10">{loaderContent}</div>
        </div>

        {/* Brand Watermark */}
        <div className="absolute bottom-10 left-10 opacity-10 flex items-center gap-2 grayscale">
          <Logo size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#2B0D3E]">RHS Engine System</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center min-h-[500px] p-8">
      <div className="p-16 rounded-[4rem] bg-slate-50 border border-slate-100/50 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7A3F91]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">{loaderContent}</div>
      </div>
    </div>
  );
}
