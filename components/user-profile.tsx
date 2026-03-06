"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "./auth-provider"
import { useToast } from "./toast-provider"
import { 
  User, Mail, Building2, Briefcase, Phone, MapPin, 
  X, Shield, Lock, Bell, Zap, CheckCircle2, 
  Clock, Settings, Layout, CreditCard, ChevronRight
} from "lucide-react"

interface UserProfileProps {
  onClose: () => void
  projectCount?: number
  completedCount?: number
  inProgressCount?: number
}

type TabType = "overview" | "professional" | "security"

export function UserProfile({ onClose, projectCount = 0, completedCount = 0, inProgressCount = 0 }: UserProfileProps) {
  const { user, updateProfile } = useAuth()
  const { showSuccess } = useToast()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isEditing, setIsEditing] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    organization: user?.organization || "",
    role: user?.role || "",
    phone: user?.phone || "",
    country: user?.country || "",
  })

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
    showSuccess("Profile updated successfully")
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      organization: user?.organization || "",
      role: user?.role || "",
      phone: user?.phone || "",
      country: user?.country || "",
    })
    setIsEditing(false)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 z-[100] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full h-full sm:h-auto sm:max-w-5xl bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header Section */}
        <div className="relative px-6 py-8 sm:px-10 text-white border-b border-white/5 overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("https://i.pinimg.com/736x/c7/dd/80/c7dd80f5482a2378668278c5e7f51648.jpg")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-900/90" />
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center sm:items-start gap-4">
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{user?.name || "User Account"}</h2>
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 drop-shadow-sm" />
                </div>
                <span className="w-fit mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full bg-[#7A3F91]/20 border border-[#C59DD9]/30 text-[10px] font-black uppercase tracking-widest text-[#C59DD9]">
                  Pro Architect
                </span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-slate-300 text-sm font-medium">
                <p className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-[#C59DD9]" />
                  {user?.email}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#C59DD9]" />
                  {user?.country || "Earth"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="h-10 w-10 p-0 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all order-first sm:order-last"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation & Content Area */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0 bg-slate-50">
          {/* Sidebar / Tabs Trigger */}
          <div className="w-full sm:w-64 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 p-2 sm:p-4 flex sm:flex-col overflow-x-auto sm:overflow-visible no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap sm:w-full sm:mb-1 ${
                    isActive 
                      ? "bg-[#F2EAF7] text-[#7A3F91] shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#7A3F91]" : "text-slate-400"}`} />
                  {tab.label}
                  {isActive && <ChevronRight className="hidden sm:block h-3.5 w-3.5 ml-auto opacity-50" />}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <StatCard icon={Zap} label="Active Projects" value={projectCount} iconBg="bg-[#F2EAF7]" iconColor="text-[#7A3F91]" />
                      <StatCard icon={CheckCircle2} label="Completed" value={completedCount} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                      <StatCard icon={Clock} label="In Progress" value={inProgressCount} iconBg="bg-amber-50" iconColor="text-amber-600" />
                    </div>

                    {/* Information Section */}
                    <SectionBox title="Personal Information" icon={User}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoItem label="Full Name" value={formData.name} />
                        <InfoItem label="Email" value={formData.email} />
                        <InfoItem label="Phone" value={formData.phone || "Not set"} />
                        <InfoItem label="Country" value={formData.country || "Not set"} />
                      </div>
                    </SectionBox>

                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl h-11 font-bold shadow-lg shadow-slate-900/10"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "professional" && (
                  <div className="space-y-6">
                    <SectionBox title="Professional Background" icon={Briefcase}>
                      <div className="grid grid-cols-1 gap-6">
                        <InfoItem label="Organization" value={formData.organization || "Independent Architect"} />
                        <InfoItem label="Current Role" value={formData.role || "Lead Designer"} />
                        <div className="p-4 bg-[#F2EAF7]/50 rounded-xl border border-[#C59DD9]/50">
                          <p className="text-xs font-bold text-[#7A3F91] uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Settings className="h-3.5 w-3.5" /> Professional Status
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            Your professional credentials allow you access to advanced architectural modeling and regulatory compliance tools.
                          </p>
                        </div>
                      </div>
                    </SectionBox>
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl h-11 font-bold"
                      >
                        Update Professional Info
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-4">
                    <SectionBox title="Security Settings" icon={Lock}>
                      <div className="space-y-4">
                        <SecurityRow 
                          icon={Lock} 
                          title="Account Password" 
                          desc="Recommended to change every 90 days" 
                        />
                        <SecurityRow 
                          icon={Bell} 
                          title="Global Notifications" 
                          desc="Email alerts for project status changes" 
                          isToggle
                        />
                        <SecurityRow 
                          icon={CreditCard} 
                          title="Billing & Plan" 
                          desc="Manage your Professional subscription" 
                        />
                      </div>
                    </SectionBox>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Edit Modal Overlay */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[110] bg-white flex flex-col pt-0 sm:pt-0"
            >
              <div className="p-4 sm:p-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm sticky top-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
                  <p className="text-xs text-slate-500">Update your account settings</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-2xl mx-auto space-y-8 pb-10">
                  <div className="space-y-5">
                    <p className="text-[10px] font-black text-[#7A3F91] uppercase tracking-[0.2em] px-1">Personal Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 ml-1">Full Name</Label>
                        <Input 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="rounded-xl border-slate-200 focus:ring-[#7A3F91] h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 ml-1">Email</Label>
                        <Input 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="rounded-xl border-slate-200 focus:ring-[#7A3F91] h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 ml-1">Phone</Label>
                        <Input 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="rounded-xl border-slate-200 focus:ring-[#7A3F91] h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 ml-1">Country</Label>
                        <Input 
                          value={formData.country} 
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="rounded-xl border-slate-200 focus:ring-[#7A3F91] h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black text-[#7A3F91] uppercase tracking-[0.2em] px-1">Professional Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 ml-1">Organization</Label>
                        <Input 
                          value={formData.organization} 
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          className="rounded-xl border-slate-200 focus:ring-[#7A3F91] h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 ml-1">Role</Label>
                        <Select 
                          value={formData.role} 
                          onValueChange={(val) => setFormData({...formData, role: val})}
                        >
                          <SelectTrigger className="rounded-xl border-slate-200 h-11">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Architect">Architect</SelectItem>
                            <SelectItem value="Urban Planner">Urban Planner</SelectItem>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Government">Government</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={handleCancel} className="font-bold text-slate-500">Cancel</Button>
                <Button 
                  onClick={handleSave}
                  className="bg-[#7A3F91] hover:bg-[#2B0D3E] text-white px-8 rounded-xl h-12 font-bold shadow-lg shadow-[#7A3F91]/20"
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// Helper Components
function StatCard({ icon: Icon, label, value, iconBg, iconColor }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  )
}

function SectionBox({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="p-1.5 bg-slate-50 rounded-lg">
          <Icon className="h-4 w-4 text-slate-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}

function SecurityRow({ icon: Icon, title, desc, isToggle }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-[#C59DD9] transition-colors">
          <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#7A3F91] transition-colors" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      {isToggle ? (
        <div className="w-10 h-6 bg-[#7A3F91] rounded-full flex items-center px-1">
          <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
        </div>
      ) : (
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600" />
      )}
    </div>
  )
}
