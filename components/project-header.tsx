"use client"

import type { Project, Scenario } from "@/lib/types"
import { MapPin, DollarSign, Users, Maximize2, Home, TrendingUp, Zap, Droplets, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/calculations"

interface ProjectHeaderProps {
  project: Project
  scenarios?: Scenario[]
}

export function ProjectHeader({ project, scenarios = [] }: ProjectHeaderProps) {
  const landSizeDisplay =
    project.landSizeUnit === "acres"
      ? `${project.landSize.toLocaleString()} acres (${(project.landSize * 4046.86).toLocaleString()} m²)`
      : `${project.landSize.toLocaleString()} m² (${(project.landSize / 10000).toFixed(2)} hectares)`

  const incomeGroupLabel = {
    low: "Low Income",
    "lower-middle": "Lower-Middle Income",
    middle: "Middle Income",
    mixed: "Mixed Income",
  }[project.targetIncomeGroup]

  // Calculate metrics from actual scenarios if they exist
  const hasScenarios = scenarios && scenarios.length > 0
  
  let totalUnits = 0
  let estimatedPopulation = 0
  let landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize
  let netDensity = 0

  if (hasScenarios) {
    // Sum up units from all scenarios
    scenarios.forEach((scenario) => {
      if (scenario.calculatedResults) {
        totalUnits += scenario.calculatedResults.totalUnits
        estimatedPopulation += scenario.calculatedResults.estimatedPopulation
      }
    })
    
    // Calculate density based on actual scenario units
    if (totalUnits > 0) {
      netDensity = Math.round(totalUnits / (landSizeInSqm / 10000))
    }
  }
  
  return (
    <header className="relative bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 overflow-hidden">
      {/* Background Decorative Mesh - Subtle */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="space-y-8">
          {/* Title and Location */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl font-rethink">
                {project.name}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-slate-500">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-lg font-medium">
                  {project.location.city}, {project.location.country}
                </span>
              </div>
            </div>
            {hasScenarios && (
              <div className="flex gap-4 p-1 px-4 bg-white shadow-sm rounded-2xl border border-slate-200">
                <div className="py-2 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-rethink">Active Scenarios</p>
                  <p className="text-xl font-bold text-slate-900 font-geist">{scenarios.length}</p>
                </div>
                <div className="w-[1px] bg-slate-200 self-stretch my-2" />
                <div className="py-2 text-center pl-2">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-rethink">Avg. ROI</p>
                  <p className="text-xl font-bold text-emerald-600 font-geist">12.5%</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Land Size Cell */}
            <div className="group relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-blue-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Maximize2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] font-rethink uppercase">Land Metrics</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-rethink">Total Area</p>
                  <p className="text-lg font-bold text-slate-900 font-geist leading-tight">
                    {project.landSize.toLocaleString()} <span className="text-xs font-normal text-slate-500 uppercase">{project.landSizeUnit}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {(project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize / 10000).toFixed(2)} {project.landSizeUnit === "acres" ? "m² equivalent" : "hectares"}
                  </p>
                </div>
              </div>
            </div>

            {/* Development Type Cell */}
            <div className="group relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-emerald-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Home className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 tracking-[0.2em] font-rethink uppercase">Asset Type</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-rethink">Class</p>
                  <p className="text-lg font-bold text-slate-900 font-geist leading-tight capitalize">
                    {project.projectType?.replace("-", " ") || "Residential"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {project.projectType === "apartment" ? "Vertical Development" : project.projectType === "mixed" ? "Commercial & Residential" : "Detached Housing"}
                  </p>
                </div>
              </div>
            </div>

            {/* Target Demographic Cell */}
            <div className="group relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-purple-300 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-purple-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-[10px] font-black text-purple-600 tracking-[0.2em] font-rethink uppercase">Demographic</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-rethink">Target</p>
                  <p className="text-lg font-bold text-slate-900 font-geist leading-tight">
                    {incomeGroupLabel}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Market-positioned density</p>
                </div>
              </div>
            </div>

            {/* Financial Capacity Cell */}
            <div className="group relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-orange-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-[10px] font-black text-orange-600 tracking-[0.2em] font-rethink uppercase">Financials</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-rethink">Budget Range</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-base font-bold text-slate-900 font-geist">
                      {formatCurrency(project.budgetRange.min, project.budgetRange.currency)}
                    </p>
                    <span className="text-[10px] text-slate-400">—</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 font-geist">
                    {formatCurrency(project.budgetRange.max, project.budgetRange.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
