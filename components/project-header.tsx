"use client"

import type { Project, Scenario } from "@/lib/types"
import { MapPin, DollarSign, Users, Maximize2, Home, TrendingUp, Calendar, Target, Globe } from "lucide-react"
import { formatCurrency } from "@/lib/calculations"
import { Logo } from "./logo"

interface ProjectHeaderProps {
  project: Project
  scenarios?: Scenario[]
}

export function ProjectHeader({ project, scenarios = [] }: ProjectHeaderProps) {
  const landSizeDisplay =
    project.landSizeUnit === "acres"
      ? `${project.landSize.toLocaleString()} acres`
      : `${project.landSize.toLocaleString()} m²`

  const incomeGroupLabel = {
    low: "Entry Level",
    "lower-middle": "Value Focused",
    middle: "Mid-Market",
    mixed: "Diverse Segments",
  }[project.targetIncomeGroup]

  // Calculate metrics from actual scenarios if they exist
  const hasScenarios = scenarios && scenarios.length > 0
  
  let totalUnits = 0
  let estimatedPopulation = 0
  let landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize
  let netDensity = 0

  if (hasScenarios) {
    scenarios.forEach((scenario) => {
      if (scenario.calculatedResults) {
        totalUnits += scenario.calculatedResults.totalUnits
        estimatedPopulation += scenario.calculatedResults.estimatedPopulation
      }
    })
    
    if (totalUnits > 0) {
      netDensity = Math.round(totalUnits / (landSizeInSqm / 10000))
    }
  }
  
  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-2xl shadow-slate-200/40 backdrop-blur-xl">
      {/* Dynamic Background Elements */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#7A3F91]/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
      
      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Brand & Project Info */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#7A3F91]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7A3F91]">
                  Active Venture
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  PROJECT ID: {project.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <Logo size={64} />
                <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl lg:text-6xl font-rethink">
                  {project.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/50">
                  <MapPin className="h-4 w-4 text-[#7A3F91]" />
                  <span className="text-sm font-medium">{project.location.city}, {project.location.country}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/50">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium capitalize">{project.projectType?.replace("-", " ") || "Residential"}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Budget Scope</p>
                <p className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
                  {formatCurrency(project.budgetRange.min, project.budgetRange.currency)}
                  <span className="text-xs font-normal text-slate-400">+</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Land Area</p>
                <p className="text-lg font-bold text-slate-900">{landSizeDisplay}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Income Tier</p>
                <p className="text-lg font-bold text-slate-900">{incomeGroupLabel}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Est. Timeline</p>
                <p className="text-lg font-bold text-slate-900">18-24 Mo.</p>
              </div>
            </div>
          </div>

          {/* Performance Summary Card */}
          <div className="shrink-0 lg:w-80">
            <div className="rounded-2xl border border-[#7A3F91]/20 bg-gradient-to-br from-[#7A3F91]/5 to-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A3F91] text-white shadow-lg shadow-[#7A3F91]/20">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A3F91]">Live Performance</p>
                  <p className="text-xs text-slate-500 font-medium">Synced 2min ago</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Active Scenarios</span>
                  <span className="inline-flex h-6 items-center rounded-full bg-white px-2.5 text-xs font-bold text-slate-900 shadow-sm border border-slate-100">
                    {scenarios.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Peak ROI Est.</span>
                  <span className="text-base font-bold text-emerald-600">14.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Risk Score</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-1/3 bg-emerald-500 rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Low</span>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98]">
                View Full Metrics
              </button>
            </div>
          </div>
          
        </div>

        {/* Bottom Feature Tiles */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-slate-100 pt-8">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Strategic Alignment</p>
              <p className="text-[10px] text-slate-500 leading-tight">Aligned with urban development master plan 2026.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Next Milestone</p>
              <p className="text-[10px] text-slate-500 leading-tight">Q3 Financial Finalization due in 14 days.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Team Status</p>
              <p className="text-[10px] text-slate-500 leading-tight">4 stakeholders active on current architecture.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
