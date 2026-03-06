"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Building2,
  Users,
  DollarSign,
  Activity,
  Download,
  RefreshCw
} from "lucide-react";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const analytics = {
    overview: {
      totalProjects: 12,
      activeProjects: 8,
      totalScenarios: 45,
      completedProjects: 4,
      totalBudget: 2500000,
      avgProjectCost: 208333,
    },
    activity: [
      { date: "2024-03-01", projects: 2, scenarios: 8, budget: 150000 },
      { date: "2024-03-02", projects: 1, scenarios: 5, budget: 75000 },
      { date: "2024-03-03", projects: 3, scenarios: 12, budget: 225000 },
      { date: "2024-03-04", projects: 2, scenarios: 7, budget: 120000 },
      { date: "2024-03-05", projects: 4, scenarios: 13, budget: 300000 },
    ],
    topProjects: [
      { name: "Downtown Mixed-Use Complex", scenarios: 8, budget: 450000, status: "active" },
      { name: "Riverside Apartments", scenarios: 6, budget: 320000, status: "active" },
      { name: "Green Valley Housing", scenarios: 5, budget: 280000, status: "completed" },
      { name: "Urban Renewal Project", scenarios: 4, budget: 200000, status: "active" },
    ],
    usage: {
      avgSessionTime: "24m 32s",
      totalSessions: 156,
      mostActiveDay: "Wednesday",
      peakHours: "10 AM - 2 PM",
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#7A3F91]" />
            Usage Analytics & Insights
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{analytics.overview.totalProjects}</div>
                    <p className="text-xs text-slate-500 mt-1">
                      {analytics.overview.activeProjects} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Scenarios Created</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{analytics.overview.totalScenarios}</div>
                    <p className="text-xs text-slate-500 mt-1">
                      {analytics.overview.completedProjects} completed projects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatCurrency(analytics.overview.totalBudget)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Avg: {formatCurrency(analytics.overview.avgProjectCost)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.activity.slice(-5).map((day, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F2EAF7] flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-[#7A3F91]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{formatDate(day.date)}</p>
                            <p className="text-xs text-slate-500">
                              {day.projects} projects, {day.scenarios} scenarios
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(day.budget)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.activity.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#7A3F91]"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{formatDate(day.date)}</span>
                            <span className="text-sm text-slate-500">{formatCurrency(day.budget)}</span>
                          </div>
                          <div className="flex gap-4 text-xs text-slate-600">
                            <span>{day.projects} projects</span>
                            <span>{day.scenarios} scenarios</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Projects by Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topProjects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F2EAF7] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#7A3F91]" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{project.name}</p>
                            <p className="text-xs text-slate-500">{project.scenarios} scenarios</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(project.budget)}</p>
                          <Badge
                            variant={project.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs mt-1"
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Avg Session Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{analytics.usage.avgSessionTime}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Total Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{analytics.usage.totalSessions}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Most Active Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-slate-900">{analytics.usage.mostActiveDay}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Peak Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-slate-900">{analytics.usage.peakHours}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" className="bg-[#7A3F91] hover:bg-[#2B0D3E]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
