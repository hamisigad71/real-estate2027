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
  "Optimizing Layout Assets...",
];

/* ── Animated SVG ring component ─────────────────────────────── */
function OrbitalRing({
  radius,
  duration,
  reverse = false,
  dotCount = 3,
  color = "#7A3F91",
  opacity = 0.4,
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  dotCount?: number;
  color?: string;
  opacity?: number;
}) {
  const size = radius * 2 + 4;
  const cx = size / 2;
  const cy = size / 2;
  const dots = Array.from({ length: dotCount });
  const round = (n: number, decimals = 6) => Number(n.toFixed(decimals));

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: `spin${reverse ? "Rev" : ""} ${duration}s linear infinite`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        {/* Track circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeOpacity={0.08}
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        {/* Moving dots */}
        {dots.map((_, i) => {
          const angle = (i / dotCount) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = cx + radius * Math.cos(rad);
          const y = cy + radius * Math.sin(rad);
          const xR = round(x);
          const yR = round(y);
          return (
            <circle
              key={i}
              cx={xR}
              cy={yR}
              r={i === 0 ? 2.5 : 1.5}
              fill={color}
              opacity={i === 0 ? opacity : opacity * 0.4}
            />
          );
        })}
        {/* Arc segment */}
        <path
          d={describeArc(cx, cy, radius, 0, 80)}
          stroke={color}
          strokeOpacity={opacity * 0.6}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function describeArc(
  x: number,
  y: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, r, endAngle);
  const end = polarToCartesian(x, y, r, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  // Round coordinates to reduce tiny server/client floating-point differences that
  // can trigger React hydration warnings.
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  return { x: Number(x.toFixed(6)), y: Number(y.toFixed(6)) };
}

/* ── Animated scan line ───────────────────────────────────────── */
function ScanLine() {
  return (
    <div
      className="absolute left-0 w-full pointer-events-none overflow-hidden"
      style={{ top: 0, height: "100%", borderRadius: "inherit" }}
    >
      <div
        className="absolute left-0 w-full"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #7A3F91 40%, #C59DD9 60%, transparent 100%)",
          opacity: 0.5,
          animation: "scanY 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
          boxShadow: "0 0 12px 2px rgba(122,63,145,0.4)",
        }}
      />
    </div>
  );
}

/* ── Corner accent SVG ────────────────────────────────────────── */
function CornerAccents() {
  const corners = [
    { top: 20, left: 20, rotate: 0 },
    { top: 20, right: 20, rotate: 90 },
    { bottom: 20, right: 20, rotate: 180 },
    { bottom: 20, left: 20, rotate: 270 },
  ] as const;

  return (
    <>
      {corners.map((pos, i) => {
        const { rotate, ...cornerStyle } = pos;
        return (
        <div
          key={i}
          className="absolute"
          style={{
              ...cornerStyle,
            width: 20,
            height: 20,
            opacity: 0.35,
            animation: `cornerPulse 2s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d={`M 0 12 L 0 0 L 12 0`}
              stroke="#7A3F91"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
                style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "10px 10px" }}
            />
          </svg>
        </div>
        );
      })}
    </>
  );
}

/* ── Segmented progress bar ─────────────────────────────────────── */
function SegmentedBar({ progress }: { progress: number }) {
  const segments = 20;
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: segments }).map((_, i) => {
        const filled = (i / segments) * 100 < progress;
        const active = Math.floor((progress / 100) * segments) === i;
        return (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full transition-all duration-200"
            style={{
              background: filled
                ? active
                  ? "#C59DD9"
                  : "#7A3F91"
                : "rgba(122,63,145,0.1)",
              opacity: filled ? 1 : 0.5,
              boxShadow: active ? "0 0 6px rgba(197,157,217,0.8)" : "none",
              animationDelay: `${i * 40}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
export function GlassLoader({
  fullScreen = true,
  message: initialMessage,
}: GlassLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = initialMessage
    ? [initialMessage, ...PROFESSIONAL_MESSAGES]
    : PROFESSIONAL_MESSAGES;
  const messageCycleLength = messages.length;

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((p) => (p + 1) % messageCycleLength);
    }, 2200);

    let current = 0;
    const targets = [22, 47, 61, 78, 90, 97, 100];
    let ti = 0;
    const progressInterval = setInterval(() => {
      if (ti >= targets.length) {
        clearInterval(progressInterval);
        return;
      }
      const target = targets[ti];
      if (current < target) {
        current = Math.min(current + 1, target);
        setProgress(current);
        if (current === target) ti++;
      }
    }, 40);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [messageCycleLength]);

  const currentMessage = messages[msgIndex % messages.length];

  /* ── Inner loader content ─────────────────────────────── */
  const loaderContent = (
    <div className="relative flex flex-col items-center gap-8 w-full max-w-[min(100%,320px)]">
      {/* Centered logo + orbital rings */}
      <div className="relative mx-auto shrink-0" style={{ width: 120, height: 120 }}>
        <OrbitalRing radius={52} duration={6} dotCount={1} opacity={0.7} color="#7A3F91" />
        <OrbitalRing radius={62} duration={10} reverse dotCount={2} opacity={0.4} color="#C59DD9" />
        <OrbitalRing radius={72} duration={16} dotCount={3} opacity={0.25} color="#7A3F91" />

        <div
          className="absolute rounded-full"
            style={{
              inset: -8,
            background: "radial-gradient(circle, rgba(122,63,145,0.12) 0%, transparent 70%)",
              animation: "glowPulse 2s ease-in-out infinite",
            }}
          />

          <div
          className="absolute inset-0 rounded-4xl flex items-center justify-center overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid rgba(122,63,145,0.12)",
            boxShadow: "0 16px 48px rgba(43,13,62,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset",
            }}
          >
            <ScanLine />
            <Logo size={56} className="relative z-10" />
            <div
              className="absolute inset-0"
              style={{
              background: "radial-gradient(circle at 50% 30%, rgba(122,63,145,0.05) 0%, transparent 70%)",
                animation: "subtlePulse 3s ease-in-out infinite",
              }}
            />
        </div>
      </div>

      {/* ── Progress section ─────────────────────────────── */}
      <div className="w-full space-y-3">
        {/* Segmented bar */}
        <SegmentedBar progress={progress} />

        {/* Progress percentage + phase */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentMessage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="text-[9px] font-black uppercase tracking-[0.22em]"
              style={{ color: "#2B0D3E" }}
            >
              {currentMessage}
            </motion.span>
          </AnimatePresence>
          <motion.span
            className="text-[10px] font-black tabular-nums"
            style={{ color: "#7A3F91", fontVariantNumeric: "tabular-nums" }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {progress.toString().padStart(3, "0")}%
          </motion.span>
        </div>

        {/* Thin shimmer line */}
        <div
          className="w-full relative overflow-hidden"
          style={{ height: 1, background: "rgba(122,63,145,0.08)" }}
        >
          <div
            className="absolute h-full"
            style={{
              width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(122,63,145,0.5), transparent)",
              animation: "shimmer 1.8s linear infinite",
            }}
          />
        </div>
      </div>

      {/* ── Footer status row ────────────────────────────── */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Animated status dot */}
          <div className="relative w-2 h-2">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "#7A3F91", animation: "dotPulse 1.5s ease-in-out infinite" }}
            />
            <div
              className="absolute -inset-1 rounded-full"
              style={{ background: "rgba(122,63,145,0.2)", animation: "dotRipple 1.5s ease-in-out infinite" }}
            />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(43,13,62,0.4)" }}>
            System Integrity: Stable
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === 1 ? 6 : 4,
                height: i === 1 ? 6 : 4,
                background: "#C59DD9",
                opacity: 0.5,
                animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* All keyframes */}
      <style>{`
        @keyframes spinRev  { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes spin     { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes scanY    { 0% { top: -2px; opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes glowPulse  { 0%,100% { opacity: 0.6; transform: scale(1); }   50% { opacity: 1; transform: scale(1.05); } }
        @keyframes subtlePulse{ 0%,100% { opacity: 0.6; }  50% { opacity: 1; } }
        @keyframes shimmer    { from { left: -40%; } to { left: 140%; } }
        @keyframes dotPulse   { 0%,100% { transform: scale(1); opacity: 1; }   50% { transform: scale(0.7); opacity: 0.6; } }
        @keyframes dotRipple  { 0%,100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.8); opacity: 0; } }
        @keyframes dotBounce  { 0%,100% { transform: translateY(0); }  50% { transform: translateY(-4px); } }
        @keyframes cornerPulse{ 0%,100% { opacity: 0.3; }  50% { opacity: 0.7; } }
      `}</style>
    </div>
  );

  /* ── Full screen variant ──────────────────────────────── */
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Ambient blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-10%",
            right: "-5%",
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(122,63,145,0.06) 0%, transparent 70%)",
            animation: "glowPulse 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-10%",
            left: "-5%",
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(197,157,217,0.08) 0%, transparent 70%)",
            animation: "glowPulse 8s ease-in-out 2s infinite",
          }}
        />

        {/* Main glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{
            padding: "48px 52px",
            borderRadius: 36,
            background: "rgba(255,255,255,0.72)",
            border: "1.5px solid rgba(255,255,255,0.9)",
            boxShadow: "0 32px 80px rgba(43,13,62,0.08), 0 8px 24px rgba(43,13,62,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(16px)",
          }}
        >
          <CornerAccents />
          <div className="relative z-10">{loaderContent}</div>
        </motion.div>

        {/* Brand watermark */}
        <div className="absolute bottom-8 left-8 flex items-center gap-2" style={{ opacity: 0.12 }}>
          <Logo size={18} />
          <span className="text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: "#2B0D3E" }}>
            RHS Engine
          </span>
        </div>

        {/* Version tag */}
        <div
          className="absolute bottom-8 right-8 text-[8px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "rgba(43,13,62,0.15)" }}
        >
          Protocol 4.1 · Stable
        </div>
      </div>
    );
  }

  /* ── Inline variant ───────────────────────────────────── */
  return (
    <div className="w-full flex items-center justify-center min-h-[400px] p-8">
      <div
        className="relative"
        style={{
          padding: "48px 52px",
          borderRadius: 36,
          background: "rgba(242,234,247,0.4)",
          border: "1.5px solid rgba(122,63,145,0.08)",
          boxShadow: "0 8px 32px rgba(43,13,62,0.06)",
        }}
      >
        <CornerAccents />
        <div className="relative z-10">{loaderContent}</div>
      </div>
    </div>
  );
}
