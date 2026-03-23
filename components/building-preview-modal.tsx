"use client";

import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Building2,
  Home,
  Layers,
  ChevronRight,
  BedDouble,
  Sofa,
  DoorOpen,
} from "lucide-react";
import type { Scenario, ScenarioResults } from "@/lib/types";
import Image from "next/image";

interface BuildingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  results: ScenarioResults;
}

/* ── Image view descriptor ──────────────────────────────── */
interface ImageView {
  id: string;
  label: string;
  icon: React.ReactNode;
  src: string;
  caption: string;
}

export function BuildingPreviewModal({
  isOpen,
  onClose,
  scenario,
  results,
}: BuildingPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIsVisible(true);
      setActiveView(0);
      const timer = setTimeout(() => setIsLoading(false), 2400);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const projectType = scenario.projectType || "apartment";
  const floors = scenario.numberOfFloors || 5;
  const finish = scenario.finishLevel || "standard";
  const isPremium = finish === "improved" || floors >= 8;
  const isBasic = finish === "basic" || floors <= 3;

  // Build image gallery based on scenario type
  const getImageViews = (): ImageView[] => {
    if (projectType === "single-family") {
      return [
        {
          id: "exterior",
          label: "Exterior",
          icon: <Home className="w-3.5 h-3.5" />,
          src: "https://b4.3dsky.org/media/cache/tuk_model_custom_filter_en/model_images/0000/0000/1542/1542837.5a2ba7859591f.jpeg",
          caption: `Modern ${scenario.houseSize || 120}m² single-family home with contemporary exterior design, landscaped front yard, and covered parking`,
        },
        {
          id: "bedroom",
          label: "Bedroom",
          icon: <BedDouble className="w-3.5 h-3.5" />,
          src: "/building-previews/bedroom-standard.png",
          caption: `Master bedroom — ${scenario.houseSize ? Math.round(scenario.houseSize * 0.17) : 20}m² with natural light, built-in wardrobe, and hardwood flooring`,
        },
        {
          id: "living",
          label: "Living Area",
          icon: <Sofa className="w-3.5 h-3.5" />,
          src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
          caption: `Open-plan living and dining area — ${scenario.houseSize ? Math.round(scenario.houseSize * 0.25) : 30}m² with large windows and contemporary finishes`,
        },
        {
          id: "design",
          label: "Entrance",
          icon: <DoorOpen className="w-3.5 h-3.5" />,
          src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
          caption: `Front entrance and landscaping — ${scenario.lotSize || 500}m² lot with ${(100 - ((scenario.houseSize || 120) / (scenario.lotSize || 500)) * 100).toFixed(0)}% green space coverage`,
        },
      ];
    }

    // Apartment / Mixed
    const exteriorSrc = isPremium
      ? "https://b4.3dsky.org/media/cache/tuk_model_custom_filter_en/model_images/0000/0000/0466/466342.56b5e5a3e29fd.jpeg"
      : isBasic
        ? "/building-previews/apartment-basic.png"
        : "https://i.pinimg.com/1200x/b5/f0/ba/b5f0ba69a8fa8e32c383605d13a14e77.jpg";

    const bedroomSrc = isPremium
      ? "/building-previews/bedroom-premium.png"
      : "/building-previews/bedroom-standard.png";

    const finishLabel = isPremium ? "premium" : isBasic ? "basic" : "standard";

    return [
      {
        id: "exterior",
        label: "Exterior",
        icon: <Building2 className="w-3.5 h-3.5" />,
        src: exteriorSrc,
        caption: `${floors}-story ${finishLabel} residential building with ${results.totalUnits} apartments across ${floors} floors, ${scenario.unitsPerFloor || 8} units per floor`,
      },
      {
        id: "bedroom",
        label: "Bedroom",
        icon: <BedDouble className="w-3.5 h-3.5" />,
        src: bedroomSrc,
        caption: `Typical bedroom unit — ${isPremium ? "20m² master suite with floor-to-ceiling windows and marble accent wall" : "15m² room with built-in wardrobe, hardwood floor, and natural light"}`,
      },
      {
        id: "living",
        label: "Living Room",
        icon: <Sofa className="w-3.5 h-3.5" />,
        src: isPremium
          ? "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop"
          : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
        caption: `Open-plan living area — ${scenario.unitSize || 50}m² total unit size with ${finishLabel} finishes, kitchen counter, and dining space`,
      },
      {
        id: "lobby",
        label: "Lobby",
        icon: <DoorOpen className="w-3.5 h-3.5" />,
        src: isPremium
          ? "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop"
          : "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
        caption: `Building entrance & lobby — modern reception area with secure access, mailboxes, and elevator access to ${floors} floors`,
      },
    ];
  };

  const views = getImageViews();
  const currentView = views[activeView];

  const typeIcon = {
    apartment: <Building2 className="w-5 h-5" />,
    "single-family": <Home className="w-5 h-5" />,
    mixed: <Layers className="w-5 h-5" />,
  };

  const specs =
    projectType === "single-family"
      ? [
          { label: "House Size", value: `${scenario.houseSize || 120}m²` },
          { label: "Lot Size", value: `${scenario.lotSize || 500}m²` },
          {
            label: "Bedrooms",
            value: `${Math.round((scenario.houseSize || 120) / 30)}`,
          },
          {
            label: "Finish",
            value: finish.charAt(0).toUpperCase() + finish.slice(1),
          },
        ]
      : [
          { label: "Floors", value: `${floors}` },
          { label: "Units/Floor", value: `${scenario.unitsPerFloor || 8}` },
          { label: "Total Units", value: `${results.totalUnits}` },
          { label: "Unit Size", value: `${scenario.unitSize || 50}m²` },
          { label: "Population", value: `${results.estimatedPopulation}` },
          {
            label: "Finish",
            value: finish.charAt(0).toUpperCase() + finish.slice(1),
          },
        ];

  const costBreakdown = [
    {
      label: "Construction Cost",
      value: `$${results.constructionCost?.toLocaleString() || "N/A"}`,
    },
    {
      label: "Infrastructure",
      value: `$${results.infrastructureCost?.toLocaleString() || "N/A"}`,
    },
    {
      label: "Total Project Cost",
      value: `$${results.totalProjectCost?.toLocaleString() || "N/A"}`,
      highlight: true,
    },
    {
      label: "Cost per Unit",
      value: `$${results.costPerUnit?.toLocaleString() || "N/A"}`,
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-[#0a1628]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transition-all duration-500 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 px-8">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2B0D3E] to-[#7A3F91] flex items-center justify-center animate-pulse">
                <Sparkles
                  className="w-8 h-8 text-white animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div className="absolute -inset-2 rounded-3xl border-2 border-[#C59DD9]/30 animate-ping opacity-30" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Generating Building Preview
            </h3>
            <p className="text-sm text-slate-500 text-center max-w-sm">
              Creating 4 photorealistic views of your {floors}-floor,{" "}
              {results.totalUnits}-unit scenario...
            </p>
            {/* Progress steps */}
            <div className="mt-8 space-y-2 w-full max-w-xs">
              {[
                "Building exterior",
                "Bedroom layout",
                "Living area",
                "Building entrance",
              ].map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-3 text-sm transition-all"
                  style={{
                    animation: `fadeInSlide 0.4s ease-out ${i * 0.5}s both`,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-[#7A3F91]/10 flex items-center justify-center">
                    <div
                      className="w-2 h-2 rounded-full bg-[#7A3F91] animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  </div>
                  <span className="text-slate-600 font-medium">{step}</span>
                </div>
              ))}
            </div>
            <style jsx>{`
              @keyframes fadeInSlide {
                from {
                  opacity: 0;
                  transform: translateX(-8px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
          </div>
        ) : (
          <div>
            {/* Main image */}
            <div className="relative h-[320px] sm:h-[380px] overflow-hidden rounded-t-2xl bg-slate-100">
              {currentView.src.startsWith("/") ? (
                <Image
                  src={currentView.src}
                  alt={currentView.label}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentView.src}
                  alt={currentView.label}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#7A3F91]" />
                <span className="text-xs font-bold text-slate-900">
                  AI Generated Preview
                </span>
              </div>

              {/* Image counter */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0a1628]/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-semibold">
                {activeView + 1} / {views.length}
              </div>

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 text-[#C59DD9] mb-1.5">
                  {typeIcon[projectType as keyof typeof typeIcon]}
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {currentView.label} View
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                  {currentView.caption}
                </p>
              </div>
            </div>

            {/* Image tabs */}
            <div className="flex border-b border-slate-200">
              {views.map((view, idx) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(idx)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all ${
                    idx === activeView
                      ? "text-[#2B0D3E] border-b-2 border-[#7A3F91] bg-[#F2EAF7]"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {view.icon}
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              ))}
            </div>

            {/* Image thumbnails */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100">
              {views.map((view, idx) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(idx)}
                  className={`relative h-16 sm:h-20 rounded overflow-hidden transition-all ${
                    idx === activeView
                      ? "ring-2 ring-[#0a1628] opacity-100"
                      : "opacity-60 hover:opacity-90"
                  }`}
                >
                  {view.src.startsWith("/") ? (
                    <Image
                      src={view.src}
                      alt={view.label}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={view.src}
                      alt={view.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[#0a1628]/20" />
                </button>
              ))}
            </div>

            {/* Specs, costs, and summary */}
            <div className="p-5 space-y-5">
              {/* Scenario title */}
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {scenario.name || "Building Preview"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {projectType === "apartment"
                    ? "Multi-Unit Apartments"
                    : projectType === "single-family"
                      ? "Single-Family Home"
                      : "Mixed Development"}
                  · {finish.charAt(0).toUpperCase() + finish.slice(1)} Finish
                </p>
              </div>

              {/* Quick specs */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  Specifications
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100"
                    >
                      <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                        {spec.label}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost breakdown */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                  Cost Breakdown
                </h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  {costBreakdown.map((item, idx) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between px-4 py-2.5 ${
                        item.highlight
                          ? "bg-[#2B0D3E] text-white"
                          : idx % 2 === 0
                            ? "bg-white"
                            : "bg-[#F2EAF7]/30"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${item.highlight ? "text-[#C59DD9]" : "text-slate-600"}`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`text-sm font-bold ${item.highlight ? "text-white" : "text-slate-900"}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unit mix bar */}
              {projectType === "apartment" && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                    Unit Mix
                  </h3>
                  <div className="flex gap-1.5 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C59DD9] rounded-full"
                      style={{
                        width: `${scenario.unitMix?.oneBedroom || 40}%`,
                      }}
                    />
                    <div
                      className="bg-[#7A3F91] rounded-full"
                      style={{
                        width: `${scenario.unitMix?.twoBedroom || 35}%`,
                      }}
                    />
                    <div
                      className="bg-[#2B0D3E] rounded-full"
                      style={{
                        width: `${scenario.unitMix?.threeBedroom || 25}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-slate-500 font-medium">
                      1BR · {scenario.unitMix?.oneBedroom || 40}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      2BR · {scenario.unitMix?.twoBedroom || 35}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      3BR · {scenario.unitMix?.threeBedroom || 25}%
                    </span>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 bg-[#F2EAF7] rounded-xl p-3 border border-[#C59DD9]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#7A3F91] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#7A3F91] leading-relaxed">
                  AI-generated preview based on your scenario parameters. Actual
                  design may vary based on architectural plans and local
                  regulations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Trigger Button ─────────────────────────────────────── */
export function GeneratePreviewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#2B0D3E] to-[#7A3F91] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-[#C59DD9]" />
      </div>
      <div className="flex-1 text-left">
        <div className="text-sm font-bold">Generate Building Preview</div>
        <div className="text-[10px] text-[#C59DD9]/70 font-medium">
          4 AI-powered views · Exterior, Bedroom, Living, Entrance
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#C59DD9] group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
