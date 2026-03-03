"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scenario, Project, ScenarioResults } from "@/lib/types"
import { scenarioStorage, costAssumptionsStorage } from "@/lib/storage"
import { calculateScenarioResults } from "@/lib/calculations"
import { LayoutVisualization } from "./layout-visualization"
import { ResultsPanel } from "./results-panel"
import { BuildingPreviewModal, GeneratePreviewButton } from "./building-preview-modal"
import { SpaceDesigner } from "./space-designer"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sparkles, LayoutGrid, Maximize2, Info } from "lucide-react"
import { motion } from "framer-motion"

interface ScenarioSimulatorProps {
  scenario: Scenario
  project: Project
  onUpdate: () => void
}

/* ── Reusable number input field ─────────────────────────── */
function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  prefix,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
  prefix?: string
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-slate-400 pointer-events-none">{prefix}</span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const raw = Number(e.target.value)
            if (!isNaN(raw)) onChange(Math.min(max, Math.max(min, raw)))
          }}
          min={min}
          max={max}
          step={step}
          className={`h-10 rounded-xl border-slate-200 font-semibold text-slate-900 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
            prefix ? "pl-7" : ""
          } ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-medium text-slate-400 pointer-events-none">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function ScenarioSimulator({ scenario: initialScenario, project, onUpdate }: ScenarioSimulatorProps) {
  const [scenario, setScenario] = useState(initialScenario)
  const [results, setResults] = useState<ScenarioResults | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showDesigner, setShowDesigner] = useState(false)

  useEffect(() => {
    setScenario(initialScenario)
  }, [initialScenario])

  // Recalculate results whenever scenario changes
  useEffect(() => {
    const costAssumptions = costAssumptionsStorage.get(project.location.country)
    const landSizeInSqm = project.landSizeUnit === "acres" ? project.landSize * 4046.86 : project.landSize

    const calculatedResults = calculateScenarioResults(scenario, project.budgetRange, landSizeInSqm, costAssumptions)

    setResults(calculatedResults)
  }, [scenario, project])

  const handleScenarioChange = (updates: Partial<Scenario>) => {
    const updated = { ...scenario, ...updates }
    setScenario(updated)
  }

  const handleSave = () => {
    scenarioStorage.update(scenario.id, {
      ...scenario,
      calculatedResults: results,
    })
    onUpdate()
  }

  const handleNameChange = (name: string) => {
    const updated = { ...scenario, name }
    setScenario(updated)
    scenarioStorage.update(scenario.id, { name })
    onUpdate()
  }

  const isApartment = project.projectType === "apartment"
  const isSingleFamily = project.projectType === "single-family"
  const isMixed = project.projectType === "mixed"

  const handleDesignerSave = (totalArea: number, rooms: any[]) => {
    handleScenarioChange({ 
      unitSize: Math.round(totalArea),
      houseSize: Math.round(totalArea),
      architecture: { rooms }
    })
    setShowDesigner(false)
  }

  // Auto-generate: pick the dominant bedroom type from unit mix and pre-apply layout
  const handleAutoGenerate = () => {
    const mix = scenario.unitMix
    const isSF = scenario.projectType === "single-family"

    // Determine dominant layout type
    let layoutType: "studio" | "1br" | "2br" | "3br" = "2br"
    if (isSF) {
      layoutType = "3br"
    } else if (mix) {
      const max = Math.max(mix.oneBedroom, mix.twoBedroom, mix.threeBedroom)
      if (max === mix.oneBedroom) layoutType = "1br"
      else if (max === mix.twoBedroom) layoutType = "2br"
      else layoutType = "3br"
    }

    // Auto-apply the layout data directly to scenario architecture, then open designer
    const layoutMap: Record<string, any[]> = {
      studio: [
        { id: "a1", type: "living",   name: "Open Studio",  x: 50,  y: 30,  width: 120, height: 110, color: "bg-slate-400" },
        { id: "a2", type: "kitchen",  name: "Kitchen",      x: 170, y: 30,  width: 60,  height: 55,  color: "bg-amber-400" },
        { id: "a3", type: "bathroom", name: "Bathroom",     x: 170, y: 85,  width: 60,  height: 55,  color: "bg-cyan-400"  },
        { id: "a4", type: "hallway",  name: "Entry",        x: 50,  y: 140, width: 180, height: 26,  color: "bg-slate-300" },
      ],
      "1br": [
        { id: "b1", type: "master",   name: "Bedroom",      x: 50,  y: 30,  width: 90,  height: 80,  color: "bg-blue-500"  },
        { id: "b2", type: "living",   name: "Living Room",  x: 140, y: 30,  width: 110, height: 80,  color: "bg-slate-400" },
        { id: "b3", type: "bathroom", name: "Bathroom",     x: 50,  y: 110, width: 55,  height: 65,  color: "bg-cyan-400"  },
        { id: "b4", type: "hallway",  name: "Hallway",      x: 105, y: 110, width: 35,  height: 65,  color: "bg-slate-300" },
        { id: "b5", type: "kitchen",  name: "Kitchen",      x: 140, y: 110, width: 110, height: 65,  color: "bg-amber-400" },
      ],
      "2br": [
        { id: "c1", type: "master",   name: "Master Bedroom", x: 50,  y: 30,  width: 100, height: 90,  color: "bg-blue-500"  },
        { id: "c2", type: "living",   name: "Living Room",    x: 150, y: 30,  width: 120, height: 100, color: "bg-slate-400" },
        { id: "c3", type: "hallway",  name: "Hallway",        x: 150, y: 130, width: 120, height: 20,  color: "bg-slate-300" },
        { id: "c4", type: "bedroom",  name: "Bedroom 2",      x: 50,  y: 150, width: 100, height: 80,  color: "bg-blue-400"  },
        { id: "c5", type: "kitchen",  name: "Kitchen",        x: 150, y: 150, width: 78,  height: 80,  color: "bg-amber-400" },
        { id: "c6", type: "bathroom", name: "Bathroom",       x: 228, y: 150, width: 52,  height: 80,  color: "bg-cyan-400"  },
      ],
      "3br": [
        { id: "d1", type: "master",   name: "Master Bedroom", x: 50,  y: 30,  width: 110, height: 90,  color: "bg-blue-500"  },
        { id: "d2", type: "bedroom",  name: "Bedroom 2",      x: 50,  y: 140, width: 100, height: 80,  color: "bg-blue-400"  },
        { id: "d3", type: "bedroom",  name: "Bedroom 3",      x: 50,  y: 240, width: 100, height: 80,  color: "bg-blue-400"  },
        { id: "d4", type: "living",   name: "Living Room",    x: 160, y: 30,  width: 130, height: 110, color: "bg-slate-400" },
        { id: "d5", type: "hallway",  name: "Hallway",        x: 160, y: 140, width: 130, height: 20,  color: "bg-slate-300" },
        { id: "d6", type: "kitchen",  name: "Kitchen",        x: 160, y: 160, width: 90,  height: 80,  color: "bg-amber-400" },
        { id: "d7", type: "bathroom", name: "Bathroom",       x: 250, y: 160, width: 60,  height: 80,  color: "bg-cyan-400"  },
      ],
    }

    handleScenarioChange({ architecture: { rooms: layoutMap[layoutType] } })
    setShowDesigner(true)
  }

  return (
    <div className="space-y-6">
      {/* Scenario Name */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Configuration</CardTitle>
          <CardDescription>Adjust parameters to see real-time updates to costs and population impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="scenarioName">Scenario Name</Label>
              <Input
                id="scenarioName"
                value={scenario.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., High-Density Option"
              />
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Dialog open={showDesigner} onOpenChange={setShowDesigner}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 rounded-xl shadow-lg shadow-blue-500/20 font-bold border-0">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enter Design Studio
                    <span className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Pro</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[90vh] p-0 bg-transparent border-0 overflow-hidden">
                  <div className="sr-only">
                    <DialogTitle>Interactive Space Designer</DialogTitle>
                    <DialogDescription>
                      Design and visualize floor plans in 2D and 3D.
                    </DialogDescription>
                  </div>
                  <SpaceDesigner 
                    scenario={scenario} 
                    project={project}
                    onSave={handleDesignerSave}
                  />
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                onClick={handleAutoGenerate}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Auto-Generate Layout
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Layout Parameters */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Layout Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {(isApartment || isMixed) && (
                <>
                  <NumberField
                    label="Unit Size (m²)"
                    value={scenario.unitSize || 50}
                    onChange={(v) => handleScenarioChange({ unitSize: v })}
                    min={30}
                    max={120}
                    step={5}
                    suffix="m²"
                  />
                  <NumberField
                    label="Units per Floor"
                    value={scenario.unitsPerFloor || 8}
                    onChange={(v) => handleScenarioChange({ unitsPerFloor: v })}
                    min={2}
                    max={24}
                    suffix="units"
                  />
                  <NumberField
                    label="Number of Floors"
                    value={scenario.numberOfFloors || 5}
                    onChange={(v) => handleScenarioChange({ numberOfFloors: v })}
                    min={1}
                    max={20}
                    suffix="floors"
                  />
                  <NumberField
                    label="Shared Space (%)"
                    value={scenario.sharedSpacePercentage || 20}
                    onChange={(v) => handleScenarioChange({ sharedSpacePercentage: v })}
                    min={10}
                    max={40}
                    step={5}
                    suffix="%"
                    hint="Corridors, stairs, lifts, and common areas"
                  />
                </>
              )}

              {(isSingleFamily || isMixed) && (
                <>
                  <NumberField
                    label="Number of Homes"
                    value={scenario.numberOfUnits || 50}
                    onChange={(v) => handleScenarioChange({ numberOfUnits: v })}
                    min={5}
                    max={500}
                    step={5}
                    suffix="homes"
                  />
                  <NumberField
                    label="Lot Size (m²)"
                    value={scenario.lotSize || 200}
                    onChange={(v) => handleScenarioChange({ lotSize: v })}
                    min={100}
                    max={1000}
                    step={50}
                    suffix="m²"
                  />
                  <NumberField
                    label="House Size (m²)"
                    value={scenario.houseSize || 100}
                    onChange={(v) => handleScenarioChange({ houseSize: v })}
                    min={40}
                    max={300}
                    step={10}
                    suffix="m²"
                  />
                </>
              )}

              {project.projectType === "mixed" && (
                <>
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <h3 className="font-semibold text-sm text-slate-900 mb-4">Mixed Development Split</h3>
                  </div>
                  <NumberField
                    label="Apartment Units"
                    value={scenario.apartmentUnits || 100}
                    onChange={(v) => handleScenarioChange({ apartmentUnits: v })}
                    min={10}
                    max={500}
                    step={10}
                    suffix="units"
                  />
                  <NumberField
                    label="Single-Family Units"
                    value={scenario.singleFamilyUnits || 50}
                    onChange={(v) => handleScenarioChange({ singleFamilyUnits: v })}
                    min={5}
                    max={500}
                    step={10}
                    suffix="units"
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Unit Mix - Only for Apartments */}
          {isApartment && (
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Unit Mix</CardTitle>
              <CardDescription className="text-sm">Distribution of unit types (must total 100%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* 1-Bedroom */}
              <NumberField
                label="1-Bedroom"
                value={scenario.unitMix?.oneBedroom || 40}
                onChange={(value) => {
                  const remaining = 100 - value
                  const twoBedroomRatio =
                    (scenario.unitMix?.twoBedroom || 35) / ((scenario.unitMix?.twoBedroom || 35) + (scenario.unitMix?.threeBedroom || 25)) || 0.7
                  handleScenarioChange({
                    unitMix: {
                      oneBedroom: value,
                      twoBedroom: Math.round(remaining * twoBedroomRatio),
                      threeBedroom: Math.round(remaining * (1 - twoBedroomRatio)),
                    },
                  })
                }}
                min={0}
                max={100}
                step={5}
                suffix="%"
              />

              {/* 2-Bedroom */}
              <NumberField
                label="2-Bedroom"
                value={scenario.unitMix?.twoBedroom || 35}
                onChange={(value) => {
                  const remaining = 100 - value
                  const oneBedroomRatio =
                    (scenario.unitMix?.oneBedroom || 40) / ((scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.threeBedroom || 25)) || 0.7
                  handleScenarioChange({
                    unitMix: {
                      oneBedroom: Math.round(remaining * oneBedroomRatio),
                      twoBedroom: value,
                      threeBedroom: Math.round(remaining * (1 - oneBedroomRatio)),
                    },
                  })
                }}
                min={0}
                max={100}
                step={5}
                suffix="%"
              />

              {/* 3-Bedroom */}
              <NumberField
                label="3-Bedroom"
                value={scenario.unitMix?.threeBedroom || 25}
                onChange={(value) => {
                  const remaining = 100 - value
                  const oneBedroomRatio =
                    (scenario.unitMix?.oneBedroom || 40) / ((scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.twoBedroom || 35)) || 0.6
                  handleScenarioChange({
                    unitMix: {
                      oneBedroom: Math.round(remaining * oneBedroomRatio),
                      twoBedroom: Math.round(remaining * (1 - oneBedroomRatio)),
                      threeBedroom: value,
                    },
                  })
                }}
                min={0}
                max={100}
                step={5}
                suffix="%"
              />

              <div className="pt-2 border-t border-slate-200 mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Total</span>
                  <span
                    className={`font-bold ${
                      (scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.twoBedroom || 35) + (scenario.unitMix?.threeBedroom || 25) === 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(scenario.unitMix?.oneBedroom || 40) + (scenario.unitMix?.twoBedroom || 35) + (scenario.unitMix?.threeBedroom || 25)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Cost Configuration */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Cost Configuration</CardTitle>
              <CardDescription className="text-slate-500">Construction and infrastructure costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Construction Cost Per SQM */}
              <NumberField
                label="Construction Cost (per m²)"
                value={scenario.constructionCostPerSqm}
                onChange={(v) => handleScenarioChange({ constructionCostPerSqm: v })}
                min={200}
                max={1500}
                step={50}
                prefix="$"
                hint={`Based on 2024/2025 BORAQS rates for ${project.location.country}`}
              />

              {/* Finish Level */}
              <div className="space-y-2">
                <Label htmlFor="finishLevel" className="text-sm font-medium">Finish Level</Label>
                <Select
                  value={scenario.finishLevel}
                  onValueChange={(value: "basic" | "standard" | "improved") =>
                    handleScenarioChange({ finishLevel: value })
                  }
                >
                  <SelectTrigger id="finishLevel" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (~$400/m²)</SelectItem>
                    <SelectItem value="standard">Standard (~$600/m²)</SelectItem>
                    <SelectItem value="improved">Improved (~$900/m²)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">Sourced from Integrum Construction Consortium market data</p>
              </div>

              {/* Infrastructure Costs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium block">Infrastructure Costs</Label>

                <div className="space-y-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="waterCost" className="font-medium text-slate-700 text-sm">
                      💧 Water
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="waterCost"
                        type="number"
                        value={scenario.infrastructureCosts.water}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              water: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="sewerCost" className="font-medium text-slate-700 text-sm">
                      🚰 Sewer
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="sewerCost"
                        type="number"
                        value={scenario.infrastructureCosts.sewer}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              sewer: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="roadsCost" className="font-medium text-slate-700 text-sm">
                      🛣️ Roads
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="roadsCost"
                        type="number"
                        value={scenario.infrastructureCosts.roads}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              roads: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Label htmlFor="electricityCost" className="font-medium text-slate-700 text-sm">
                      ⚡ Electricity
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-600 text-xs">$</span>
                      <Input
                        id="electricityCost"
                        type="number"
                        value={scenario.infrastructureCosts.electricity}
                        onChange={(e) =>
                          handleScenarioChange({
                            infrastructureCosts: {
                              ...scenario.infrastructureCosts,
                              electricity: Number.parseFloat(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-20 text-right font-semibold text-slate-900 border border-slate-300 rounded px-1.5 py-1 text-xs"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-300 pt-2 mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">Total Infrastructure</span>
                      <span className="font-bold text-blue-600">
                        ${(
                          scenario.infrastructureCosts.water +
                          scenario.infrastructureCosts.sewer +
                          scenario.infrastructureCosts.roads +
                          scenario.infrastructureCosts.electricity
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
            Save Scenario
          </Button>
        </div>

        {/* Right Column: Unit Mix and Visualization & Results */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            <LayoutVisualization 
              scenario={scenario} 
              results={results} 
              roomSizes={{
                masterBedroom: 20,
                bedroom: 15,
                livingRoom: 30,
                kitchen: 15,
                bathroom: 10,
                hallway: 8,
              }}
            />


          </div>
          {results && <GeneratePreviewButton onClick={() => setShowPreview(true)} />}
          {results && <ResultsPanel results={results} project={project} scenario={scenario} />}
        </div>
      </div>

      {/* Building Preview Modal */}
      {results && (
        <BuildingPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          scenario={scenario}
          results={results}
        />
      )}
    </div>
  )
}
