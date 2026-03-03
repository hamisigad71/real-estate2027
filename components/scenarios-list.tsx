"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Scenario, Project } from "@/lib/types"
import { MoreVertical, Trash2, TrendingUp, Users, DollarSign, Home, Maximize2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { scenarioStorage, costAssumptionsStorage } from "@/lib/storage"
import { calculateScenarioResults, formatCurrency, formatNumber } from "@/lib/calculations"

interface ScenariosListProps {
  scenarios: Scenario[]
  project: Project
  activeScenarioId: string | null
  onScenarioSelect: (id: string) => void
  onScenarioDeleted: () => void
}

export function ScenariosList({
  scenarios,
  project,
  activeScenarioId,
  onScenarioSelect,
  onScenarioDeleted,
}: ScenariosListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDelete = (scenarioId: string) => {
    if (deleteConfirmId === scenarioId) {
      scenarioStorage.delete(scenarioId)
      onScenarioDeleted()
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(scenarioId)
      setTimeout(() => setDeleteConfirmId(null), 3000)
    }
  }

  if (scenarios.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Home className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No scenarios yet</h3>
          <p className="text-sm text-slate-600 text-center max-w-md">
            Create your first scenario to start simulating housing layouts and analyzing costs.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenarios.map((scenario) => {
        const costAssumptions = costAssumptionsStorage.get(project.location.country)
        const landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize

        const results = calculateScenarioResults(scenario, project.budgetRange, landSizeInSqm, costAssumptions)

        const densityColor = {
          low: "bg-green-100 text-green-800",
          medium: "bg-blue-100 text-blue-800",
          high: "bg-orange-100 text-orange-800",
          "very-high": "bg-red-100 text-red-800",
        }[results.densityClassification]

        const budgetColor = {
          under: "text-blue-600",
          within: "text-green-600",
          over: "text-red-600",
        }[results.budgetStatus]

        // Determine scenario description based on project type
        let scenarioDescription = ""
        if (project.projectType === "single-family") {
          scenarioDescription = `${scenario.numberOfUnits || 50} homes • ${scenario.lotSize || 200}m² lot • ${scenario.houseSize || 100}m² house`
        } else if (project.projectType === "apartment") {
          scenarioDescription = `${scenario.numberOfFloors || 5} floors • ${scenario.unitsPerFloor || 8} units/floor`
        } else if (project.projectType === "mixed") {
          scenarioDescription = `${scenario.apartmentUnits || 100} apartments • ${scenario.singleFamilyUnits || 50} homes`
        }

        return (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-all ${
              activeScenarioId === scenario.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
            }`}
            onClick={() => onScenarioSelect(scenario.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-slate-900">{scenario.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {scenarioDescription}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(scenario.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteConfirmId === scenario.id ? "Click to confirm" : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Design Thumbnail / Mini-map */}
            <div className="px-6 -mt-2 mb-4">
              <div className="h-24 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative group/preview shadow-inner">
                {scenario.architecture?.rooms && scenario.architecture.rooms.length > 0 ? (() => {
                  const rooms = scenario.architecture.rooms;
                  const minX = Math.min(...rooms.map((r: any) => r.x));
                  const minY = Math.min(...rooms.map((r: any) => r.y));
                  const maxX = Math.max(...rooms.map((r: any) => r.x + r.width));
                  const maxY = Math.max(...rooms.map((r: any) => r.y + r.height));
                  const dWidth = maxX - minX || 1;
                  const dHeight = maxY - minY || 1;
                  
                  // Fit into 100% of the card width by 96px height
                  // Dynamically get container width if possible, or use a safe responsive approach
                  const padding = 8;
                  const containerW = 300; 
                  const containerH = 96 - padding;
                  const scale = Math.min(containerW / dWidth, containerH / dHeight);
                  
                  const offsetX = (containerW + padding - dWidth * scale) / 2 - minX * scale;
                  const offsetY = (96 - dHeight * scale) / 2 - minY * scale;

                  return (
                    <div className="w-full h-full relative p-0 overflow-hidden">
                      {rooms.map((room: any) => (
                        <div 
                          key={room.id}
                          className={`absolute rounded-[1px] border-[0.5px] border-slate-400/30 ${room.color} bg-opacity-40 transition-all duration-700`}
                          style={{
                            left: room.x * scale + offsetX + 0.5,
                            top: room.y * scale + offsetY + 0.5,
                            width: room.width * scale - 1,
                            height: room.height * scale - 1,
                          }}
                        />
                      ))}
                    </div>
                  );
                })() : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Blueprint Sketch</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-200/20 opacity-0 group-hover:preview:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${densityColor} border-none`}>
                  {results.densityClassification.replace("-", " ")} density
                </Badge>
                {activeScenarioId === scenario.id && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Active
                  </Badge>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Home className="h-4 w-4" />
                    Total Units
                  </div>
                  <span className="font-semibold text-slate-900">{results.totalUnits}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4" />
                    Population
                  </div>
                  <span className="font-semibold text-slate-900">{formatNumber(results.estimatedPopulation)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="h-4 w-4" />
                    Total Cost
                  </div>
                  <span className={`font-semibold ${budgetColor}`}>
                    {formatCurrency(results.totalProjectCost, project.budgetRange.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <TrendingUp className="h-4 w-4" />
                    Cost per Unit
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(results.costPerUnit, project.budgetRange.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
