"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";
import { projectStorage, scenarioStorage } from "@/lib/storage";
import type { Project, Scenario } from "@/lib/types";
import {
  Plus,
  FolderOpen,
  MapPin,
  Calendar,
  LogOut,
  User,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Menu,
  X,
  Home as HomeIcon,
  Lightbulb,
  Layout,
  Leaf,
  Sparkles,
  Bell,
  Building2
} from "lucide-react";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectCard } from "./project-card";
import { UserProfile } from "./user-profile";
import { GetStartedGuide } from "./get-started-guide";
import { NotificationBell } from "./notification-bell";
import { UserProfileMenu } from "./user-profile-menu";
import { SettingsModal } from "./settings-modal";
import { AnalyticsModal } from "./analytics-modal";

export function ProjectsDashboard() {
  const { user, logout } = useAuth();
  const { showSuccess, showInfo } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = () => {
    if (!user) return;
    const allProjects = projectStorage.getAll();
    const userProjects = allProjects.filter(
      (p: Project) => p.userId === user.id
    );
    setProjects(userProjects);
  };

  const stats = useMemo(() => {
    let totalUnits = 0;
    let totalPeopleHoused = 0;
    let totalBudget = 0;
    let scenarioCount = 0;

    projects.forEach((project) => {
      const scenarios = scenarioStorage.getByProjectId(project.id);
      scenarios.forEach((scenario: Scenario) => {
        if (scenario.calculatedResults) {
          scenarioCount++;
          totalUnits += scenario.calculatedResults.totalUnits || 0;
          totalPeopleHoused +=
            scenario.calculatedResults.estimatedPopulation || 0;
          totalBudget += scenario.calculatedResults.totalProjectCost || 0;
        }
      });
    });

    return {
      totalUnits,
      totalPeopleHoused,
      totalBudget,
      scenarioCount,
      avgUnitsPerProject:
        projects.length > 0 ? Math.round(totalUnits / projects.length) : 0,
    };
  }, [projects]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [projects]);

  const handleProjectCreated = () => {
    loadProjects();
    setShowCreateDialog(false);
  };

  const handleProjectDeleted = (projectId: string) => {
    projectStorage.delete(projectId);
    // Immediately update state by filtering out the deleted project
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
    showSuccess("Project deleted successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 w-full transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.href = "/"}>
              <div className="w-10 h-10 rounded-xl bg-[#7A3F91] flex items-center justify-center text-white shadow-lg shadow-[#7A3F91]/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight font-rethink">
                  StudioConfig.
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                  Architectural Engine
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-1.5 bg-slate-50/50 p-1 rounded-full border border-slate-200/60 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = "/home-configurator")}
                  className="px-5 py-2 h-auto text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-[#7A3F91] hover:bg-white hover:shadow-sm rounded-full transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#F2EAF7] flex items-center justify-center text-[#7A3F91] group-hover:bg-[#7A3F91] group-hover:text-white transition-colors duration-300">
                    <HomeIcon className="h-3 w-3" />
                  </div>
                  Home Configurator
                </Button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <Button
                  variant="ghost"
                  onClick={() => setShowProfile(true)}
                  className="px-5 py-2 h-auto text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-full transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <User className="h-3 w-3" />
                  </div>
                  Profile
                </Button>
              </nav>

              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <NotificationBell />
                <UserProfileMenu 
                  user={user} 
                  onLogout={() => {
                    logout();
                    showInfo("You have been signed out successfully.");
                  }}
                  onEditProfile={() => {
                    setShowProfile(true);
                  }}
                  onSettings={() => {
                    setShowSettings(true);
                  }}
                  onAnalytics={() => {
                    setShowAnalytics(true);
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden mt-4 pb-4 border-t border-slate-100 pt-4 space-y-2"
              >
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.href = "/home-configurator";
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-sm font-bold h-12 rounded-xl"
                >
                  <Sparkles className="h-4 w-4 mr-3 text-blue-600" />
                  Home Configurator
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowProfile(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-sm font-bold h-12 rounded-xl"
                >
                  <User className="h-4 w-4 mr-3 text-blue-600" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-sm font-bold h-12 rounded-xl text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Premium Hero Section */}
      <section className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Architecture"
          className="absolute inset-0 w-full h-full object-cover transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="w-fit mb-4 bg-[#7A3F91] hover:bg-[#2B0D3E] border-0 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1">
              Architectural Dashboard v4.0
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 max-w-2xl leading-[1.1] font-rethink tracking-tight">
              Design the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C59DD9] to-[#7A3F91]">
                Sustainable Housing.
              </span>
            </h2>
            <p className="text-base text-slate-300 max-w-xl font-medium leading-relaxed">
              Harness advanced computational design to analyze, simulate, and plan high-density housing projects with unprecedented accuracy.
            </p>
          </motion.div>
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12">
        {/* Stats Grid - Enhanced with Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-20">
          {/* Total Projects */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#F2EAF7] rounded-lg">
                  <FolderOpen className="h-6 w-6 text-[#2B0D3E]" />
                </div>
                <Badge variant="outline" className="text-[#7A3F91] border-[#C59DD9]/30">Total Projects</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{projects.length}</div>
              <p className="text-xs text-slate-500">Active development files</p>
            </CardContent>
          </Card>

          {/* Housing Units */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Building className="h-6 w-6 text-emerald-600" />
                </div>
                <Badge variant="outline" className="text-emerald-800 border-emerald-200">Housing Units</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stats.totalUnits.toLocaleString()}</div>
              <p className="text-xs text-slate-500">{stats.avgUnitsPerProject} avg per project</p>
            </CardContent>
          </Card>

          {/* Community Impact */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <Badge variant="outline" className="text-purple-800 border-purple-200">Community Impact</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stats.totalPeopleHoused.toLocaleString()}</div>
              <p className="text-xs text-slate-500">Estimated people housed</p>
            </CardContent>
          </Card>

          {/* Investment */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md overflow-hidden hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <Badge variant="outline" className="text-amber-800 border-amber-200">Investment</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {stats.totalBudget > 0 ? `$${(stats.totalBudget / 1000000).toFixed(1)}M` : "$0"}
              </div>
              <p className="text-xs text-slate-500">{stats.scenarioCount} scenarios analyzed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Projects</h2>
                <p className="text-xs text-slate-500">Manage and track your housing plans</p>
              </div>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-[#2B0D3E] hover:bg-[#7A3F91] shadow-lg px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <GetStartedGuide onCreateProject={() => setShowCreateDialog(true)} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleProjectDeleted}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Project Status Card */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4 pt-5 px-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F2EAF7] rounded-lg">
                    <TrendingUp className="h-4 w-4 text-[#7A3F91]" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">Project Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 py-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                    <div className="text-xl font-black text-slate-900 leading-none">{projects.length}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2">Total</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-[#F2EAF7] border border-[#C59DD9]/30">
                    <div className="text-xl font-black text-[#7A3F91] leading-none">{projects.length}</div>
                    <div className="text-[9px] text-[#C59DD9] font-bold uppercase tracking-wider mt-2">Active</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                    <div className="text-xl font-black text-slate-300 leading-none">0</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2">Done</div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Progress</span>
                    <span className="text-[10px] font-black text-[#7A3F91]">
                      {projects.length > 0 ? stats.scenarioCount : 0} SCENARIOS
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: projects.length > 0 ? `${Math.min((stats.scenarioCount / (projects.length * 3)) * 100, 100)}%` : '0%' }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-[#2B0D3E] h-full rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4 pt-5 px-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentProjects.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors group">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#7A3F91] transition-colors truncate flex-1 mr-2">
                            {project.name}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter shrink-0 pt-0.5">
                            {new Date(project.updatedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                          <MapPin className="h-3 w-3 text-[#7A3F91]/70" />
                          {project.location.city}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No activity yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Optimization Tips */}
            <Card className="border-0 shadow-sm bg-[#2B0D3E] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Lightbulb className="h-16 w-16" />
              </div>
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="relative z-10 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[#C59DD9]" />
                  <CardTitle className="text-sm font-bold">Optimization Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2 px-4 pb-4">
                <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <p className="text-xs font-semibold mb-0.5 flex items-center gap-1.5">
                    <Layout className="h-3.5 w-3.5 text-[#C59DD9]" /> Multi-Scenario Testing
                  </p>
                  <p className="text-[10px] text-white/80 leading-relaxed">
                    Compare layouts to maximize density while maintaining livability.
                  </p>
                </div>
                <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
                  <p className="text-xs font-semibold mb-0.5 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-[#C59DD9]" /> Density Optimization
                  </p>
                  <p className="text-[10px] text-white/80 leading-relaxed">
                    Use zoning checks to ensure compliance with local regulations.
                  </p>
                </div>
                <Button variant="secondary" className="w-full bg-white text-[#2B0D3E] hover:bg-[#F2EAF7] border-0 h-8 text-xs font-semibold">
                  Explore Learning Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Project Dialog */}
        <CreateProjectDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onProjectCreated={handleProjectCreated}
        />

        {/* UserProfile Modal */}
        {showProfile && (
          <UserProfile
            onClose={() => setShowProfile(false)}
            projectCount={projects.length}
            completedCount={0}
            inProgressCount={projects.length}
          />
        )}

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        {/* Analytics Modal */}
        <AnalyticsModal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </main>
    </div>
  );
}
