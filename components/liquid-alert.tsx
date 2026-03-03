"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, X, CheckCircle2 } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface LiquidAlertProps extends Toast {
  onClose: (id: string) => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    gradient: "from-emerald-400 to-teal-500",
    ring: "ring-emerald-200/60",
    bg: "bg-white/95 dark:bg-slate-900/95",
    title: "Success",
    bar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-slate-900 dark:text-slate-50",
    messageColor: "text-slate-600 dark:text-slate-300",
  },
  error: {
    icon: AlertCircle,
    gradient: "from-rose-400 to-red-500",
    ring: "ring-rose-200/60",
    bg: "bg-white/95 dark:bg-slate-900/95",
    title: "Attention",
    bar: "bg-gradient-to-r from-rose-400 to-red-500",
    iconBg: "bg-rose-50 dark:bg-rose-950/60",
    iconColor: "text-rose-600 dark:text-rose-400",
    titleColor: "text-slate-900 dark:text-slate-50",
    messageColor: "text-slate-600 dark:text-slate-300",
  },
  info: {
    icon: Info,
    gradient: "from-blue-400 to-indigo-500",
    ring: "ring-blue-200/60",
    bg: "bg-white/95 dark:bg-slate-900/95",
    title: "Notice",
    bar: "bg-gradient-to-r from-blue-400 to-indigo-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-slate-900 dark:text-slate-50",
    messageColor: "text-slate-600 dark:text-slate-300",
  },
};

function LiquidAlert({ id, message, type, duration = 5000, onClose }: LiquidAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: -10 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="pointer-events-auto w-full"
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl shadow-2xl
          ${config.bg} backdrop-blur-2xl
          ring-1 ${config.ring}
          w-[420px] max-w-[90vw]
        `}
      >
        {/* Coloured top stripe */}
        <div className={`h-1 w-full bg-gradient-to-r ${config.gradient}`} />

        <div className="flex items-start gap-4 px-5 py-4">
          {/* Icon */}
          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
            <motion.div
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 400 }}
            >
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </motion.div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`text-sm font-semibold tracking-tight ${config.titleColor}`}>
              {config.title}
            </p>
            <p className={`mt-0.5 text-sm leading-snug ${config.messageColor}`}>
              {message}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={() => onClose(id)}
            className="mt-0.5 shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Liquid progress bar */}
        <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`h-full ${config.bar}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function LiquidAlertContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    /* Centred horizontally, sits near top-centre of the viewport */
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[9999] flex justify-center px-4">
      <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <LiquidAlert key={toast.id} {...toast} onClose={onRemove} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
