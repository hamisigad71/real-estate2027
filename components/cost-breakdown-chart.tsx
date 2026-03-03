"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScenarioResults, Project, Scenario } from "@/lib/types"
import { formatCurrency } from "@/lib/calculations"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CostBreakdownChartProps {
  results: ScenarioResults
  project: Project
  scenario: Partial<Scenario>
}

export function CostBreakdownChart({ results, project, scenario }: CostBreakdownChartProps) {
  const constructionCostPerSqm = scenario.constructionCostPerSqm || 1200
  const infrastructureCosts = scenario.infrastructureCosts || { water: 5000, sewer: 4000, roads: 6000 }
  
  const constructionCost = results.builtUpArea * constructionCostPerSqm
  const infrastructureTotal =
    infrastructureCosts.water + infrastructureCosts.sewer + infrastructureCosts.roads

  const data = [
    { name: "Construction", value: constructionCost, color: "#2563eb" },
    { name: "Water", value: infrastructureCosts.water, color: "#60a5fa" },
    { name: "Sewer", value: infrastructureCosts.sewer, color: "#93c5fd" },
    { name: "Roads", value: infrastructureCosts.roads, color: "#bfdbfe" },
  ]

  if (results.statutoryFees) {
    data.push({ name: "Statutory Fees", value: results.statutoryFees.totalFees, color: "#f59e0b" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, project.budgetRange.currency)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-900">
                {formatCurrency(item.value, project.budgetRange.currency)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
