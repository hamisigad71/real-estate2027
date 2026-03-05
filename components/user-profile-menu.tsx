"use client";

import { useState } from "react";
import { User, Settings, BarChart3, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User as UserType } from "@/lib/types";

interface UserProfileMenuProps {
  user: UserType | null;
  onLogout: () => void;
  onEditProfile?: () => void;
  onSettings?: () => void;
  onAnalytics?: () => void;
}

export function UserProfileMenu({ user, onLogout, onEditProfile, onSettings, onAnalytics }: UserProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "Government Planner":
        return "🏛️";
      case "NGO Manager":
        return "🤝";
      case "Real Estate Developer":
        return "🏢";
      case "Architect":
        return "🏗️";
      case "Consultant":
        return "📊";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "Government Planner":
        return "from-blue-500 to-blue-600";
      case "NGO Manager":
        return "from-emerald-500 to-emerald-600";
      case "Real Estate Developer":
        return "from-purple-500 to-purple-600";
      case "Architect":
        return "from-orange-500 to-orange-600";
      case "Consultant":
        return "from-indigo-500 to-indigo-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-all group"
      >
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(user?.role)} flex items-center justify-center text-white text-sm font-semibold`}>
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-xs font-medium text-slate-700 leading-none">{user?.name || "User"}</span>
          <span className="text-[10px] text-slate-500 leading-none">{user?.role || "User"}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden"
            >
              {/* User Info Section */}
              <div className={`px-6 py-5 bg-gradient-to-r ${getRoleColor(user?.role)} text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    {getRoleIcon(user?.role)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{user?.name || "User"}</h3>
                    <p className="text-xs text-white/70">{user?.role || "User"}</p>
                    {user?.organization && (
                      <p className="text-xs text-white/60 mt-1">{user.organization}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 border-b border-slate-100 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900">--</p>
                  <p className="text-[10px] text-slate-500 mt-1">Projects</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900">--</p>
                  <p className="text-[10px] text-slate-500 mt-1">Scenarios</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900">--</p>
                  <p className="text-[10px] text-slate-500 mt-1">Documents</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-3 space-y-1">
                <button 
                  onClick={() => {
                    onEditProfile?.();
                    setIsOpen(false);
                  }}
                  className="w-full px-6 py-3 text-left flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                >
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-xs text-slate-500">Update your information</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    onSettings?.();
                    setIsOpen(false);
                  }}
                  className="w-full px-6 py-3 text-left flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                >
                  <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <Settings className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-slate-500">Preferences & security</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    onAnalytics?.();
                    setIsOpen(false);
                  }}
                  className="w-full px-6 py-3 text-left flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                >
                  <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Usage & Analytics</p>
                    <p className="text-xs text-slate-500">View your activity</p>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Logout */}
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full px-6 py-4 text-left flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
              >
                <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-xs text-red-500">Log out from your account</p>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
