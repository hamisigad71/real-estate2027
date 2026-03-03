"use client"

import { useState, useEffect } from "react"
import type { ProjectTimeline, ConstructionPhase } from "@/lib/types"
import { generateDefaultPhases, formatCurrency, formatNumber } from "@/lib/calculations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Zap,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TimelineAndPhasingProps {
  projectName: string
  totalCost: number
  constructionMonths: number
  currency: string
}

export function TimelineAndPhasing({
  projectName,
  totalCost,
  constructionMonths,
  currency,
}: TimelineAndPhasingProps) {
  const [timeline, setTimeline] = useState<ProjectTimeline | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<ConstructionPhase | null>(null)
  const [activeView, setActiveView] = useState<"gantt" | "cashflow" | "details">("gantt")

  useEffect(() => {
    // Generate timeline with construction months
    const generatedTimeline = generateDefaultPhases({} as any, constructionMonths)
    setTimeline(generatedTimeline)
    if (generatedTimeline.phases.length > 0) {
      setSelectedPhase(generatedTimeline.phases[0])
    }
  }, [constructionMonths])

  if (!timeline) {
    return <div>Loading...</div>
  }

  const getPhaseStatusIcon = (phase: ConstructionPhase) => {
    return <CheckCircle className="h-4 w-4 text-emerald-500" />
  }

  const getPhaseColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
    ]
    return colors[index % colors.length]
  }

  const getPhaseColorClass = (index: number) => {
    const colors = [
      "border-blue-200 bg-blue-50",
      "border-emerald-200 bg-emerald-50",
      "border-purple-200 bg-purple-50",
      "border-orange-200 bg-orange-50",
      "border-pink-200 bg-pink-50",
    ]
    return colors[index % colors.length]
  }

  const milestones = timeline.phases.map((phase, idx) => ({
    month: phase.endMonth,
    name: phase.milestoneName || phase.name,
    color: getPhaseColor(idx),
  }))

  return (
    <div className="space-y-6">
      {/* Key Timeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Total Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{timeline.totalMonths} months</div>
            <p className="text-xs text-blue-600 mt-1">
              {Math.round(timeline.totalMonths / 12)} years, {timeline.totalMonths % 12} months
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Avg Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {formatCurrency(totalCost / timeline.totalMonths, currency)}
            </div>
            <p className="text-xs text-emerald-600 mt-1">Total: {formatCurrency(totalCost, currency)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{timeline.phases.length}</div>
            <p className="text-xs text-purple-600 mt-1">Construction phases</p>
          </CardContent>
        </Card>
      </div>

      {/* View Selector */}
      <div className="flex gap-2">
        <Button
          variant={activeView === "gantt" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("gantt")}
        >
          Gantt Chart
        </Button>
        <Button
          variant={activeView === "cashflow" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("cashflow")}
        >
          Cash Flow
        </Button>
        <Button
          variant={activeView === "details" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveView("details")}
        >
          Phase Details
        </Button>
      </div>

      {/* Gantt Chart View */}
      {activeView === "gantt" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Gantt Chart</CardTitle>
            <CardDescription>Visual timeline of construction phases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <div className="min-w-full space-y-4 pb-4">
                {/* Timeline header */}
                <div className="flex gap-4">
                  <div className="w-48 font-semibold text-sm text-slate-700 flex-shrink-0">Phase</div>
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: Math.ceil(timeline.totalMonths / 3) }).map((_, i) => (
                      <div key={i} className="flex-1 text-xs text-slate-500 text-center">
                        M{(i + 1) * 3}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline bars */}
                {timeline.phases.map((phase, idx) => (
                  <div key={phase.id} className="flex gap-4 items-center">
                    <div className="w-48 flex-shrink-0">
                      <p className="text-sm font-medium text-slate-900">{phase.name}</p>
                      <p className="text-xs text-slate-500">{phase.durationMonths} months</p>
                    </div>
                    <div className="flex gap-1 flex-1 h-8 bg-slate-100 rounded relative">
                      {/* Phase bar */}
                      <div
                        className={`${getPhaseColor(idx)} rounded h-full flex items-center justify-center text-xs font-semibold text-white transition-all cursor-pointer hover:shadow-lg`}
                        style={{
                          left: `${(phase.startMonth / timeline.totalMonths) * 100}%`,
                          width: `${(phase.durationMonths / timeline.totalMonths) * 100}%`,
                        }}
                        onClick={() => setSelectedPhase(phase)}
                      >
                        {phase.durationMonths > 2 && phase.durationMonths}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-slate-900 mb-3">Key Milestones</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {timeline.phases.map((phase, idx) => (
                  <div
                    key={phase.id}
                    className={`border rounded-lg p-3 flex items-start gap-3 ${getPhaseColorClass(idx)}`}
                  >
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">{phase.milestoneName || phase.name}</p>
                      <p className="text-xs text-slate-600">Month {phase.endMonth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cash Flow View */}
      {activeView === "cashflow" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Cash Flow</CardTitle>
            <CardDescription>Cost distribution across project duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80 bg-slate-50 rounded-lg p-4">
              {timeline.monthlyBreakdown && timeline.monthlyBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeline.monthlyBreakdown}>
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" label={{ value: "Month", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Cost", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number, currency)}
                      contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="costOutflow"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorCost)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No cash flow data available
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Peak Monthly Cost</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(
                    Math.max(...(timeline.monthlyBreakdown?.map((m) => m.costOutflow) || [0])),
                    currency,
                  )}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Average Monthly Cost</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(
                    (timeline.monthlyBreakdown?.reduce((sum, m) => sum + m.costOutflow, 0) || 0) /
                      (timeline.monthlyBreakdown?.length || 1),
                    currency,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase Details View */}
      {activeView === "details" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Construction Phases</CardTitle>
            <CardDescription>Detailed breakdown of each phase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.phases.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPhase?.id === phase.id ? "ring-2 ring-blue-500 border-blue-300" : ""
                  } ${getPhaseColorClass(idx)}`}
                  onClick={() => setSelectedPhase(phase)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{phase.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{phase.description}</p>
                    </div>
                    <Badge>{phase.durationMonths}mo</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600">Start</p>
                      <p className="font-semibold text-slate-900">Month {phase.startMonth}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">End</p>
                      <p className="font-semibold text-slate-900">Month {phase.endMonth}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Cost</p>
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(phase.estimatedCost, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Labor Units</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {phase.laborUnits}
                      </p>
                    </div>
                  </div>

                  {selectedPhase?.id === phase.id && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-slate-600 mb-2">
                        <span className="font-semibold">Milestone:</span> {phase.milestoneName || "N/A"}
                      </p>
                      {phase.dependencies && phase.dependencies.length > 0 && (
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">Depends on:</span> {phase.dependencies.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Critical Path Warning */}
            {timeline.criticalPath.length > 0 && (
              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 mb-1">Critical Path</p>
                  <p className="text-sm text-orange-800">
                    Delays in {timeline.criticalPath.length} phases will delay project completion. Prioritize resources accordingly.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
