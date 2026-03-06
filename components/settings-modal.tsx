"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Palette,
  Volume2,
  Eye,
  Download,
  Trash2
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    budgetAlerts: true,
    systemUpdates: false,
    emailNotifications: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    dataSharing: false,
    analytics: true,
  });

  const handleSave = () => {
    // Save settings logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#7A3F91]" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#7A3F91]" />
              Appearance
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-sm">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7A3F91]" />
              Notifications
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="project-updates" className="text-sm">Project Updates</Label>
                <Switch
                  id="project-updates"
                  checked={notifications.projectUpdates}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications(prev => ({ ...prev, projectUpdates: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="budget-alerts" className="text-sm">Budget Alerts</Label>
                <Switch
                  id="budget-alerts"
                  checked={notifications.budgetAlerts}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications(prev => ({ ...prev, budgetAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-updates" className="text-sm">System Updates</Label>
                <Switch
                  id="system-updates"
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language & Region */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7A3F91]" />
              Language & Region
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="text-sm">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Privacy & Security */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#7A3F91]" />
              Privacy & Security
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-visibility" className="text-sm">Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value) =>
                    setPrivacy(prev => ({ ...prev, profileVisibility: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="data-sharing" className="text-sm">Data Sharing</Label>
                <Switch
                  id="data-sharing"
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked: boolean) =>
                    setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="text-sm">Analytics</Label>
                <Switch
                  id="analytics"
                  checked={privacy.analytics}
                  onCheckedChange={(checked: boolean) =>
                    setPrivacy(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-[#7A3F91]" />
              Data Management
            </h3>
            <div className="space-y-3 pl-6">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#7A3F91] hover:bg-[#2B0D3E] shadow-lg shadow-[#7A3F91]/20">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
