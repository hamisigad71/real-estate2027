"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FolderPlus,
  BarChart3,
  GitCompare,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Globe,
  TrendingUp,
  CheckCircle2,
  Play,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    label: "Create a Project",
    headline: "Start with your site",
    description: `Click "New Project" to define your land area, city, and region. Give your housing development a name and let RHS Engine set up your workspace — ready in under 30 seconds.`,
    cta: "Create your first project",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    icon: FolderPlus,
    gradient: "from-[#2B0D3E] via-[#7A3F91] to-[#C59DD9]",
    tag: "STEP 01",
    highlight: "Ready in 30 seconds",
  },
  {
    number: "02",
    label: "Run Scenarios",
    headline: "Model every possibility",
    description:
      "Build unlimited cost-and-layout scenarios. Adjust unit mix, land coverage, infrastructure specs, and construction cost per m2 — the engine recalculates everything live.",
    cta: "Open the simulator",
    image:
      "https://images.unsplash.com/photo-1545622783-b3e021430fee?q=80&w=1200&auto=format&fit=crop",
    icon: BarChart3,
    gradient: "from-[#7A3F91] via-[#9B59B6] to-[#C59DD9]",
    tag: "STEP 02",
    highlight: "Unlimited scenarios",
  },
  {
    number: "03",
    label: "Compare Scenarios",
    headline: "Find the optimal plan",
    description:
      "Stack scenarios side-by-side in the Scenario Comparison Engine. Instantly see which layout maximises units, minimises cost per household, and best meets regulatory compliance.",
    cta: "Compare scenarios",
    image:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=1200&auto=format&fit=crop",
    icon: GitCompare,
    gradient: "from-[#2B0D3E] via-[#7A3F91] to-[#C59DD9]",
    tag: "STEP 03",
    highlight: "Side-by-side analysis",
  },
  {
    number: "04",
    label: "Export & Share",
    headline: "Present with confidence",
    description:
      "Generate a professional PDF report with charts, maps, cost breakdowns, and regulatory checklists. Share it with stakeholders, investors, or government bodies — fully branded.",
    cta: "Generate a report",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    icon: Download,
    gradient: "from-[#7A3F91] via-[#9B59B6] to-[#C59DD9]",
    tag: "STEP 04",
    highlight: "Print-ready PDF",
  },
];

const FEATURES = [
  {
    icon: Building2,
    title: "Real-Time Financial Modelling",
    body: "Every slider move instantly recalculates total project cost, ROI, and per-unit affordability — no spreadsheets required.",
    gradient: "from-[#2B0D3E] to-[#7A3F91]",
  },
  {
    icon: TrendingUp,
    title: "5–20 Year Demand Forecasting",
    body: "Demographic-driven projections show how housing demand evolves in your target area over the next two decades.",
    gradient: "from-[#7A3F91] to-[#C59DD9]",
  },
  {
    icon: Globe,
    title: "Infrastructure Assessment",
    body: "Automatically evaluate water, sewer, roads, and electricity capacity against your planned density.",
    gradient: "from-[#2B0D3E] to-[#7A3F91]",
  },
  {
    icon: Users,
    title: "Compliance & Zoning",
    body: "Built-in regulatory checklists cross-reference your project against local zoning laws and affordable-housing mandates.",
    gradient: "from-[#7A3F91] to-[#C59DD9]",
  },
];

const PROOFS = [
  { icon: Zap, value: "50K+", label: "Units Planned" },
  { icon: Clock, value: "2 days", label: "Avg. Time to Report" },
  { icon: Shield, value: "$2B+", label: "Capital Modelled" },
  { icon: Building2, value: "15+", label: "Organisations" },
];

interface GetStartedGuideProps {
  onCreateProject: () => void;
}

export function GetStartedGuide({ onCreateProject }: GetStartedGuideProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mt-10 space-y-12">
      {/* ── Section Header ─────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative flex h-9 w-9 shrink-0 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-br from-[#7A3F91] to-[#2B0D3E] shadow-lg shadow-[#7A3F91]/30">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/10 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              How to Get Started
            </h2>
            <p className="text-[10px] sm:text-xs font-medium text-[#7A3F91] uppercase tracking-wide sm:tracking-widest mt-0.5 leading-snug">
              Your complete guide — four simple steps
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto rounded-lg sm:rounded-xl border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-[#7A3F91]/40 hover:bg-[#F2EAF7] hover:text-[#7A3F91]"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" /> Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" /> Expand
            </>
          )}
        </button>
      </div>

      {expanded && (
        <>
          {/* ── Premium Steps (2 cols on phone, compact) ──────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-5">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-md md:shadow-lg border border-slate-100/80 transition-all duration-500 hover:-translate-y-0.5 md:hover:-translate-y-2 hover:shadow-xl md:hover:shadow-2xl hover:shadow-[#7A3F91]/10 cursor-pointer"
                >
                  {/* Image with overlay */}
                  <div className="relative h-30 sm:h-36 md:h-56 w-full shrink-0 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
                    {/* Purple tint on hover */}
                    <div className="absolute inset-0 bg-linear-to-br from-[#7A3F91]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Top row: badge + number */}
                    <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 md:top-4 md:left-4 md:right-4 flex items-start justify-between gap-1">
                      <span
                        className={`inline-flex max-w-[58%] items-center rounded-full bg-linear-to-r ${step.gradient} px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-3 md:py-1 text-[6px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wide sm:tracking-wider md:tracking-[0.2em] text-white shadow-md md:shadow-lg leading-tight`}
                      >
                        {step.tag}
                      </span>
                      <span className="text-3xl sm:text-5xl md:text-7xl font-black text-white/[0.07] select-none leading-none shrink-0">
                        {step.number}
                      </span>
                    </div>

                    {/* Bottom: icon + label + highlight pill */}
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4 flex items-end justify-between gap-1.5">
                      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 md:gap-3">
                        {/* Premium Icon Container */}
                        <div className="relative shrink-0">
                          {/* Outer glow ring */}
                          <div
                            className={`absolute -inset-0.5 sm:-inset-1 md:-inset-1.5 rounded-lg sm:rounded-xl md:rounded-2xl bg-[#2B0D3E] opacity-40 blur-sm group-hover:opacity-80 group-hover:blur-md transition-all duration-500`}
                          />
                          {/* Pulsing ring on hover */}
                          <div
                            className={`absolute -inset-0.5 sm:-inset-1 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`}
                          />
                          {/* Main icon body - frosted glass */}
                          <div
                            className={`relative flex h-8 w-8 sm:h-9 sm:w-9 md:h-11 md:w-11 items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl bg-[#2B0D3E] shadow-lg md:shadow-xl border border-white/25 overflow-hidden`}
                          >
                            {/* Inner shine highlight */}
                            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/5 to-transparent" />
                            {/* Animated shimmer on hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                            <Icon className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white drop-shadow-sm" />
                          </div>
                        </div>
                        <span className="min-w-0 text-[10px] sm:text-xs md:text-base font-bold text-white drop-shadow-md leading-tight line-clamp-2">
                          {step.label}
                        </span>
                      </div>
                      <span className="max-w-[42%] shrink-0 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1 text-[7px] sm:text-[9px] md:text-[10px] font-semibold text-white/90 text-right leading-tight line-clamp-2">
                        {step.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-2.5 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
                    {/* Step indicator line */}
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <div
                        className={`h-0.5 w-4 sm:w-6 md:w-8 shrink-0 rounded-full bg-linear-to-r ${step.gradient}`}
                      />
                      <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wide sm:tracking-wider md:tracking-widest text-slate-400 truncate">
                        {step.tag}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm md:text-lg font-black text-slate-900 tracking-tight leading-snug sm:leading-tight line-clamp-2 md:line-clamp-none">
                      {step.headline}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed text-slate-500 line-clamp-4 md:line-clamp-none flex-1">
                      {step.description}
                    </p>

                    <button
                      onClick={onCreateProject}
                      className={`group/btn mt-auto inline-flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#7A3F91] transition-all duration-200 hover:gap-1.5 sm:hover:gap-3 text-left`}
                    >
                      <span className="line-clamp-2 md:line-clamp-none">
                        {step.cta}
                      </span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 sm:group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                  {/* Bottom gradient bar */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Platform Capabilities ──────────────── */}
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white shadow-xl">
            {/* Header banner */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#2B0D3E] via-[#4A1A6B] to-[#7A3F91] px-4 py-6 sm:px-8 sm:py-10">
              {/* Decorative orbs */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#C59DD9]/10 blur-2xl" />

              {/* Dot pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative z-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C59DD9]/30 bg-[#C59DD9]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#C59DD9]">
                    <Sparkles className="h-3 w-3" /> Platform Capabilities
                  </span>
                  <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                    Everything you need to plan{" "}
                    <span className="bg-linear-to-r from-[#C59DD9] to-[#F2EAF7] bg-clip-text text-transparent">
                      smarter housing
                    </span>
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-white/60 max-w-md leading-relaxed">
                    RHS Engine brings advanced analysis tools into a single
                    unified workspace.
                  </p>
                </div>
                <div className="shrink-0 w-full sm:w-auto">
                  <Button
                    onClick={onCreateProject}
                    className="w-full sm:w-auto bg-white text-[#2B0D3E] hover:bg-[#F2EAF7] font-bold shadow-lg px-4 py-2.5 sm:px-5 text-sm"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature grid — 2 cols on phone, compact */}
            <div className="grid grid-cols-2 gap-2.5 p-2.5 sm:p-0 sm:gap-0 sm:[&>div]:border-r sm:[&>div]:border-b sm:[&>div]:border-slate-50 sm:[&>div:nth-child(2n)]:border-r-0 sm:[&>div:nth-child(n+3)]:border-b-0">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="group relative flex flex-col rounded-xl border border-slate-100/90 bg-[#FAF8FC]/80 p-3 shadow-sm transition-colors duration-200 hover:bg-[#F2EAF7]/60 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-5 md:p-7 sm:shadow-none"
                  >
                    {/* Number watermark */}
                    <span className="absolute top-2 right-2 sm:top-4 sm:right-5 text-3xl sm:text-5xl font-black text-slate-100 sm:text-slate-50 select-none leading-none group-hover:text-[#7A3F91]/10 transition-colors">
                      0{i + 1}
                    </span>

                    {/* CHANGED: Feature icon bg from gradient to solid #2B0D3E */}
                    <div className="relative mb-2 w-fit sm:mb-4">
                      {/* Outer ambient glow — changed from gradient to solid #2B0D3E */}
                      <div className="absolute -inset-1 sm:-inset-1.5 rounded-xl sm:rounded-2xl bg-[#2B0D3E] opacity-20 blur-md group-hover:opacity-50 group-hover:blur-lg transition-all duration-500" />
                      {/* Main icon body — changed from bg-linear-to-br ${f.gradient} to bg-[#2B0D3E] */}
                      <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#2B0D3E] shadow-md sm:shadow-lg border border-white/10 overflow-hidden">
                        {/* Inner top-left shine */}
                        <div className="absolute inset-0 bg-linear-to-br from-white/35 via-white/5 to-transparent" />
                        {/* Hover shimmer sweep */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                        <Icon className="relative z-10 h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5 text-white drop-shadow" />
                      </div>
                    </div>
                    <h4 className="text-[11px] sm:text-sm font-black text-slate-900 mb-1 sm:mb-2 tracking-tight leading-tight line-clamp-3 sm:line-clamp-none pr-6 sm:pr-8">
                      {f.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed text-slate-500 line-clamp-5 sm:line-clamp-none flex-1 min-h-0">
                      {f.body}
                    </p>
                    <div
                      className={`mt-2 sm:mt-4 h-0.5 w-0 rounded-full bg-linear-to-r ${f.gradient} transition-all duration-300 group-hover:w-8 sm:group-hover:w-12`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Social Proof Band ──────────────────── */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1A0826] via-[#2B0D3E] to-[#4A1A6B] p-4 sm:p-6 md:p-8 shadow-2xl border border-[#7A3F91]/20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#7A3F91]/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C59DD9]/10 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col gap-4 sm:gap-6 md:gap-8 md:flex-row md:items-center">
              {/* Testimonial */}
              <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-sm sm:text-[15px] md:text-base font-medium italic text-white/85 leading-relaxed border-l-2 border-[#C59DD9]/40 pl-3 sm:pl-4">
                  "RHS Engine cut our project feasibility analysis time from 3
                  weeks to 2 days. The scenario comparison alone saved us months
                  of back-and-forth with government planners."
                </blockquote>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=80&auto=format&fit=crop"
                    alt="David M."
                    className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-[#C59DD9]/40"
                  />
                  <div>
                    <p className="text-[13px] sm:text-sm font-bold text-white leading-tight">
                      David M.
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#C59DD9] leading-tight">
                      Real Estate Developer, Nairobi
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden h-28 w-px bg-white/10 md:block" />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 md:shrink-0">
                {PROOFS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={i}
                      className="group flex flex-col items-center gap-1.5 sm:gap-2 text-center p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-colors"
                    >
                      {/* Premium stat icon */}
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-xl bg-[#C59DD9]/20 blur-sm group-hover:bg-[#C59DD9]/40 group-hover:blur-md transition-all duration-400" />
                        <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-linear-to-br from-[#7A3F91]/40 to-[#C59DD9]/20 border border-[#C59DD9]/30 overflow-hidden">
                          <div className="absolute inset-0 bg-linear-to-br from-white/20 via-white/5 to-transparent" />
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/15 to-transparent skew-x-12" />
                          <Icon className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#C59DD9]" />
                        </div>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                        {s.value}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide sm:tracking-widest text-[#C59DD9]/70 leading-tight">
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Final CTA ─────────────────────────── */}
          <div className="relative overflow-hidden rounded-3xl border border-[#C59DD9]/30 bg-linear-to-br from-[#F2EAF7]/80 via-white to-[#F2EAF7]/60 px-8 py-12 text-center shadow-sm">
            {/* decorative */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C59DD9]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#7A3F91]/10 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#7A3F91] to-[#2B0D3E] shadow-xl shadow-[#7A3F91]/30">
                <Play className="h-7 w-7 text-white" />
              </div>

              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Ready to build something great?
                </h3>
                <p className="text-sm text-slate-500">
                  Create your first project in under 30 seconds. No setup, no
                  credit card required.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {/* CHANGED: from gradient to solid bg-[#2B0D3E] with hover:bg-[#7A3F91] */}
                <Button
                  onClick={onCreateProject}
                  className="gap-2 bg-[#2B0D3E] hover:bg-[#7A3F91] px-7 py-3 text-sm font-bold shadow-xl shadow-[#7A3F91]/25 hover:shadow-[#7A3F91]/40 hover:scale-[1.02] transition-all duration-200"
                >
                  <FolderPlus className="h-4 w-4" />
                  Create My First Project
                </Button>
                {/* CHANGED: hover:bg from [#7A3F91] to [#2B0D3E] */}
                <Button
                  variant="outline"
                  className="gap-2 px-7 py-3 text-sm font-bold border-[#7A3F91]/30 text-[#7A3F91] hover:bg-[#2B0D3E] hover:text-white hover:border-[#2B0D3E] transition-all duration-200"
                  onClick={onCreateProject}
                >
                  View a Demo Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-5 pt-1">
                {[
                  "Free to start",
                  "No credit card",
                  "Export to PDF",
                  "Real-time analysis",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
