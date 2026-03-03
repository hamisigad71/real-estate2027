"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Scenario, ScenarioResults } from "@/lib/types"
import { useState } from "react"
import { Building2, Home, Layers, Maximize2, Grid3X3, TreePine, Box, LayoutGrid } from "lucide-react"

interface LayoutVisualizationProps {
  scenario: Scenario
  results: ScenarioResults | null
  roomSizes?: {
    masterBedroom: number
    bedroom: number
    livingRoom: number
    kitchen: number
    bathroom: number
    hallway: number
  }
}

/* ── Theme-consistent stat pill ─────────────────────────── */
function StatPill({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border transition-shadow hover:shadow-md ${
      accent 
        ? "bg-blue-50 border-blue-100 ring-1 ring-blue-200/50" 
        : "bg-white border-slate-200"
    }`}>
      <div className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${
        accent ? "text-blue-600" : "text-slate-400"
      }`}>{label}</div>
      <div className={`text-xl font-bold ${accent ? "text-blue-900" : "text-slate-900"}`}>{value}</div>
    </div>
  )
}

/* ── Apartment unit cell with floor-aware styling ──────── */
function UnitCell({
  type,
  floor,
  position,
  unitNumber,
  isHovered,
  onHover,
  onLeave,
  is3D,
}: {
  type: "1" | "2" | "3"
  floor: number
  position: number
  unitNumber: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  is3D?: boolean
}) {
  const typeStyles = {
    "1": {
      bg: "bg-blue-100",
      border: "border-blue-200",
      hoverBg: "bg-blue-200",
      text: "text-blue-700",
      label: "1BR",
    },
    "2": {
      bg: "bg-[#0a1628]/[0.06]",
      border: "border-[#0a1628]/10",
      hoverBg: "bg-[#0a1628]/[0.12]",
      text: "text-[#0a1628]",
      label: "2BR",
    },
    "3": {
      bg: "bg-slate-100",
      border: "border-slate-200",
      hoverBg: "bg-slate-200",
      text: "text-slate-700",
      label: "3BR",
    },
  }

  const style = typeStyles[type]

  return (
    <div
      className={`relative rounded-lg border-[1.5px] transition-all duration-200 cursor-pointer group ${
        isHovered ? `${style.hoverBg} ${style.border} shadow-md scale-105 z-10` : `${style.bg} ${style.border}`
      }`}
      style={{ aspectRatio: is3D ? "1.3 / 1" : "1.1 / 1" }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className={`text-[11px] font-bold ${style.text}`}>{style.label}</div>
        </div>
      </div>

      {isHovered && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap z-20">
          Floor {floor + 1} · Unit {unitNumber} · {type}-Bedroom
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  )
}

export function LayoutVisualization({ scenario, results, roomSizes }: LayoutVisualizationProps) {
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null)
  const [is3D, setIs3D] = useState(false)

  if (!results) return null

  const rooms = roomSizes || {
    masterBedroom: 20,
    bedroom: 15,
    livingRoom: 30,
    kitchen: 15,
    bathroom: 10,
    hallway: 8,
  }

  const projectType = scenario.projectType || "apartment"

  /* ═══════════════════════════════════════════════════════
     APARTMENT LAYOUT — Premium Building Visualization
     ═══════════════════════════════════════════════════════ */
  const renderApartmentLayout = () => {
    const cols = Math.max(1, scenario.unitsPerFloor || 8)
    const rows = Math.max(1, scenario.numberOfFloors || 5)

    const oneBedPct = scenario.unitMix?.oneBedroom || 40
    const twoBedPct = scenario.unitMix?.twoBedroom || 35
    const threeBedPct = scenario.unitMix?.threeBedroom || 25

    const oneBedCount = Math.round((oneBedPct / 100) * results.totalUnits)
    const twoBedCount = Math.round((twoBedPct / 100) * results.totalUnits)
    const threeBedCount = Math.round((threeBedPct / 100) * results.totalUnits)

    // Build a sorted unit list: all 1BR, then 2BR, then 3BR
    const allUnits: Array<"1" | "2" | "3"> = [
      ...Array(oneBedCount).fill("1" as const),
      ...Array(twoBedCount).fill("2" as const),
      ...Array(threeBedCount).fill("3" as const),
    ]

    // Distribute into floors, maintaining grouping order
    const floors: Array<Array<{ id: string; type: "1" | "2" | "3"; unitNumber: number }>> = []
    let unitIdx = 0
    for (let r = 0; r < rows; r++) {
      const floor: Array<{ id: string; type: "1" | "2" | "3"; unitNumber: number }> = []
      for (let c = 0; c < cols; c++) {
        if (unitIdx >= allUnits.length) break
        floor.push({
          id: `${r}-${c}`,
          type: allUnits[unitIdx],
          unitNumber: unitIdx + 1,
        })
        unitIdx++
      }
      if (floor.length > 0) floors.push(floor)
      if (unitIdx >= allUnits.length) break
    }

    return (
      <div className="space-y-5">
        {/* View toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 px-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Unit Types:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-blue-200 border border-blue-300" />
              <span className="text-[11px] text-slate-600 font-medium">1BR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#0a1628]/[0.12] border border-[#0a1628]/20" />
              <span className="text-[11px] text-slate-600 font-medium">2BR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300" />
              <span className="text-[11px] text-slate-600 font-medium">3BR</span>
            </div>
          </div>
          <button
            onClick={() => setIs3D(!is3D)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              is3D
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {is3D ? <LayoutGrid className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
            {is3D ? "2D View" : "3D View"}
          </button>
        </div>

        {/* Building visualization */}
        <div
          className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 transition-all duration-500"
          style={is3D ? { perspective: "900px" } : {}}
        >
          {/* Sky gradient header */}
          <div className={`bg-gradient-to-b from-blue-50 via-sky-50 to-transparent relative overflow-hidden transition-all duration-500 ${is3D ? "h-24" : "h-16"}`}>
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(circle at 80% 50%, rgba(147,197,253,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 30%, rgba(186,230,253,0.2) 0%, transparent 40%)",
              }}
            />
            {is3D && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400/50 uppercase tracking-wider">
                Isometric View
              </div>
            )}
          </div>

          <div className="px-6 pb-6 -mt-4">
            {/* 3D wrapper */}
            <div
              className="transition-all duration-700 ease-in-out"
              style={
                is3D
                  ? {
                      transform: "rotateX(45deg) rotateZ(-30deg) scale(0.75)",
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }
                  : {}
              }
            >
              {/* Building roof accent */}
              <div className="flex justify-center mb-1">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-transparent via-[#0a1628] to-transparent w-3/4 transition-all duration-500"
                  style={is3D ? { boxShadow: "2px 2px 6px rgba(10,22,40,0.3)" } : {}}
                />
              </div>

              {/* Floors — rendered top-down */}
              <div className="space-y-[3px] relative">
                {/* Left elevation line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600/60 via-blue-400/40 to-transparent rounded-full" />
                {/* Right elevation line */}
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600/60 via-blue-400/40 to-transparent rounded-full" />

                {floors.slice().reverse().map((floor, visualIdx) => {
                  const actualFloorIdx = floors.length - 1 - visualIdx
                  const isTopFloor = visualIdx === 0
                  const isBottomFloor = visualIdx === floors.length - 1

                  return (
                    <div
                      key={actualFloorIdx}
                      className="relative transition-all duration-500"
                      style={
                        is3D
                          ? {
                              transform: `translateZ(${(floors.length - visualIdx) * 6}px)`,
                              boxShadow: "0 2px 8px rgba(10,22,40,0.08)",
                            }
                          : {}
                      }
                    >
                      {/* Floor number label */}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full pr-2">
                        <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                          F{actualFloorIdx + 1}
                        </span>
                      </div>

                      <div
                        className={`grid gap-[3px] p-[6px] pl-3 pr-3 transition-all duration-300 ${
                          isTopFloor ? "rounded-t-xl" : ""
                        } ${isBottomFloor ? "rounded-b-xl" : ""} ${
                          isBottomFloor
                            ? "bg-slate-100"
                            : "bg-white/60"
                        }`}
                        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                      >
                        {floor.map((item, colIdx) => (
                          <UnitCell
                            key={item.id}
                            type={item.type}
                            floor={actualFloorIdx}
                            position={colIdx}
                            unitNumber={item.unitNumber}
                            isHovered={hoveredUnit === item.id}
                            onHover={() => setHoveredUnit(item.id)}
                            onLeave={() => setHoveredUnit(null)}
                            is3D={is3D}
                          />
                        ))}
                      </div>

                      {/* Floor divider */}
                      {!isBottomFloor && (
                        <div className="h-[1px] bg-slate-200/80 mx-2" />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Ground / Foundation */}
              <div className="mt-1">
                <div
                  className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-b-xl"
                  style={is3D ? { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } : {}}
                />
              </div>
            </div>

            {/* Ground label */}
            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <TreePine className="h-3 w-3" />
                <span>Site Ground Level</span>
                <TreePine className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill label="1-Bedroom" value={oneBedCount} />
          <StatPill label="2-Bedroom" value={twoBedCount} />
          <StatPill label="3-Bedroom" value={threeBedCount} />
          <StatPill label="Est. Population" value={results.estimatedPopulation} accent />
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════
     SINGLE-FAMILY LAYOUT
     ═══════════════════════════════════════════════════════ */
  const renderSingleFamilyLayout = () => {
    const lotSize = scenario.lotSize || 500
    const houseSize = scenario.houseSize || 120
    const bedrooms = Math.round(houseSize / 30)
    const masterBedroom = rooms.masterBedroom
    const bedroom2 = rooms.bedroom
    const livingRoom = rooms.livingRoom
    const kitchen = rooms.kitchen
    const bathrooms = rooms.bathroom
    const coverage = ((houseSize / lotSize) * 100).toFixed(1)
    const greenSpace = (100 - parseFloat(coverage)).toFixed(1)

    return (
      <div className="space-y-6">
        {/* Layout Visualization */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <div className="bg-slate-50 px-5 py-3 flex items-center gap-2 border-b border-slate-200">
            <Maximize2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900 font-rethink">Floor Plan</span>
            <span className="ml-auto text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architectural View</span>
          </div>

          <div className="p-8 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Lot Boundary */}
              <div
                className="border-2 border-dashed border-slate-300 relative flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-green-50/30 p-5 mx-auto rounded-xl"
                style={{ width: "320px", height: "320px" }}
              >
                <div className="absolute top-2.5 left-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Plot · {lotSize}m²
                </div>

                {/* House */}
                <div
                  className="border border-slate-300 bg-white relative shadow-lg rounded-xl overflow-hidden"
                  style={{ width: "280px", height: "230px" }}
                >
                  {/* Rooms Grid */}
                  <div className="absolute inset-0 grid grid-cols-3 gap-[2px] p-[3px]">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-1.5 col-span-1 row-span-2 flex flex-col items-center justify-center">
                      <div className="text-[10px] font-bold text-[#0a1628]">Master</div>
                      <div className="text-[10px] text-slate-400">{masterBedroom}m²</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-1.5 flex flex-col items-center justify-center">
                      <div className="text-[10px] font-bold text-[#0a1628]">Bed 2</div>
                      <div className="text-[10px] text-slate-400">{bedroom2}m²</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 col-span-2 row-span-2 flex flex-col items-center justify-center">
                      <div className="text-[10px] font-bold text-[#0a1628]">Living / Dining</div>
                      <div className="text-[10px] text-slate-400">{livingRoom}m²</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-1.5 flex flex-col items-center justify-center">
                      <div className="text-[10px] font-bold text-[#0a1628]">Kitchen</div>
                      <div className="text-[10px] text-slate-400">{kitchen}m²</div>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-1.5 col-span-1 flex flex-col items-center justify-center">
                      <div className="text-[10px] font-bold text-[#0a1628]">Bath</div>
                      <div className="text-[10px] text-slate-400">{bathrooms}m²</div>
                    </div>
                  </div>

                  <div className="absolute top-1.5 right-2 bg-[#0a1628] text-white rounded-md px-2 py-0.5 text-[10px] font-bold">
                    {houseSize}m²
                  </div>
                </div>

                <div className="absolute bottom-2 left-4 flex items-center gap-1 text-[10px] text-emerald-600/60 font-medium">
                  <TreePine className="h-2.5 w-2.5" /> Garden
                </div>
                <div className="absolute bottom-2 right-4 flex items-center gap-1 text-[10px] text-emerald-600/60 font-medium">
                  <TreePine className="h-2.5 w-2.5" /> Yard
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatPill label="Land Coverage" value={`${coverage}%`} />
          <StatPill label="Green Space" value={`${greenSpace}%`} />
          <StatPill label="Building Area" value={`${houseSize} m²`} accent />
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatPill label="Bedrooms" value={bedrooms} />
          <StatPill label="Bathrooms" value={2} />
          <StatPill label="Lot Size" value={`${lotSize}m²`} />
        </div>

        {/* Room Breakdown */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-900 font-rethink">Room Breakdown</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: "Master Bedroom", size: masterBedroom, color: "bg-blue-500" },
              { name: "Bedroom 2", size: bedroom2, color: "bg-blue-400" },
              { name: "Living / Dining", size: livingRoom, color: "bg-slate-400" },
              { name: "Kitchen", size: kitchen, color: "bg-amber-400" },
              { name: "Bathrooms", size: bathrooms, color: "bg-cyan-400" },
            ].map((room) => {
              const pct = ((room.size / houseSize) * 100).toFixed(0)
              return (
                <div key={room.name} className="flex items-center gap-3 px-5 py-3 bg-white hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${room.color} shrink-0`} />
                  <span className="text-sm font-medium text-slate-700 flex-1">{room.name}</span>
                  <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${room.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 w-14 text-right">{room.size}m²</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════
     MIXED LAYOUT
     ═══════════════════════════════════════════════════════ */
  const renderMixedLayout = () => {
    const apartmentCols = Math.min(8, Math.max(1, Math.ceil(Math.sqrt(scenario.apartmentUnits || 100))))
    const singleFamilyCols = Math.min(6, Math.ceil(Math.sqrt(scenario.singleFamilyUnits || 50)))

    const unitTypes: Array<"1" | "2" | "3"> = ["1", "2", "3"]
    const aptCount = Math.min(40, scenario.apartmentUnits || 100)
    const apartmentItems = Array.from({ length: aptCount }, (_, i) => ({
      id: `apt-${i}`,
      type: unitTypes[i % 3],
    }))

    const singleFamilyItems = Array.from({ length: scenario.singleFamilyUnits || 50 }, (_, i) => ({
      id: `house-${i}`,
      number: i + 1,
    }))

    return (
      <div className="space-y-6">
        {/* Apartments */}
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-50 px-5 py-3 flex items-center gap-2 border-b border-slate-200">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900 font-rethink">Apartment Block</span>
            <span className="ml-auto text-[10px] text-slate-400 font-bold uppercase tracking-widest">{scenario.apartmentUnits || 100} units</span>
          </div>
          <div className="p-5 bg-gradient-to-b from-slate-50 to-white">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${apartmentCols}, 1fr)` }}>
              {apartmentItems.map((item, idx) => (
                <UnitCell
                  key={item.id}
                  type={item.type}
                  floor={Math.floor(idx / apartmentCols)}
                  position={idx % apartmentCols}
                  unitNumber={idx + 1}
                  isHovered={hoveredUnit === item.id}
                  onHover={() => setHoveredUnit(item.id)}
                  onLeave={() => setHoveredUnit(null)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Single-family */}
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-50 px-5 py-3 flex items-center gap-2 border-b border-slate-200">
            <Home className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900 font-rethink">Single-Family Homes</span>
            <span className="ml-auto text-[10px] text-slate-400 font-bold uppercase tracking-widest">{scenario.singleFamilyUnits || 50} units</span>
          </div>
          <div className="p-5 bg-gradient-to-b from-slate-50 to-white">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${singleFamilyCols}, 1fr)` }}>
              {singleFamilyItems.map((item) => (
                <div
                  key={item.id}
                  className={`aspect-square rounded-lg border-[1.5px] transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    hoveredUnit === item.id
                      ? "bg-blue-50 border-blue-400 shadow-md scale-105"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                  onMouseEnter={() => setHoveredUnit(item.id)}
                  onMouseLeave={() => setHoveredUnit(null)}
                >
                  <Home className={`w-3.5 h-3.5 ${hoveredUnit === item.id ? "text-blue-600" : "text-slate-400"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill label="Apartments" value={scenario.apartmentUnits || 100} />
          <StatPill label="Single-Family" value={scenario.singleFamilyUnits || 50} />
          <StatPill label="Total Units" value={results.totalUnits} accent />
          <StatPill label="Population" value={results.estimatedPopulation} />
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  const typeIcon = {
    apartment: <Building2 className="w-5 h-5 text-blue-300" />,
    "single-family": <Home className="w-5 h-5 text-blue-300" />,
    mixed: <Layers className="w-5 h-5 text-blue-300" />,
  }

  const typeLabel = {
    apartment: "Multi-Unit Apartments",
    "single-family": "Single-Family Homes",
    mixed: "Mixed Development",
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
        <CardTitle className="text-slate-900 font-bold text-base flex items-center gap-2.5 font-rethink">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            {typeIcon[projectType as keyof typeof typeIcon] || <Grid3X3 className="w-5 h-5 text-blue-600" />}
          </div>
          Site Layout — {typeLabel[projectType as keyof typeof typeLabel] || "Development"}
          <span className="ml-auto text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] hidden sm:inline">
            {results.totalUnits} Total Units
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 bg-gradient-to-b from-slate-50/50 to-white">
        {projectType === "apartment" && renderApartmentLayout()}
        {projectType === "single-family" && renderSingleFamilyLayout()}
        {projectType === "mixed" && renderMixedLayout()}
      </CardContent>
    </Card>
  )
}
