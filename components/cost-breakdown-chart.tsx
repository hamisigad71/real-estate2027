"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScenarioResults, Project, Scenario } from "@/lib/types"
import { formatCurrency } from "@/lib/calculations"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts"
import { PieChart as PieChartIcon, Info } from "lucide-react"

interface CostBreakdownChartProps {
  results: ScenarioResults
  project: Project
  scenario: Partial<Scenario>
}

export function CostBreakdownChart({ results, project, scenario }: CostBreakdownChartProps) {
  // Always use the engine-calculated values — no silent fallbacks
  const constructionCost = results.constructionCost

  // Use the user's itemised infra costs if provided; otherwise use the engine total
  const infra = scenario.infrastructureCosts
  const infraTotal = results.infrastructureCost

  // Split infra breakdown proportionally from user's inputs if available
  const waterShare   = infra ? infra.water                                                   : infraTotal * 0.33
  const sewerShare   = infra ? infra.sewer                                                   : infraTotal * 0.27
  const roadsShare   = infra ? infra.roads                                                   : infraTotal * 0.27
  const elecShare    = infra ? infra.electricity                                             : infraTotal * 0.13

  const totals = constructionCost + waterShare + sewerShare + roadsShare + elecShare + (results.statutoryFees?.totalFees || 0)

  const data = [
    { name: "Construction", value: constructionCost, color: "#7A3F91", percentage: Math.round((constructionCost / totals) * 100) },
    { name: "Water",        value: waterShare,       color: "#C59DD9", percentage: Math.round((waterShare / totals) * 100) },
    { name: "Sewer",        value: sewerShare,       color: "#4A235A", percentage: Math.round((sewerShare / totals) * 100) },
    { name: "Roads",        value: roadsShare,       color: "#E9DEEF", percentage: Math.round((roadsShare / totals) * 100) },
    { name: "Electricity",  value: elecShare,        color: "#9B4DCA", percentage: Math.round((elecShare / totals) * 100) },
  ]

  if (results.statutoryFees) {
    data.push({ 
      name: "Statutory Fees", 
      value: results.statutoryFees.totalFees, 
      color: "#9B59B6",
      percentage: Math.round((results.statutoryFees.totalFees / totals) * 100)
    })
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/50 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black text-slate-900 font-rethink flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-[#7A3F91]" />
            Cost Breakdown
          </CardTitle>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Financial Distribution</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Info className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid rgba(226, 232, 240, 0.6)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                formatter={(value: number) => [formatCurrency(value, project.budgetRange.currency), "Amount"]} 
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Information */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Cost</p>
            <p className="text-xl font-black text-slate-900 font-geist">
              {formatCurrency(totals, project.budgetRange.currency)}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {data.sort((a, b) => b.value - a.value).map((item) => (
            <div key={item.name} className="group relative">
              <div className="flex items-center justify-between rounded-xl border border-transparent p-2 transition-all hover:bg-slate-50 hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-2.5 w-2.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-medium text-slate-500">{item.percentage}% Share</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {formatCurrency(item.value, project.budgetRange.currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <button className="w-full rounded-xl bg-[#7A3F91]/10 py-2.5 text-xs font-bold text-[#7A3F91] transition-all hover:bg-[#7A3F91]/20 active:scale-[0.98]">
            Download Full Audit
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
