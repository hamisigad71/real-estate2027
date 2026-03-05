"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { HomeBuilderConfig, HomeSpecification } from "@/lib/types"
import { calculateHomeSpecification } from "@/lib/calculations"
import { getAvailableCountries } from "@/lib/country-data"
import { SpaceDesigner } from "./space-designer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Building2, Home as HomeIcon, Ruler, DollarSign, Sparkles,
  MapPin, Wind, Hammer, Box, Info, Layout,
  ChevronLeft, ChevronRight, Wand2, Download, Save,
  Bell, User, Zap, Lightbulb, Droplet, Car, TreePine, 
  ArrowRight, Maximize2, CheckCircle2, ShieldCheck,
  LayoutList, Scale, TrendingUp, Calendar, Settings2,
  ArrowLeft, Shuffle, Bed
} from "lucide-react"
import { useAuth } from "./auth-provider"
import { NotificationBell } from "./notification-bell"
import { UserProfile } from "./user-profile"

const HOME_STYLES = [
  {
    id: "basic",
    name: "Basic",
    description: "Efficient & Affordable",
    image: "https://i.pinimg.com/736x/d6/1e/ee/d61eee6cef179e5be14fde71d7013596.jpg",
    color: "slate"
  },
  {
    id: "standard",
    name: "Standard",
    description: "Modern Comfort",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
    color: "blue"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek & Contemporary",
    image: "https://i.pinimg.com/1200x/9c/61/0c/9c610c615b9b26ba12f84749a8d9e949.jpg",
    color: "cyan"
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Classic Heritage",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    color: "amber"
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Premium Excellence",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    color: "indigo"
  }
]

const BLUEPRINT_PRESETS = [
  {
    id: "p1",
    name: "Compact Studio",
    description: "Ideal for singles or guests",
    image: "https://i.pinimg.com/736x/f1/77/c5/f177c5954b2cf9fbb981d8f744d85fc1.jpg",
    rooms: [
      { id: "p1-1", type: "living", name: "Living/Sleep", x: 20, y: 20, width: 220, height: 180, color: "bg-slate-400" },
      { id: "p1-2", type: "kitchen", name: "Kitchenette", x: 240, y: 20, width: 100, height: 100, color: "bg-amber-400" },
      { id: "p1-3", type: "bathroom", name: "Bath", x: 240, y: 120, width: 100, height: 80, color: "bg-cyan-400" }
    ]
  },
  {
    id: "p2",
    name: "Modern 2-Bed",
    description: "Perfect for young families",
    image: "https://i.pinimg.com/1200x/a4/ed/d0/a4edd0aa052edf59746ecc7a4b89b121.jpg",
    rooms: [
      { id: "p2-1", type: "master", name: "Master", x: 10, y: 10, width: 160, height: 140, color: "bg-blue-500" },
      { id: "p2-2", type: "bedroom", name: "Suite 2", x: 180, y: 10, width: 160, height: 100, color: "bg-blue-400" },
      { id: "p2-3", type: "living", name: "Lounge", x: 10, y: 160, width: 240, height: 140, color: "bg-slate-400" },
      { id: "p2-4", type: "kitchen", name: "Kitchen", x: 260, y: 160, width: 90, height: 140, color: "bg-amber-400" },
      { id: "p2-5", type: "bathroom", name: "Bath", x: 180, y: 115, width: 160, height: 40, color: "bg-cyan-400" }
    ]
  },
  {
    id: "p3",
    name: "Family 3-Bed",
    description: "Spacious suburban living",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=400",
    rooms: [
       { id: "p3-1", type: "master", name: "Master", x: 10, y: 10, width: 140, height: 140, color: "bg-blue-500" },
       { id: "p3-2", type: "bedroom", name: "Bed 2", x: 160, y: 10, width: 90, height: 100, color: "bg-blue-400" },
       { id: "p3-3", type: "bedroom", name: "Bed 3", x: 260, y: 10, width: 90, height: 100, color: "bg-blue-400" },
       { id: "p3-4", type: "living", name: "Great Room", x: 10, y: 160, width: 240, height: 150, color: "bg-slate-400" },
       { id: "p3-5", type: "kitchen", name: "Island Kitchen", x: 260, y: 160, width: 90, height: 150, color: "bg-amber-400" },
       { id: "p3-6", type: "bathroom", name: "Bath 1", x: 160, y: 115, width: 90, height: 40, color: "bg-cyan-400" },
       { id: "p3-7", type: "bathroom", name: "Bath 2", x: 260, y: 115, width: 90, height: 40, color: "bg-cyan-400" }
    ]
  },
  {
    id: "p4",
    name: "Luxury Suite",
    description: "Premium executive layout",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    rooms: [
      { id: "p4-1", type: "master", name: "Owner's Suite", x: 10, y: 10, width: 200, height: 160, color: "bg-blue-600" },
      { id: "p4-2", type: "living", name: "Grand Hall", x: 220, y: 10, width: 130, height: 300, color: "bg-slate-500" },
      { id: "p4-3", type: "office", name: "Tech Hub", x: 10, y: 180, width: 200, height: 130, color: "bg-indigo-400" },
      { id: "p4-4", type: "kitchen", name: "Chef's Kitchen", x: 20, y: 180, width: 190, height: 130, color: "bg-amber-400" },
    ]
  }
]

export function HomeConfigurator() {
  const router = useRouter()
  const [config, setConfig] = useState<HomeBuilderConfig>({
    id: "", // Will be generated on client
    userId: "current-user",
    country: "Kenya",
    countryCode: "KE",
    landSize: 500,
    budget: 50000,
    style: "standard",
    sizePreference: "medium",
    bedrooms: 2,
    constructionCostPerSqm: 0,
    infrastructureCosts: {
      water: 0,
      sewer: 0,
      roads: 0,
      electricity: 0,
    },
    features: {
      solarPanels: false,
      smartHome: false,
      airConditioning: false,
      swimmingPool: false,
      garage: false,
      garden: true,
    },
    createdAt: "",
    updatedAt: "",
  })

  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  // Mounting state to handle hydration properly
  const [mounted, setMounted] = useState(false)

  // Handle client-side initialization to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    if (!config.id) {
      const country = countries[0] || { name: "Kenya", code: "KE" }
      setConfig(prev => ({
        ...prev,
        id: Math.random().toString(36).substr(2, 9),
        country: country.name,
        countryCode: country.code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    }
  }, [])

  // Auto-calculate whenever config changes to provide real-time simulation
  useEffect(() => {
    if (config.id) {
      const result = calculateHomeSpecification(config)
      setSpecification(result)
    }
  }, [config])

  const [specification, setSpecification] = useState<HomeSpecification | null>(null)
  const [layoutVariant, setLayoutVariant] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'design' | 'blueprint' | 'finance'>('design')
  const [showRenders, setShowRenders] = useState(false)
  const countries = getAvailableCountries()

  const handleCalculate = () => {
    // This is now handled by the auto-calculate useEffect
    const result = calculateHomeSpecification(config)
    setSpecification(result)
  }

  const getExpertAdvice = () => {
    if (!specification) return []
    const advice = []

    // Architectural Advice
    if (config.countryCode === 'KE') {
      advice.push({
        type: 'architectural',
        title: 'Tropical Optimization',
        text: 'Consider elevating the foundation in coast-adjacent regions to improve airflow and mitigate humidity.',
        impact: 'Comfort'
      })
    }
    
    if (config.style === 'modern' && specification.totalBuildingArea < 120) {
      advice.push({
        type: 'architectural',
        title: 'Volumetric Efficiency',
        text: 'The Modern layout works best here by utilizing double-height ceilings in the living room to create perceived volume.',
        impact: 'Aesthetic'
      })
    }

    // Financial Advice
    const efficiency = specification.percentageUsed
    if (efficiency < 85) {
      advice.push({
        type: 'financial',
        title: 'Capital Optimization',
        text: 'You have significant budget headroom. Consider upgrading to luxury finishes to maximize long-term resale value.',
        impact: 'ROI'
      })
    } else if (efficiency > 95) {
      advice.push({
        type: 'financial',
        title: 'Contingency Warning',
        text: 'Your specification is approaching budget limits. Ensure a 10% cash reserve for unforeseen material price fluctuations.',
        impact: 'Risk'
      })
    }

    if (config.features.solarPanels) {
      advice.push({
        type: 'financial',
        title: 'Energy ROI',
        text: 'Solar integration will likely achieve a ROI of 14% annually based on local utility rates.',
        impact: 'Yield'
      })
    }

    return advice
  }

  const handleFeatureToggle = (feature: keyof typeof config.features) => {
    setConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }))
  }

  const handleExportPDF = () => {
    if (!specification) return
    
    // Simple PDF generation (can be enhanced with jsPDF library)
    const pdfContent = generatePDFContent(config, specification)
    const link = document.createElement("a")
    const blob = new Blob([pdfContent], { type: "text/html" })
    link.href = URL.createObjectURL(blob)
    link.download = `home-plan-${new Date().getTime()}.html`
    link.click()
  }

  const handleShuffleLayout = () => {
    setLayoutVariant((prev) => (prev + 1) % 3)
  }

  const budgetStatus = specification?.budgetStatus || null

  // Ensure we don't render on the server to avoid hydration mismatches
  // with browser extensions injecting attributes
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      <div>

        {/* Premium Sticky Navbar */}
        <nav className="sticky top-0 z-[60] w-full border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer group" 
                  onClick={() => window.location.href = "/"}
                  title="Return to Dashboard"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-900 tracking-tight font-rethink leading-none">StudioConfig.</span>
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Architectural Engine</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="h-9 px-3 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = "/"}
                    className="h-9 px-3 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider"
                  >
                    <HomeIcon className="w-4 h-4" />
                    Home
                  </Button>
                </div>
                
                <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200 ml-4">
                  {['design', 'blueprint', 'finance'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab 
                          ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">System Active</span>
                  </div>
                  
                  <NotificationBell />
                  <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="flex items-center gap-2 p-1.5 pl-3 border border-slate-200 hover:border-slate-300 rounded-full bg-white transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    <span className="text-xs font-bold text-slate-700 hidden sm:inline">{user?.name || "Architect"}</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <User className="w-4 h-4" />
                    </div>
                  </button>
                </div>
            </div>
          </div>
        </nav>
        
        {/* Cinematic Hero Section */}
        <section className={`relative pt-16 pb-20 overflow-hidden ${activeTab !== 'design' ? 'hidden' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-7"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-8">
                  <div className="p-1 bg-emerald-500 rounded-full">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] font-rethink">
                    Precision Architectural Engine v4.0
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-medium text-slate-900 leading-[1.05] mb-8 font-rethink tracking-tight">
                  Design the <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 text-blue-600">Future</span>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute bottom-4 left-0 h-4 bg-blue-100 -z-10"
                    />
                  </span>
                  {" "}of Housing.
                </h1>
                
                <p className="text-base text-slate-500 leading-relaxed max-w-2xl mb-10 font-medium whitespace-pre-wrap">
                  Harness advanced AI to synthesize complex architectural constraints into beautiful, functional living spaces. Real-time cost engineering meets high-fidelity design.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 px-3 sm:px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Speed</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">Instant Synthesis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 sm:px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cost Accuracy</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">±0.5% Variance</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                className="lg:col-span-5 relative hidden lg:block"
              >
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
                  <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/20 border-8 border-white transition-transform duration-700">
                    <img 
                      src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
                      alt="Premium House Design" 
                      className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-10 text-white">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Badge className="bg-blue-600 mb-4 px-3 py-1 font-bold">PREMIUM ARCHETYPE</Badge>
                        <h3 className="text-3xl font-bold font-rethink mb-2">The Obsidian Minimalist</h3>
                        <p className="text-sm text-slate-300 font-medium">A masterclass in volumetric purity and material honesty.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>


      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:pb-32 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className={`lg:col-span-5 space-y-6 ${activeTab !== 'design' ? 'hidden' : ''}`}>
            {/* Location & Budget Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 overflow-hidden group border">
                <CardHeader className="border-b border-slate-100 bg-white/50 py-5">
                  <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-900">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    Location & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-5">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Select Region</Label>
                    <Select value={config.countryCode} onValueChange={(code) => {
                      const country = countries.find((c) => c.code === code)
                      if (country) setConfig((prev) => ({ ...prev, countryCode: code, country: country.name }))
                    }}>
                      <SelectTrigger className="h-12 border-slate-200 bg-white/50 focus:ring-blue-500 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Land Size</Label>
                        <p className="text-xs font-medium text-slate-500">Total area for development</p>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{config.landSize}m²</span>
                    </div>
                    <Slider 
                      value={[config.landSize]} 
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, landSize: value[0] }))} 
                      min={200} 
                      max={5000} 
                      step={50}
                      className="py-3"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Target Budget</Label>
                        <p className="text-xs font-medium text-slate-500">Estimated investment</p>
                      </div>
                      <span className="text-xl font-bold text-emerald-600">${config.budget.toLocaleString()}</span>
                    </div>
                    <Slider 
                      value={[config.budget]} 
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, budget: value[0] }))} 
                      min={10000} 
                      max={500000} 
                      step={5000}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Construction Cost</Label>
                        <p className="text-xs font-medium text-slate-500">Price per square meter ($)</p>
                      </div>
                      <span className="text-xl font-bold text-blue-600">${config.constructionCostPerSqm || specification?.costPerSqm?.toFixed(0) || 0}</span>
                    </div>
                    <Slider 
                      value={[config.constructionCostPerSqm || specification?.costPerSqm || 400]} 
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, constructionCostPerSqm: value[0] }))} 
                      min={200} 
                      max={2000} 
                      step={25}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-4">Granular Infrastructure</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {['water', 'sewer', 'roads', 'electricity'].map((infra) => (
                        <div key={infra} className="space-y-1.5">
                          <Label className="text-[10px] font-bold text-slate-400 capitalize">{infra}</Label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">$</span>
                            <input
                              type="number"
                              value={config.infrastructureCosts?.[infra as keyof typeof config.infrastructureCosts] || 0}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                infrastructureCosts: {
                                  ...prev.infrastructureCosts!,
                                  [infra]: Number(e.target.value) || 0
                                }
                              }))}
                              className="w-full h-9 pl-6 pr-2 bg-white/50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Visual Style Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 overflow-hidden border">
                <CardHeader className="border-b border-slate-100 bg-white/50 py-5">
                  <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-900">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    Architectural Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {HOME_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setConfig(prev => ({ ...prev, style: style.id as any }))}
                        className={`group relative rounded-2xl overflow-hidden aspect-[3/4] transition-all duration-500 border-2 ${
                          config.style === style.id 
                            ? "border-blue-600 shadow-2xl shadow-blue-500/20 scale-[1.05] z-10" 
                            : "border-transparent hover:border-slate-300 hover:scale-[1.02]"
                        }`}
                      >
                        <img src={style.image} alt={style.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          config.style === style.id ? "from-blue-900/90 via-blue-900/40" : "from-slate-900/80 via-slate-900/20"
                        } to-transparent`} />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white text-left">
                          <p className="font-bold text-sm tracking-tight mb-0.5">{style.name}</p>
                          <p className="text-[10px] opacity-70 leading-tight font-medium uppercase tracking-wider">{style.description}</p>
                        </div>
                        {config.style === style.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1.5 shadow-lg"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Home Size</Label>
                      <Select value={config.sizePreference} onValueChange={(value: any) => setConfig((prev) => ({ ...prev, sizePreference: value }))}>
                        <SelectTrigger className="h-10 border-slate-200 bg-white/50 rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small" className="text-xs">Small (60m²)</SelectItem>
                          <SelectItem value="medium" className="text-xs">Medium (100m²)</SelectItem>
                          <SelectItem value="large" className="text-xs">Large (150m²)</SelectItem>
                          <SelectItem value="spacious" className="text-xs">Spacious (200m²)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Bedrooms</Label>
                      <Select value={String(config.bedrooms)} onValueChange={(value: any) => setConfig((prev) => ({ ...prev, bedrooms: parseInt(value) }))}>
                        <SelectTrigger className="h-10 border-slate-200 bg-white/50 rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1" className="text-xs">1 Bedroom</SelectItem>
                          <SelectItem value="2" className="text-xs">2 Bedrooms</SelectItem>
                          <SelectItem value="3" className="text-xs">3 Bedrooms</SelectItem>
                          <SelectItem value="4" className="text-xs">4 Bedrooms</SelectItem>
                          <SelectItem value="5" className="text-xs">5+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Features Redesign */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-white/10 bg-white/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border">
                <CardHeader className="border-b border-slate-100/50 bg-white/20 py-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-3 text-slate-900 font-rethink tracking-tight">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Zap className="w-4 h-4" />
                      </div>
                      Enhanced Systems
                    </CardTitle>
                    <Badge variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-tighter">Optional Add-ons</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "solarPanels", label: "Solar Array", icon: Zap, cost: 8000, desc: "Photovoltaic grid" },
                      { key: "smartHome", label: "Home OS", icon: Lightbulb, cost: 5000, desc: "Neural automation" },
                      { key: "airConditioning", label: "Climate Control", icon: Droplet, cost: 6000, desc: "Enviro-regulation" },
                      { key: "swimmingPool", label: "Hydra Suite", icon: Droplet, cost: 25000, desc: "Olympic filtration" },
                      { key: "garage", label: "Auto Port", icon: Car, cost: 12000, desc: "Dual e-bay storage" },
                      { key: "garden", label: "Bio-Zone", icon: TreePine, cost: 4000, desc: "Xeriscaped pocket" },
                    ].map(({ key, label, icon: Icon, cost, desc }) => {
                      const isActive = config.features[key as keyof typeof config.features];
                      return (
                        <motion.div 
                          key={key} 
                          role="button"
                          tabIndex={0}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleFeatureToggle(key as any)}
                          className={`relative group flex flex-col p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            isActive
                              ? "border-blue-500 bg-blue-50/50 shadow-[0_8px_20px_-6px_rgba(59,130,246,0.2)]"
                              : "border-slate-200/60 bg-white/30 hover:bg-white/80 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3 pointer-events-none">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                              isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`text-[10px] font-black tracking-widest ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                                +${(cost / 1000).toFixed(0)}K
                              </span>
                              {isActive && (
                                <motion.div 
                                  initial={{ scale: 0 }} 
                                  animate={{ scale: 1 }}
                                  className="mt-1"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-left pointer-events-none">
                            <p className={`text-[11px] font-bold leading-none mb-1 font-rethink ${isActive ? "text-blue-900" : "text-slate-900"}`}>
                              {label}
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium tracking-tight truncate">
                              {desc}
                            </p>
                          </div>
 
                          {/* Selection Overlay Glow */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-500/50 pointer-events-none" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              <Button 
                onClick={handleCalculate} 
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-7 text-lg font-bold rounded-xl shadow-xl shadow-blue-900/20 transition-all active:scale-95"
              >
                Assemble Architecture
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {specification && (
                <Button 
                  variant="outline"
                  onClick={handleExportPDF} 
                  className="w-full bg-white/50 backdrop-blur-md border-slate-200 text-slate-700 py-5 text-sm font-semibold rounded-xl hover:bg-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Manifesto
                </Button>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Results & Visualization */}
          <div className={`lg:col-span-7 space-y-6 ${activeTab !== 'design' ? 'hidden' : ''}`}>
            {/* Show Blueprint logic only if Blueprint Tab is active OR on Desktop */}
            <div>
            <AnimatePresence mode="wait">
              {!specification ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl h-[600px] flex items-center justify-center border">
                    <div className="text-center p-12">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-8 border border-blue-100">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Building2 className="w-12 h-12 text-blue-600" />
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-4 tracking-tight">Project Status: Idle</h3>
                      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium text-sm">
                        Configure your architectural preferences and click <span className="text-blue-600 font-semibold">Assemble Architecture</span> to generate your high-fidelity plan.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* High Fidelity Layout Visualization */}
                  <Card className="border-white/20 bg-white shadow-2xl overflow-hidden border">
                    <CardHeader className="bg-white border-b border-slate-100 text-slate-900 flex flex-row items-center justify-between py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">Plan V.{layoutVariant + 1}.0</CardTitle>
                          <p className="text-[9px] uppercase font-semibold tracking-widest text-slate-400">Blueprint Visualization</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRenders(!showRenders)}
                          className={`h-9 rounded-full border-slate-200 transition-all ${
                            showRenders ? "bg-blue-600 text-white border-blue-500" : "bg-white text-slate-600 hover:bg-slate-50 border"
                          }`}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {showRenders ? "View Blueprint" : "Show Renderings"}
                        </Button>
                        <Button
                          onClick={handleShuffleLayout}
                          variant="outline"
                          className="bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 rounded-full h-9"
                          size="sm"
                        >
                          <Shuffle className="w-4 h-4 mr-2" />
                          Iterate
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-slate-50 p-8 flex justify-center border-b border-slate-100 min-h-[465px]">
                        <AnimatePresence mode="wait">
                          {!showRenders ? (
                            <motion.div 
                              key="blueprint"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.02 }}
                              className="w-full flex flex-col items-center"
                            >
                              <div className="flex gap-4 mb-6 w-full max-w-lg">
                                    <Button 
                                      variant="outline" 
                                      className="flex-1 py-7 bg-blue-50/50 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100/50 transition-all font-bold group shadow-xl shadow-blue-500/10"
                                      onClick={() => router.push('/planner')}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                          <Box className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-[11px] leading-none mb-0.5 font-black uppercase tracking-widest text-blue-600/70">Studio Mode</p>
                                          <p className="text-sm text-slate-900 font-bold">Open Full-Page Planner</p>
                                        </div>
                                      </div>
                                    </Button>
                                  </div>

                                {/* Ready Presets Section */}
                                <div className="flex flex-col gap-3 w-full max-w-lg mb-8">
                                  <div className="flex items-center justify-between mb-1">
                                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ready Architect designs</Label>
                                    <Badge variant="outline" className="text-[8px] font-bold border-blue-100 text-blue-600 bg-blue-50">Hand-Crafted</Badge>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2">
                                    {BLUEPRINT_PRESETS.map((preset) => (
                                      <button 
                                        key={preset.id}
                                        onClick={() => setConfig({ ...config, architecture: { rooms: preset.rooms } })}
                                        className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                                          config.architecture?.rooms?.[0]?.id?.startsWith(preset.id)
                                            ? "border-blue-600 ring-2 ring-blue-100"
                                            : "border-slate-200 hover:border-blue-400"
                                        }`}
                                      >
                                        <img src={preset.image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-2">
                                          <p className="text-[8px] font-bold text-white uppercase truncate">{preset.name}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                              <div className="relative group p-8 bg-slate-100 rounded-[2rem] border border-slate-200">
                                {/* Land Overlay */}
                                <div className="border-4 border-slate-200 border-dashed relative flex items-center justify-center bg-slate-100/50 p-12 rounded-2xl shadow-inner overflow-hidden" style={{ width: "480px", height: "400px" }}>
                                  <div className="absolute top-4 left-6 flex items-center gap-2 text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                                    <Info className="w-3 h-3" />
                                    Site Boundary: {config.landSize}m²
                                  </div>
                                  
                                  {/* Building Footprint */}
                                  <motion.div 
                                    layoutId="building"
                                    className="border-[2px] border-slate-950 bg-[#0f172a] relative shadow-2xl overflow-hidden rounded-sm" 
                                    style={{ width: "360px", height: "240px" }}
                                  >
                                    {/* Technical Grid Overlay */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                      style={{
                                        backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
                                        backgroundSize: `20px 20px`
                                      }}
                                    />
                                    
                                    <div className="absolute inset-0">
                                      {config.architecture?.rooms && config.architecture.rooms.length > 0 ? (() => {
                                        const rooms = config.architecture.rooms;
                                        const minX = Math.min(...rooms.map((r: any) => r.x));
                                        const minY = Math.min(...rooms.map((r: any) => r.y));
                                        const maxX = Math.max(...rooms.map((r: any) => r.x + r.width));
                                        const maxY = Math.max(...rooms.map((r: any) => r.y + r.height));
                                        
                                        const dWidth = maxX - minX || 1;
                                        const dHeight = maxY - minY || 1;

                                        // Full Fill Optimization
                                        const padding = 8;
                                        const containerW = 360 - padding;
                                        const containerH = 240 - padding;
                                        const scale = Math.min(containerW / dWidth, containerH / dHeight);
                                        
                                        const offsetX = (360 - dWidth * scale) / 2 - minX * scale;
                                        const offsetY = (240 - dHeight * scale) / 2 - minY * scale;

                                        return (
                                          <div className="w-full h-full relative p-0">
                                            {rooms.map((room: any) => (
                                              <motion.div 
                                                key={room.id}
                                                className={`absolute rounded-xs border-[0.5px] border-white/20 flex flex-col items-center justify-center ${room.color} bg-opacity-30 backdrop-blur-[1px]`}
                                                style={{
                                                  left: room.x * scale + offsetX + 0.5,
                                                  top: room.y * scale + offsetY + 0.5,
                                                  width: room.width * scale - 1,
                                                  height: room.height * scale - 1,
                                                }}
                                              >
                                                <div className="flex flex-col items-center text-center p-1 pointer-events-none overflow-hidden hover:scale-110 transition-transform">
                                                  <p className="text-[8px] font-black uppercase tracking-tighter text-white truncate w-full shadow-sm">
                                                    {room.name}
                                                  </p>
                                                  <p className="text-[6px] font-bold text-white/50 leading-none">
                                                    {(room.width/100).toFixed(1)}m × {(room.height/100).toFixed(1)}m
                                                  </p>
                                                </div>
                                              </motion.div>
                                            ))}
                                          </div>
                                        );
                                      })() : (
                                      <div className="absolute inset-0 grid gap-1.5 p-3" style={{ gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)" }}>
                                        <div className="bg-blue-500/10 border border-white/30 rounded-sm row-span-2 flex flex-col items-center justify-center p-2"><div className="text-[9px] font-semibold text-white uppercase">Master</div><div className="text-[7px] text-white/50">4.2m × 3.8m</div></div>
                                        <div className="bg-blue-500/10 border border-white/20 rounded-sm flex flex-col items-center justify-center"><div className="text-[7px] font-medium text-white uppercase">Suite 2</div><div className="text-[6px] text-white/40">3.2m × 3.0m</div></div>
                                        <div className="bg-amber-500/10 border border-white/30 rounded-sm row-span-2 flex flex-col items-center justify-center p-2"><div className="text-[9px] font-semibold text-white uppercase">Living</div><div className="text-[7px] text-white/50">5.5m × 4.8m</div></div>
                                        <div className="bg-rose-500/10 border border-white/30 rounded-sm flex flex-col items-center justify-center"><div className="text-[7px] font-medium text-white uppercase">Kitchen</div></div>
                                      </div>
                                    )}
                                    </div>
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest">{Math.round(specification!.totalBuildingArea)}m²</div>
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="renders"
                              initial={{ opacity: 0, scale: 1.05 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="w-full max-w-2xl px-4"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                {[
                                  { title: "Exterior", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" },
                                  { title: "Empty Master Suite", url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800" },
                                  { title: "Empty Living", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" },
                                  { title: "Empty Space Detail", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800" }
                                ].map((render, idx) => (
                                  <div key={idx} className="group relative rounded-xl overflow-hidden aspect-video border border-slate-200">
                                    <img src={render.url} alt={render.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <p className="text-white text-[10px] font-bold uppercase tracking-widest">{render.title}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white">
                        <div className="p-6 text-center">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Site Coverage</p>
                          <p className="text-xl font-bold text-blue-600">{((specification!.totalBuildingArea / config.landSize) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-6 text-center">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Eco Balance</p>
                          <p className="text-xl font-bold text-emerald-600">{((1 - specification!.totalBuildingArea / config.landSize) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-6 text-center">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Build</p>
                          <p className="text-xl font-bold text-indigo-600">{Math.round(specification!.totalBuildingArea)}m²</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Bedrooms", value: config.bedrooms, icon: Bed, color: "blue", sub: "Units" },
                      { label: "Water Demand", value: `${Math.round(specification!.dailyWaterDemand)}L`, icon: Droplet, color: "blue", sub: "Daily Est." },
                      { label: "Electricity", value: `${Math.round(specification!.electricityDemand)}kWh`, icon: Zap, color: "amber", sub: "Daily Est." },
                      { label: "Waste Gen", value: `${Math.round(specification!.wasteGeneration)}kg`, icon: Car, color: "slate", sub: "Daily Est." },
                      { label: "Bathrooms", value: specification!.bathrooms, icon: Droplet, color: "emerald", sub: "Calculated" },
                      { label: "Timeline", value: `${specification!.estimatedTimelineMonths}m`, icon: Sparkles, color: "amber", sub: "Est. Duration" }
                    ].map((stat, i) => (
                      <Card key={i} className="border-white/20 bg-white shadow-xl shadow-slate-100/50 border overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                              <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
                              <p className="text-[9px] font-semibold text-slate-500 mt-2">{stat.sub}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                              <stat.icon className="w-6 h-6" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Studio Renders Gallery */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 font-rethink tracking-tight uppercase">Studio Renders</h3>
                      </div>
                      <Badge variant="outline" className="border-blue-100 text-blue-600 text-[9px] font-black tracking-widest uppercase bg-blue-50/50">4 High-Fidelity Views</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: "Exterior Phase", type: "Aerial View", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" },
                        { title: "Master Suite", type: "Interior Detail", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800" },
                        { title: "Gourmet Space", type: "Social Hub", url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800" },
                        { title: "Retreat Spa", type: "Sanctuary", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" }
                      ].map((render, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer border-2 border-transparent hover:border-blue-500/50 transition-all shadow-lg"
                        >
                          <img 
                            src={render.url} 
                            alt={render.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-[10px] font-bold text-white mb-0.5">{render.title}</p>
                            <p className="text-[8px] text-white/70 uppercase tracking-widest">{render.type}</p>
                          </div>
                          
                          {/* Cinematic Border Overlay */}
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-900 mb-1">Architectural Verification</p>
                          <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">This specification has been validated against regional building codes and structural safety standards for {config.country}.</p>
                        </div>
                      </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

            {/* BLUEPRINT TAB VIEW */}
            {activeTab === 'blueprint' && specification && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-12 space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Technical Specs Table */}
                  <Card className="lg:col-span-2 border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden border">
                    <CardHeader className="border-b border-slate-100 bg-white/50 py-5">
                      <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-900 font-rethink">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <LayoutList className="w-5 h-5" />
                        </div>
                        Technical Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Dimension</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Area (m²)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {specification.roomBreakdown.map((room, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-slate-900">{room.room}</td>
                                <td className="px-6 py-4 text-xs text-slate-500 font-medium">{room.description}</td>
                                <td className="px-6 py-4 text-xs font-black text-blue-600 text-right">{room.area.toFixed(1)}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50/30 font-bold border-t-2 border-blue-100">
                              <td colSpan={2} className="px-6 py-4 text-xs text-slate-900">Total Structural Footprint</td>
                              <td className="px-6 py-4 text-sm font-black text-blue-600 text-right">{specification.totalBuildingArea}m²</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Architectural Advisor */}
                  <div className="space-y-6">
                    <Card className="border-blue-200 bg-blue-50/50 backdrop-blur-xl shadow-xl border">
                      <CardHeader className="py-5">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-900">
                          <Sparkles className="w-4 h-4" />
                          Architectural Advisor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        {getExpertAdvice().filter(a => a.type === 'architectural').map((advice, i) => (
                          <div key={i} className="bg-white/80 p-4 rounded-xl border border-blue-100 shadow-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{advice.title}</span>
                              <Badge className="bg-blue-100 text-blue-700 text-[8px] border-none">{advice.impact}</Badge>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{advice.text}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Scale className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold font-rethink">Structural Integrity</h4>
                      <p className="text-xs text-blue-100 leading-relaxed">Our engine ensures every calculation adheres to the Eurocode and local KBR standards for load-bearing optimization.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FINANCE TAB VIEW */}
            {activeTab === 'finance' && specification && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-12 space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Financial Breakdown */}
                  <Card className="lg:col-span-8 border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl border overflow-hidden">
                    <CardHeader className="border-b border-slate-100 bg-white/50 py-5">
                      <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-900 font-rethink">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        Financial Engineering & Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-10">
                      <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        {[
                          { label: "Total Capex", value: specification.totalCost, color: "text-blue-600" },
                          { label: "Cost/m²", value: specification.costPerSqm.toFixed(0), prefix: "$", color: "text-slate-900" },
                          { label: "Opex (Annual)", value: specification.annualMaintenanceCost, color: "text-emerald-600" },
                          { label: "Delivery", value: specification.estimatedTimelineMonths, suffix: " Mo", color: "text-indigo-600" }
                        ].map((stat, i) => (
                          <div key={i} className="space-y-1">
                            <p className="text-[8px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-sm sm:text-xl font-medium font-rethink ${stat.color}`}>
                              {stat.prefix || "$"}{stat.value.toLocaleString()}{stat.suffix}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Efficiency Phase</p>
                          <h4 className="text-base sm:text-lg font-medium text-slate-900 font-rethink">Budget Utilization</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                          <div className="text-center sm:text-right">
                            <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 uppercase">Status</p>
                            <Badge className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-medium uppercase tracking-widest ${
                              budgetStatus === 'over' 
                                ? "bg-red-500 hover:bg-red-600 text-white" 
                                : budgetStatus === 'under'
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                  : "bg-amber-500 hover:bg-amber-600 text-white"
                            }`}>
                              {budgetStatus === 'over' ? 'Over Budget' : budgetStatus === 'under' ? 'Under Budget' : 'Within Budget'}
                            </Badge>
                          </div>
                          <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                          <div className="text-center sm:text-right">
                            <p className="text-[8px] sm:text-[10px] font-medium text-slate-400 uppercase">Remaining</p>
                            <p className={`text-xs sm:text-sm font-medium ${specification.remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {specification.remainingBudget >= 0 ? '+' : ''}${specification.remainingBudget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              Construction Phases
                            </h4>
                            <Badge variant="outline" className="text-[8px] sm:text-[10px] w-fit">Estimated Efficiency: 94%</Badge>
                         </div>
                         <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:absolute before:inset-y-0 before:left-2 sm:before:left-3 before:w-px before:bg-slate-200">
                            {[
                              { phase: "Planning & Permits", duration: "1-2 Months", progress: 100 },
                              { phase: "Site Preparation", duration: "1 Month", progress: 0 },
                              { phase: "Structural Shell", duration: "3-4 Months", progress: 0 },
                              { phase: "Systems & Finishing", duration: "2 Months", progress: 0 }
                            ].map((p, i) => (
                              <div key={i} className="relative group">
                                <div className={`absolute top-0 -left-5 sm:-left-8 w-5 sm:w-6 h-5 sm:h-6 rounded-full border-3 sm:border-4 border-white shadow-sm flex items-center justify-center ${i === 0 ? "bg-emerald-500" : "bg-slate-200"}`} />
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-900">{p.phase}</p>
                                    <p className="text-[10px] sm:text-[10px] text-slate-400 font-medium">{p.duration}</p>
                                  </div>
                                  {i === 0 && <Badge className="bg-emerald-100 text-emerald-700 text-[8px] border-none shadow-none mt-0.5">COMPLETED</Badge>}
                                </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Advice */}
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-emerald-200 bg-emerald-50/50 backdrop-blur-xl shadow-xl border">
                      <CardHeader className="py-5">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-900">
                          <TrendingUp className="w-4 h-4" />
                          Investment Advisor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        {getExpertAdvice().filter(a => a.type === 'financial').map((advice, i) => (
                          <div key={i} className="bg-white/80 p-4 rounded-xl border border-emerald-100 shadow-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">{advice.title}</span>
                              <Badge className="bg-emerald-100 text-emerald-700 text-[8px] border-none">{advice.impact}</Badge>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{advice.text}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
                      <h4 className="text-2xl font-semibold font-rethink mb-4 leading-tight">Secure Your<br />Asset's Value.</h4>
                      <p className="text-xs text-indigo-100 mb-8 leading-relaxed font-medium opacity-80">
                        Resale projections for "{config.style}" archetypes in {config.country} show a 22% premium over standard builds due to integrated architectural efficiency.
                      </p>
                      <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-medium rounded-2xl py-6">
                        Unlock Yield Report
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile-First Navigation Bar */}
      <div className="fixed bottom-6 left-6 right-6 z-50 lg:hidden pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-[2rem] h-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between px-3 relative overflow-hidden">
            
            <button 
              suppressHydrationWarning
              onClick={() => setActiveTab('design')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative z-10 ${activeTab === 'design' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutList className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'design' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-tight">Design</span>
              {activeTab === 'design' && (
                <motion.div layoutId="mobileActiveTab" className="absolute bottom-0 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
            
            <button 
              suppressHydrationWarning
              onClick={() => setActiveTab('blueprint')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative z-10 ${activeTab === 'blueprint' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Maximize2 className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'blueprint' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-tight">Blueprint</span>
              {activeTab === 'blueprint' && (
                <motion.div layoutId="mobileActiveTab" className="absolute bottom-0 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>

            <div className="flex-1 flex justify-center -mt-12 relative z-20">
              <motion.button 
                suppressHydrationWarning
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/"}
                className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-full shadow-[0_12px_24px_rgba(37,99,235,0.4)] flex items-center justify-center text-white ring-8 ring-white/60 backdrop-blur-md relative group"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <HomeIcon className="w-7 h-7 relative z-10" />
              </motion.button>
            </div>

            <button 
              suppressHydrationWarning
              onClick={() => setActiveTab('finance')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative z-10 ${activeTab === 'finance' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <DollarSign className={`w-5 h-5 transition-transform duration-300 ${activeTab === 'finance' ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold tracking-tight">Finance</span>
              {activeTab === 'finance' && (
                <motion.div layoutId="mobileActiveTab" className="absolute bottom-0 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>

            <button 
              suppressHydrationWarning
              onClick={() => window.location.href = "/"}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-red-500 transition-all relative z-10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {showProfile && (
        <UserProfile 
          onClose={() => setShowProfile(false)} 
          projectCount={0} // These can be dynamic if needed
          completedCount={0}
          inProgressCount={0}
        />
      )}
    </div>

  )
}

function generatePDFContent(config: HomeBuilderConfig & { bedrooms?: number }, spec: HomeSpecification): string {
  const featureRow = spec.featuresCost > 0 ? `<tr><td>Premium Features</td><td>$${spec.featuresCost.toLocaleString()}</td></tr>` : ""
  const remainingText = spec.remainingBudget >= 0 ? `+$${spec.remainingBudget.toLocaleString()}` : `-$${Math.abs(spec.remainingBudget).toLocaleString()}`
  const statusColor = spec.budgetStatus === 'over' ? '#ef4444' : spec.budgetStatus === 'under' ? '#10b981' : '#f59e0b'
  const statusLabel = spec.budgetStatus === 'over' ? 'OVER BUDGET' : spec.budgetStatus === 'under' ? 'UNDER BUDGET' : 'WITHIN BUDGET'
  
  const styleContent = `
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; padding: 40px; color: #1e293b; background: #f8fafc; }
    .container { background: white; padding: 50px; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; max-width: 750px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 25px; margin-bottom: 35px; }
    .logo { font-size: 20px; font-weight: 700; color: #1e293b; letter-spacing: -0.4px; }
    .status { background: #f0fdf4; color: #166534; padding: 5px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    h1 { font-size: 26px; font-weight: 800; margin: 0; color: #0f172a; }
    h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-top: 35px; margin-bottom: 18px; border-left: 3px solid #3b82f6; padding-left: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px; }
    .stat-card { background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #f1f5f9; }
    .stat-label { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
    .stat-value { font-size: 16px; font-weight: 700; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
    td { padding: 12px 0; font-size: 13px; font-weight: 500; border-bottom: 1px solid #f1f5f9; }
    .total-row td { padding-top: 25px; border: none; font-size: 20px; font-weight: 800; color: #0f172a; }
    .budget-alert { background: #f0fdfa; border: 1px solid #ccfbf1; padding: 18px; border-radius: 14px; margin-top: 35px; }
    .footer { margin-top: 50px; padding-top: 25px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; text-align: center; }
  `
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>StudioConfig Architectural Manifesto</title>
        <style>${styleContent}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">StudioConfig.</div>
            <div class="status">Verified Specification</div>
          </div>
          
          <h1>Architectural Manifesto</h1>
          <p style="color: #64748b; margin-top: 10px;">Project ID: ${config.id.toUpperCase()}</p>
          
          <h2>Structure Attributes</h2>
          <div class="grid">
            <div class="stat-card">
              <div class="stat-label">Country</div>
              <div class="stat-value">${config.country}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Building Style</div>
              <div class="stat-value">${config.style.toUpperCase()}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Area</div>
              <div class="stat-value">${Math.round(spec.totalBuildingArea)}m²</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Estimated Delivery</div>
              <div class="stat-value">${spec.estimatedTimelineMonths} Months</div>
            </div>
          </div>

          <h2>Financial Engineering</h2>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Structural Construction</td><td>$${spec.buildingCost.toLocaleString()}</td></tr>
              <tr><td>Specialized Labor</td><td>$${spec.laborCost.toLocaleString()}</td></tr>
              <tr><td>Infrastructure & Systems</td><td>$${spec.infrastructureCost.toLocaleString()}</td></tr>
              ${featureRow}
              <tr class="total-row">
                <td>Total Capital Required</td>
                <td style="text-align: right; color: #3b82f6;">$${spec.totalCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="budget-alert" style="border-left: 5px solid ${statusColor};">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Capital Efficiency</div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <div style="font-size: 17px; font-weight: 800; color: ${statusColor};">${statusLabel}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Delta: ${remainingText} (${spec.percentageUsed.toFixed(1)}% Used)</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; font-weight: 700; color: #94a3b8;">ANNUAL OPEX</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a;">$${spec.annualMaintenanceCost.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Generated by StudioConfig Architectural Intelligence Engine</p>
            <p style="margin-top: 8px;">&copy; 2027 StudioConfig Global. All Rights Reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  
  return html
}
