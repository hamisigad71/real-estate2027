"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  timestamp: Date;
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Project Created",
      message: "Your new housing project has been created successfully.",
      type: "success",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: "2",
      title: "Budget Alert",
      message: "Project costs approaching budget limit. Review now.",
      type: "warning",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: "3",
      title: "System Update",
      message: "New features available in Home Configurator.",
      type: "info",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative group"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
          />
        )}
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
              className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-h-[500px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col origin-top-right translate-x-[calc(25%-1rem)] sm:translate-x-0"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-slate-50 to-white">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-500">{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-slate-900">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded-lg"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
                  <button className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors py-2 rounded-lg hover:bg-white">
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
