"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus, LayoutGrid, Trash2,
  Save, CheckCircle2, Wand2, Sparkles, ChevronLeft, ChevronRight, X, Menu,
  ZoomIn, ZoomOut, Maximize, Home as HomeIcon, LogOut
} from "lucide-react"
import { Project, Scenario } from "@/lib/types"
import { INTERIOR_SUGGESTIONS } from "@/lib/design-data"
import { useRouter } from "next/navigation"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Room {
  id: string
  type: string
  name: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface SpaceDesignerProps {
  project?: Project
  scenario?: Scenario
  onSave?: (totalArea: number, rooms: Room[]) => void
}

// ─── Sidebar room palette ────────────────────────────────────────────────────
const ROOM_PALETTE = [
  { type: "master",   name: "Master Bedroom", color: "bg-blue-500",   w: 260, h: 200, area: 20 },
  { type: "bedroom",  name: "Bedroom",         color: "bg-blue-400",   w: 240, h: 180, area: 15 },
  { type: "living",   name: "Living Room",     color: "bg-slate-400",  w: 320, h: 240, area: 30 },
  { type: "kitchen",  name: "Kitchen",         color: "bg-amber-400",  w: 240, h: 180, area: 15 },
  { type: "bathroom", name: "Bathroom",        color: "bg-cyan-400",   w: 180, h: 140, area: 10 },
  { type: "hallway",  name: "Hallway / Entry", color: "bg-slate-300",  w: 300, h: 40,  area:  8 },
]

// ─── Hand-crafted floor plan layouts (20 px ≈ 1 m) ──────────────────────────
//
// STUDIO  (~32 m²)              1-BEDROOM  (~55 m²)
// ┌────────────┬──────┐          ┌──────────┬──────────────┐
// │            │ KITC │          │  Bedroom │  Living Rm   │
// │ Open       │      │          │ 4.5×4 m  │  5.5×4 m     │
// │ Studio     ├──────┤          ├──────┬───┼──────────────┤
// │ 6×5.5 m    │ BATH │          │ Bath │Hal│   Kitchen    │
// │            │      │          │3×3 m │   │  5.5×3 m     │
// ├────────────┴──────┤          └──────┴───┴──────────────┘
// │    Entry / Hall   │
// └───────────────────┘
//
// 2-BEDROOM  (~80 m²)           3-BEDROOM  (~115 m²)
// ┌──────────┬───────────────┐   ┌──────────┬───────────────┐
// │  Master  │  Living Room  │   │  Master  │  Living Room  │
// │  5×4.5 m │  6×5 m        │   │ 5.5×4.5m │  6.5×5.5 m    │
// ├──────────╔═══╗───────────┤   ├──────────╔═══╗───────────┤
// │ Bedroom 2║Hal║  Kitchen  │   │ Bedroom 2║Hal║  Kitchen  │
// │  5×4 m   ║   ║  4×3 m   │   │  5×4 m   ║   ║  4.5×3.5m │
// │          ║   ├─────┬─────┤   ├──────────║   ├─────┬─────┤
// │          ║   │ Ban │     │   │ Bedroom 3║   │Bath │     │
// └──────────╚═══╝─────┴─────┘   │  5×4 m   ╚═══╝     │     │
//                                 └──────────────┴─────┴─────┘

type LayoutType = "studio" | "1br" | "2br" | "3br"

function makeId() { return Math.random().toString(36).substr(2, 9) }

const LAYOUTS: Record<LayoutType, Omit<Room, "id">[]> = {
  studio: [
    { type: "living",   name: "Studio Lounge & Sleeping", x: 60,  y: 60,  width: 360, height: 300, color: "bg-indigo-500"  },
    { type: "kitchen",  name: "Kitchenette Foyer",       x: 430, y: 60,  width: 180, height: 130, color: "bg-amber-500"  },
    { type: "bathroom", name: "Modern Bath",             x: 430, y: 200, width: 180, height: 160, color: "bg-cyan-500"   },
    { type: "hallway",  name: "Large Balcony",           x: 60,  y: 370, width: 240, height: 80,  color: "bg-emerald-500"},
  ],

  "1br": [
    { type: "master",   name: "Master Suite",            x: 60,  y: 60,  width: 300, height: 240, color: "bg-blue-600"   },
    { type: "living",   name: "Great Room",              x: 370, y: 60,  width: 340, height: 280, color: "bg-indigo-500"  },
    { type: "kitchen",  name: "Dining & Kitchen",        x: 370, y: 350, width: 340, height: 180, color: "bg-amber-500"  },
    { type: "bathroom", name: "Full Bath",               x: 60,  y: 320, width: 240, height: 160, color: "bg-cyan-500"   },
    { type: "hallway",  name: "Grand Terrace",           x: 370, y: 550, width: 240, height: 100, color: "bg-emerald-500"},
  ],

  "2br": [
    { type: "living",   name: "Living & Social",        x: 510, y: 60,  width: 380, height: 320, color: "bg-indigo-500" },
    { type: "master",   name: "Primary Suite",           x: 60,  y: 60,  width: 280, height: 220, color: "bg-blue-600"  },
    { type: "kitchen",  name: "Chef's Kitchen",          x: 60,  y: 290, width: 280, height: 220, color: "bg-amber-500" },
    { type: "bathroom", name: "Ensuite",                 x: 60,  y: 520, width: 240, height: 180, color: "bg-cyan-500"  },
    { type: "bedroom",  name: "Bedroom 2",               x: 510, y: 390, width: 260, height: 240, color: "bg-blue-500"  },
    { type: "bathroom", name: "Family Bath",             x: 780, y: 390, width: 110, height: 240, color: "bg-cyan-500"  },
    { type: "hallway",  name: "Gallery Hall",            x: 350, y: 60,  width: 140, height: 640, color: "bg-blue-400"  },
  ],

  "3br": [
    { type: "living",   name: "Grand Living Room",       x: 520, y: 60,  width: 440, height: 340, color: "bg-indigo-600" },
    { type: "master",   name: "Owner's Retreat",         x: 60,  y: 60,  width: 380, height: 280, color: "bg-blue-700"  },
    { type: "kitchen",  name: "Main Kitchen",            x: 60,  y: 470, width: 330, height: 260, color: "bg-amber-500" },
    { type: "bathroom", name: "Master Spa",              x: 60,  y: 350, width: 260, height: 110, color: "bg-cyan-600"  },
    { type: "bedroom",  name: "Bedroom 2",               x: 520, y: 460, width: 280, height: 260, color: "bg-blue-500"  },
    { type: "bedroom",  name: "Bedroom 3",               x: 820, y: 460, width: 280, height: 260, color: "bg-blue-500"  },
    { type: "bathroom", name: "Guest Bath",              x: 520, y: 740, width: 240, height: 160, color: "bg-cyan-500"  },
    { type: "hallway",  name: "Foyer Corridor",          x: 460, y: 410, width: 640, height: 40,  color: "bg-slate-400" },
  ],
}

function getLayout(type: LayoutType): Room[] {
  return LAYOUTS[type].map(r => ({ ...r, id: makeId() }))
}

// ─── Template cards shown in the picker ──────────────────────────────────────
interface Template {
  layoutType: LayoutType
  label: string
  emoji: string
  subtitle: string
  badge: string
  badgeColor: string
  rooms: number
  beds: number
}

function getTemplates(scenario?: Scenario): Template[] {
  const mix  = scenario?.unitMix
  const size = scenario?.unitSize ?? scenario?.houseSize ?? 65

  return [
    {
      layoutType: "studio",
      label: "Studio",
      emoji: "🏠",
      subtitle: `~${Math.round(size * 0.55)}m² · Open plan`,
      badge: "Compact",
      badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      rooms: 4,
      beds: 0,
    },
    {
      layoutType: "1br",
      label: "1-Bedroom",
      emoji: "🛏",
      subtitle: `~${Math.round(size * 0.75)}m² · 1 bed`,
      badge: mix ? `${mix.oneBedroom}% of mix` : "Standard",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      rooms: 5,
      beds: 1,
    },
    {
      layoutType: "2br",
      label: "2-Bedroom",
      emoji: "🛏🛏",
      subtitle: `~${size}m² · 2 beds`,
      badge: mix ? `${mix.twoBedroom}% of mix` : "Popular",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      rooms: 7,
      beds: 2,
    },
    {
      layoutType: "3br",
      label: "3-Bedroom",
      emoji: "🏡",
      subtitle: `~${Math.round(size * 1.4)}m² · 3 beds`,
      badge: mix ? `${mix.threeBedroom}% of mix` : "Family",
      badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      rooms: 8,
      beds: 3,
    },
  ]
}

// ─── Component ────────────────────────────────────────────────────────────────
export function SpaceDesigner({ project, scenario, onSave }: SpaceDesignerProps) {
  const router = useRouter()
  const [rooms,         setRooms]         = useState<Room[]>(scenario?.architecture?.rooms || [])
  const [selectedId,    setSelectedId]    = useState<string | null>(null)
  const [is3D,          setIs3D]          = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showRoomPalette, setShowRoomPalette] = useState(false)
  const [activeSuggStyle, setActiveSuggStyle] = useState(0)
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0)
  const [gridSize]                        = useState(20)
  const [zoom,           setZoom]           = useState(1)
  const [pan,            setPan]            = useState({ x: 0, y: 0 })
  const [isPanning,      setIsPanning]      = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const templates = getTemplates(scenario)

  // On open: load saved rooms or show template picker
  useEffect(() => {
    if (!scenario) return
    if (scenario.architecture?.rooms && scenario.architecture.rooms.length > 0) {
      setRooms(scenario.architecture.rooms)
      setShowTemplates(false)
    } else {
      setShowTemplates(true)
    }
  }, [scenario])

  // Reset style index when room selection changes
  useEffect(() => {
    setActiveSuggStyle(0)
    setActiveCarouselIndex(0)
  }, [selectedId])

  // Reset carousel when style changes
  useEffect(() => {
    setActiveCarouselIndex(0)
  }, [activeSuggStyle])

  const applyTemplate = (type: LayoutType) => {
    setRooms(getLayout(type))
    setSelectedId(null)
    setShowTemplates(false)
  }

  const addRoom = (p: typeof ROOM_PALETTE[0]) => {
    const nr: Room = { id: makeId(), type: p.type, name: p.name, x: 120, y: 120, width: p.w, height: p.h, color: p.color }
    setRooms(prev => [...prev, nr])
    setSelectedId(nr.id)
  }

  const updateRoom = (id: string, updates: Partial<Room>) =>
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const resetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoom(z => Math.max(0.4, Math.min(2.5, z + delta)))
    } else {
      // Pan
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
  }

  const selectedRoom = rooms.find(r => r.id === selectedId)
  const totalArea    = rooms.reduce((s, r) => s + (r.width * r.height) / 400, 0)

  return (
    <div className="flex flex-col h-full min-h-[700px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative" suppressHydrationWarning>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-10 relative shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white hover:border-slate-200 transition-all active:scale-95 group"
            title="Exit Planner"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="h-8 w-px bg-slate-100" />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl hidden sm:block shadow-lg shadow-blue-500/20">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold tracking-tight text-sm sm:text-base">Planner 5D Studio</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Interactive Design Studio</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button onClick={() => setShowTemplates(true)} variant="ghost" size="sm"
            className="h-9 border border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-200/50 text-xs px-4">
            <Wand2 className="w-3.5 h-3.5 mr-2" />
            Template Picker
          </Button>

          <Button onClick={() => setShowSuggestions(v => !v)} variant="ghost" size="sm"
            className={`h-9 border text-xs px-4 transition-all ${
              showSuggestions
                ? "border-violet-500/40 bg-violet-50 text-violet-600 shadow-sm"
                : "border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-200/50"
            }`}>
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Interior Ideas
          </Button>

          <div className="h-6 w-px bg-slate-100 mx-1" />

          <Button variant="outline" size="sm"
            className="h-9 bg-slate-900 border-slate-900 text-white hover:bg-slate-800 text-xs px-6 shadow-xl shadow-slate-200"
            onClick={() => onSave?.(totalArea, rooms)}>
            <Save className="w-4 h-4 mr-2" />
            Sync Design
          </Button>
        </div>
      </div>

      {/* ── Template Picker Overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/98 backdrop-blur-md flex flex-col items-center justify-center p-8 gap-8 rounded-3xl overflow-y-auto"
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-600 rounded-2xl">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-slate-900 text-2xl font-black tracking-tight">Choose a Floor Plan</h2>
              <p className="text-slate-500 text-sm max-w-md">
                Pick a ready-made layout — sized from your scenario data. Every layout includes kitchen &amp; bathroom. You can adjust anything after.
              </p>
            </div>

            {/* Template grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
              {templates.map((t) => {
                const previewRooms = LAYOUTS[t.layoutType]
                const maxX = Math.max(...previewRooms.map(r => r.x + r.width))
                const maxY = Math.max(...previewRooms.map(r => r.y + r.height))
                const scX  = 180 / (maxX + 20)
                const scY  = 130 / (maxY + 20)
                const sc   = Math.min(scX, scY, 1)

                return (
                  <motion.button
                    key={t.layoutType}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => applyTemplate(t.layoutType)}
                    className="flex flex-col bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-500/50 rounded-2xl overflow-hidden text-left transition-colors group shadow-sm hover:shadow-md"
                  >
                    {/* Mini blueprint */}
                    <div className="relative h-[150px] w-full overflow-hidden"
                      style={{
                        background: "#0a1628",
                        backgroundImage: "linear-gradient(#1e3a5f22 1px, transparent 1px), linear-gradient(90deg, #1e3a5f22 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    >
                      <div className="absolute inset-0" style={{ transform: `scale(${sc})`, transformOrigin: "top left" }}>
                        {previewRooms.map((r, i) => (
                          <div key={i}
                            className={`absolute ${r.color} bg-opacity-30 border border-white/25 flex items-center justify-center`}
                            style={{ left: r.x, top: r.y, width: r.width, height: r.height }}
                          >
                            <span className="text-[7px] font-black text-white uppercase text-center px-1 leading-tight drop-shadow">
                              {r.name.split(" ").map(w => w[0]).join("")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                        {t.badge}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-slate-900 font-bold text-sm">{t.emoji} {t.label}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{t.subtitle}</p>
                          <div className="flex gap-3 mt-2">
                            <span className="text-[9px] text-slate-500 font-medium">🛏 {t.beds} bed{t.beds !== 1 ? "s" : ""}</span>
                            <span className="text-[9px] text-slate-500 font-medium">🚿 bath</span>
                            <span className="text-[9px] text-slate-500 font-medium">🍳 kitchen</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors mt-0.5" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Blank canvas */}
            <button
              onClick={() => { setRooms([]); setShowTemplates(false) }}
              className="text-slate-500 hover:text-slate-300 text-xs font-medium underline underline-offset-2 transition-colors"
            >
              Start with a blank canvas instead →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left sidebar (Room Palette) */}
        <div className={`
          absolute lg:relative inset-y-0 left-0 z-30
          w-60 bg-white lg:bg-white/80 border-r border-slate-200 p-5 space-y-6 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${showRoomPalette ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <span className="text-xs font-black text-slate-900 uppercase">Room Palette</span>
            <button onClick={() => setShowRoomPalette(false)} className="p-1 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Add Rooms</Label>
            <div className="grid grid-cols-1 gap-2">
              {ROOM_PALETTE.map((p) => (
                <button key={p.type} onClick={() => { addRoom(p); if (window.innerWidth < 1024) setShowRoomPalette(false); }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500/30 transition-all text-left group shadow-sm">
                  <div className={`w-7 h-7 rounded-lg ${p.color} flex-shrink-0 shadow-inner`} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{p.name}</p>
                    <p className="text-[9px] text-slate-500">~{p.area}m²</p>
                  </div>
                  <Plus className="w-3 h-3 text-slate-400 ml-auto flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Selected room properties */}
          <AnimatePresence>
            {selectedRoom && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="pt-5 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Properties</Label>
                  <button onClick={() => deleteRoom(selectedRoom.id)} className="text-rose-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <Label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Name</Label>
                  <Input value={selectedRoom.name}
                    onChange={(e) => updateRoom(selectedRoom.id, { name: e.target.value })}
                    className="h-9 bg-white border-slate-200 text-slate-900 text-xs shadow-sm focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[["Width (cm)", "width"], ["Height (cm)", "height"]] .map(([lbl, key]) => (
                    <div key={key}>
                      <Label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">{lbl}</Label>
                      <Input type="number" value={(selectedRoom as any)[key]}
                        onChange={(e) => updateRoom(selectedRoom.id, { [key]: parseInt(e.target.value) || 60 } as any)}
                        className="h-9 bg-white border-slate-200 text-slate-900 text-xs shadow-sm focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  Area: <span className="text-slate-900 font-bold">{Math.round((selectedRoom.width * selectedRoom.height) / 1000)}m²</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Sidebar Overlays */}
        {showRoomPalette && (
          <div className="absolute inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setShowRoomPalette(false)} />
        )}

        {/* Canvas */}
        <div className={`flex-1 relative bg-[#fcfdfe] overflow-hidden shadow-inner group/canvas 
          ${isPanning ? "cursor-grabbing" : "cursor-grab"}`} 
          ref={canvasRef}
          onWheel={handleWheel}>
          
          {/* Zoom controls (Moved to left to avoid sidebar overlap) */}
          <div className="absolute top-6 left-6 z-30 flex flex-col gap-2 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
            <button onClick={() => setZoom(z => Math.min(z + 0.1, 2.5))}
              className="p-2.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg hover:bg-white text-slate-600 transition-all active:scale-95" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))}
              className="p-2.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg hover:bg-white text-slate-600 transition-all active:scale-95" title="Zoom Out (Ctrl+Wheel)">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={resetZoom}
              className="p-2.5 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg hover:bg-white text-slate-600 transition-all active:scale-95" title="Reset View">
              <Maximize className="w-4 h-4" />
            </button>
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl shadow-lg text-[10px] font-black text-slate-500 uppercase text-center min-w-[50px]">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Blueprint grid (Static underlay) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }} />

          {/* Zoomable & Pannable Container */}
          <motion.div 
            className="w-full h-full relative"
            style={{ 
              x: pan.x, 
              y: pan.y, 
              scale: is3D ? 1 : zoom,
              transformStyle: "preserve-3d"
            }}
            drag={!is3D} 
            dragMomentum={false}
            onDragStart={() => setIsPanning(true)}
            onDragEnd={() => setIsPanning(false)}
            onDrag={(_, info) => {
              // Only pan if NOT dragging a room (handled by event propagation below)
              setPan(p => ({ x: p.x + info.delta.x, y: p.y + info.delta.y }))
            }}
            onTapStart={() => {
              // Deselect room if clicking background
              setSelectedId(null)
            }}
          >
            {/* 3D perspective wrapper */}
            <div className="w-full h-full p-32 transition-all duration-700 ease-in-out origin-center"
              style={is3D ? { 
                transform: `rotateX(55deg) rotateZ(45deg) scale(${0.78 * zoom})`, 
                transformStyle: "preserve-3d", 
                perspective: "1200px" 
              } : {}}>
              <div className="relative w-full h-full">
                {rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    layoutId={`room-${room.id}`}
                    drag={!is3D}
                    dragMomentum={false}
                    onDragStart={(e) => e.stopPropagation()} // BLOCK canvas panning
                    onDrag={(e, info) => {
                      e.stopPropagation(); // BLOCK canvas panning
                      updateRoom(room.id, {
                        x: Math.round(room.x + info.delta.x / zoom),
                        y: Math.round(room.y + info.delta.y / zoom),
                      })
                    }}
                    onTap={(e) => {
                      e.stopPropagation(); // BLOCK canvas tap
                      setSelectedId(room.id)
                    }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1, translateZ: is3D ? 40 : 0 }}
                    className={`absolute rounded-xl border-2 cursor-move group transition-all duration-300
                      ${selectedId === room.id ? "border-white ring-4 ring-blue-500/30 z-20" : "border-white/20 hover:border-white/50"}
                      ${room.color} shadow-lg`}
                    style={{
                      left: room.x, top: room.y, width: room.width, height: room.height,
                      transformStyle: "preserve-3d",
                      boxShadow: is3D ? "20px 20px 40px rgba(0,0,0,0.3)" : "4px 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* 3D walls */}
                    {is3D && (
                      <>
                        <div className="absolute top-0 left-0 h-full bg-black/20" style={{ width: 40, transform: "rotateY(-90deg)", transformOrigin: "left" }} />
                        <div className="absolute top-0 left-0 w-full bg-black/10" style={{ height: 40, transform: "rotateX(90deg)", transformOrigin: "top" }} />
                      </>
                    )}
                    {/* Label */}
                    <div className="absolute inset-0 flex flex-col items-start p-4 pointer-events-none">
                      <p className={`text-[12px] font-black uppercase tracking-widest text-white drop-shadow-md leading-tight
                        ${is3D ? "[transform:rotateZ(-45deg)_rotateX(-55deg)]" : "w-full break-normal"}`}>
                        {room.name}
                      </p>
                      <p className={`text-[11px] font-extrabold text-white/80 mt-1.5 drop-shadow-md 
                        ${is3D ? "[transform:rotateZ(-45deg)_rotateX(-55deg)]" : ""}`}>
                        {Math.round((room.width * room.height) / 1000)}m²
                      </p>
                    </div>
                    {/* Resize handle */}
                    {!is3D && selectedId === room.id && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow-lg cursor-nwse-resize" />
                    )}
                  </motion.div>
                ))}

                {/* Empty state */}
                {rooms.length === 0 && !showTemplates && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <p className="text-slate-600 text-sm font-semibold">Canvas is empty</p>
                    <button onClick={() => setShowTemplates(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors">
                      <Wand2 className="w-3.5 h-3.5" />Pick a Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Interior Design Suggestions Panel ────────────────────────── */}
        <AnimatePresence>
          {showSuggestions && (() => {
            const roomType = selectedRoom?.type ?? "living"
            const sugg = INTERIOR_SUGGESTIONS[roomType] ?? INTERIOR_SUGGESTIONS["living"]
            const style = sugg.styles[activeSuggStyle % sugg.styles.length]
            return (
                  <motion.div
                    key="suggestions-panel"
                    initial={{ x: 320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 320, opacity: 0 }}
                    transition={{ type: "spring", damping: 22, stiffness: 200 }}
                    className="absolute md:relative inset-y-0 right-0 z-40 w-full xs:w-72 sm:w-80 lg:w-72 bg-white/95 backdrop-blur-sm md:bg-white border-l border-slate-200 flex flex-col shadow-2xl md:shadow-none overflow-hidden"
                  >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Interior Ideas</span>
                    </div>
                  <div className="flex items-center gap-2">
                    {selectedRoom && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        selectedRoom.type === "master" || selectedRoom.type === "bedroom" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                        selectedRoom.type === "living" ? "bg-slate-500/20 text-slate-300 border-slate-500/30" :
                        selectedRoom.type === "kitchen" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                        selectedRoom.type === "bathroom" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" :
                        "bg-slate-500/20 text-slate-300 border-slate-500/30"
                      }`}>
                        {selectedRoom.name}
                      </span>
                    )}
                    <button onClick={() => setShowSuggestions(false)} className="text-slate-500 hover:text-slate-300 p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-0">

                  {/* ── Hero image carousel ───────────────────────────── */}
                  <div className="relative h-60 overflow-hidden bg-slate-950 group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${activeSuggStyle}-${activeCarouselIndex}`}
                        src={style.images[activeCarouselIndex % style.images.length]}
                        alt={style.name}
                        initial={{ opacity: 0, scale: 1.05, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCarouselIndex(prev => (prev - 1 + style.images.length) % style.images.length);
                        }}
                        className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCarouselIndex(prev => (prev + 1) % style.images.length);
                        }}
                        className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Gradient overlay with style name */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                      <div className="flex items-end justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <span className="text-xl">{style.emoji}</span>
                             <p className="text-white font-black text-sm leading-tight uppercase tracking-wider shadow-sm">{style.name}</p>
                          </div>
                          <p className="text-slate-300 text-[10px] mt-1 font-medium leading-tight line-clamp-2">{style.description}</p>
                        </div>
                        
                        {/* Indicators */}
                        <div className="flex gap-1.5 mb-1.5">
                          {style.images.map((_, i) => (
                            <button 
                              key={i} 
                              onClick={() => setActiveCarouselIndex(i)}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                i === activeCarouselIndex % style.images.length 
                                  ? "w-4 bg-violet-400" 
                                  : "w-1 bg-white/30 hover:bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI badge for local images */}
                    {style.images[activeCarouselIndex % style.images.length].startsWith("/generated") && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-violet-500/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30">
                        <Sparkles className="w-3 h-3 text-violet-400" />
                        <span className="text-[9px] font-black text-violet-300 uppercase tracking-widest">AI Visualization</span>
                      </div>
                    )}

                    {/* Image Counter */}
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/5 text-[10px] font-bold text-white/70">
                      {activeCarouselIndex + 1} / {style.images.length}
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                  {/* Hint if no room selected */}
                  {!selectedRoom && (
                    <div className="text-center py-4">
                      <p className="text-2xl mb-2">👆</p>
                      <p className="text-slate-400 text-xs">Click a room on the canvas to see design ideas for it</p>
                    </div>
                  )}


                  {/* Style tabs */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Styles</p>
                    <div className="flex flex-col gap-2">
                      {sugg.styles.map((s, i) => (
                        <button key={i} onClick={() => setActiveSuggStyle(i)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            i === activeSuggStyle % sugg.styles.length
                              ? "border-violet-500/50 bg-violet-50 shadow-sm"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}>
                          <span className="text-xl leading-none mt-0.5">{s.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{s.description}</p>
                          </div>
                          {i === activeSuggStyle % sugg.styles.length && (
                            <ChevronRight className="w-3 h-3 text-violet-500 flex-shrink-0 mt-1" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color palette for active style */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Colour Palette</p>
                    <div className="flex gap-2">
                      {style.palette.map((hex, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full h-10 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: hex }} />
                          <span className="text-[8px] text-slate-500 font-mono">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Furniture checklist */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Furniture</p>
                    <ul className="space-y-1.5">
                      {sugg.furniture.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Design tips */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pro Tips</p>
                    <ul className="space-y-2">
                      {sugg.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-amber-500 text-xs flex-shrink-0 mt-0.5">💡</span>
                          <span className="text-[10px] text-slate-600 leading-snug">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            )
          })()}
        </AnimatePresence>

        {/* Status bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white shadow-2xl border border-slate-200 rounded-2xl z-40 whitespace-nowrap scale-90 sm:scale-100">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-3 sm:pr-5 border-r border-slate-200">
            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden xs:inline">Designed</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900">{Math.round(totalArea)}<span className="text-xs sm:text-sm font-medium text-slate-400 ml-1">m²</span></span>
          </div>
          {scenario && (
            <div className="flex items-center gap-1.5 sm:gap-2 pr-3 sm:pr-5 border-r border-slate-200">
              <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden xs:inline">Target</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600">{scenario.unitSize ?? scenario.houseSize ?? "—"}<span className="text-xs sm:text-sm font-medium text-slate-400 ml-1">m²</span></span>
            </div>
          )}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex -space-x-1 hidden xs:flex">
              {rooms.map((r, i) => (
                <div key={r.id} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white ${r.color}`} style={{ zIndex: 10 - i }} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-500">{rooms.length} <span className="hidden xs:inline">rooms</span></span>

            {/* View Toggle (Only in Status Bar on Mobile) */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 sm:hidden ml-1">
              <button onClick={() => setIs3D(false)}
                className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${!is3D ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                2D
              </button>
              <button onClick={() => setIs3D(true)}
                className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${is3D ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                3D
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
