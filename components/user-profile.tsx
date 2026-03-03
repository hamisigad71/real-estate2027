"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "./auth-provider"
import { useToast } from "./toast-provider"
import { User, Mail, Building2, Briefcase, Phone, MapPin, Calendar, X, Shield, Lock, Bell, Zap, CheckCircle2, Clock } from "lucide-react"

interface UserProfileProps {
  onClose: () => void
  projectCount?: number
  completedCount?: number
  inProgressCount?: number
}

export function UserProfile({ onClose, projectCount = 0, completedCount = 0, inProgressCount = 0 }: UserProfileProps) {
  const { user, updateProfile } = useAuth()
  const { showSuccess } = useToast()
  const [editing, setEditing] = useState(false)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [organization, setOrganization] = useState(user?.organization || "")
  const [role, setRole] = useState(user?.role || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [country, setCountry] = useState(user?.country || "")

  const handleSave = () => {
    updateProfile({
      name,
      email,
      organization,
      role,
      phone,
      country,
    })
    setEditing(false)
    showSuccess("Your profile has been updated successfully.")
  }

  const handleCancel = () => {
    setName(user?.name || "")
    setEmail(user?.email || "")
    setOrganization(user?.organization || "")
    setRole(user?.role || "")
    setPhone(user?.phone || "")
    setCountry(user?.country || "")
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto pt-8 sm:pt-16">
      <Card className="w-full max-w-4xl shadow-2xl overflow-hidden border-0 mt-8 mb-8">
        {/* Header with gradient background */}
        <div className="relative h-32 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20 blur-3xl" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute top-4 right-4 h-8 w-8 bg-white/20 hover:bg-white/30 text-white z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-0">
          {/* Profile Hero Section */}
          <div className="relative px-6 sm:px-8 py-8 bg-white border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 gap-4">
              {/* Avatar */}
              <div className="relative -mt-20 flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{user?.name || "User"}</h2>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {user?.role || "Not specified"}
                    </p>
                  </div>
                  {!editing && (
                    <Button 
                      onClick={() => setEditing(true)} 
                      className="bg-blue-900 hover:bg-blue-800 text-white w-full sm:w-auto"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  Active Member • Verified Account
                </p>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          {!editing && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 sm:px-8 py-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-b border-slate-100">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mx-auto mb-2">
                  <Zap className="h-5 w-5 text-blue-700" />
                </div>
                <p className="text-sm text-slate-600">Projects</p>
                <p className="text-xl font-bold text-slate-900">{projectCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mx-auto mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-700" />
                </div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-xl font-bold text-slate-900">{completedCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 mx-auto mb-2">
                  <Clock className="h-5 w-5 text-orange-700" />
                </div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-xl font-bold text-slate-900">{inProgressCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mx-auto mb-2">
                  <Briefcase className="h-5 w-5 text-purple-700" />
                </div>
                <p className="text-sm text-slate-600">Account</p>
                <p className="text-xl font-bold text-slate-900">Pro</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            {editing ? (
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-700" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          id="edit-name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="pl-10 border-slate-200 focus:border-blue-500" 
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email" className="text-sm font-medium">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="edit-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-slate-200 focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="edit-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 border-slate-200 focus:border-blue-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-country" className="text-sm font-medium">Country</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="edit-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="pl-10 border-slate-200 focus:border-blue-500"
                          placeholder="Kenya"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-700" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
                    <div className="space-y-2">
                      <Label htmlFor="edit-organization" className="text-sm font-medium">Organization</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="edit-organization"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="pl-10 border-slate-200 focus:border-blue-500"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-role" className="text-sm font-medium">Professional Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="edit-role" className="border-slate-200 focus:border-blue-500">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Government Planner">Government Planner</SelectItem>
                          <SelectItem value="NGO Manager">NGO Manager</SelectItem>
                          <SelectItem value="Real Estate Developer">Real Estate Developer</SelectItem>
                          <SelectItem value="Architect">Architect</SelectItem>
                          <SelectItem value="Urban Planner">Urban Planner</SelectItem>
                          <SelectItem value="Project Manager">Project Manager</SelectItem>
                          <SelectItem value="Consultant">Consultant</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-6 border-t border-slate-200">
                  <Button 
                    onClick={handleSave} 
                    className="bg-blue-900 hover:bg-blue-800 text-white flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-700" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-7 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-sm font-medium text-slate-900">{user?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="text-sm font-medium text-slate-900">{user?.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone Number</p>
                      <p className="text-sm font-medium text-slate-900">{user?.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Country</p>
                      <p className="text-sm font-medium text-slate-900">{user?.country || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-700" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-7 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Organization</p>
                      <p className="text-sm font-medium text-slate-900">{user?.organization || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Professional Role</p>
                      <p className="text-sm font-medium text-slate-900">{user?.role || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-700" />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-7 bg-green-50/50 p-4 rounded-lg border border-green-100">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Member Since</p>
                      <p className="text-sm font-medium text-slate-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Account Status</p>
                      <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Active & Verified
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security & Preferences */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-700" />
                    Security & Preferences
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Password</p>
                          <p className="text-xs text-slate-500">Last changed 90 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Notifications</p>
                          <p className="text-xs text-slate-500">Email notifications enabled</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
