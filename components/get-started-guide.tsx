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
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    label: "Create a Project",
    headline: "Start with your site",
    description:
      `Click "New Project" to define your land area, city, and region. Give your housing development a name and let RHS Engine set up your workspace — ready in under 30 seconds.`,
    cta: "Create your first project →",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    icon: FolderPlus,
    accent: "from-[#0a1628] to-blue-900",
    tag: "Step 1",
  },
  {
    number: "02",
    label: "Run Scenarios",
    headline: "Model every possibility",
    description:
      "Inside each project, build unlimited cost-and-layout scenarios. Adjust unit mix (Bedsitters, 1-Bed, 2-Bed), land coverage, infrastructure specs, and construction cost per m² — the engine recalculates everything live.",
    cta: "Open the simulator →",
    image:
      "https://images.unsplash.com/photo-1545622783-b3e021430fee?q=80&w=1200&auto=format&fit=crop",
    icon: BarChart3,
    accent: "from-blue-800 to-[#0a1628]",
    tag: "Step 2",
  },
  {
    number: "03",
    label: "Compare Scenarios",
    headline: "Find the optimal plan",
    description:
      "Stack scenarios side-by-side in the Scenario Comparison Engine. Instantly see which layout maximises units, minimises cost per household, and best meets regulatory compliance — all on one screen.",
    cta: "Compare scenarios →",
    image:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=1200&auto=format&fit=crop",
    icon: GitCompare,
    accent: "from-[#0f2645] to-blue-900",
    tag: "Step 3",
  },
  {
    number: "04",
    label: "Export & Share",
    headline: "Present with confidence",
    description:
      "Generate a professional PDF report with charts, maps, cost breakdowns, and regulatory checklists. Share it with stakeholders, investors, or government bodies — fully branded and print-ready.",
    cta: "Generate a report →",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    icon: Download,
    accent: "from-blue-700 to-[#0a1628]",
    tag: "Step 4",
  },
];

const FEATURES = [
  {
    icon: Building2,
    title: "Real-Time Financial Modelling",
    body: "Every slider move instantly recalculates total project cost, ROI, and per-unit affordability — no spreadsheets required.",
    color: "text-[#0a1628]",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "5–20 Year Demand Forecasting",
    body: "Demographic-driven projections show how housing demand evolves in your target area over the next two decades.",
    color: "text-blue-800",
    bg: "bg-blue-50",
  },
  {
    icon: Globe,
    title: "Infrastructure Assessment",
    body: "Automatically evaluate water, sewer, roads, and electricity capacity against your planned density.",
    color: "text-blue-900",
    bg: "bg-slate-100",
  },
  {
    icon: Users,
    title: "Compliance & Zoning",
    body: "Built-in regulatory checklists cross-reference your project against local zoning laws and affordable-housing mandates.",
    color: "text-[#0f2645]",
    bg: "bg-blue-50",
  },
];

interface GetStartedGuideProps {
  onCreateProject: () => void;
}

export function GetStartedGuide({ onCreateProject }: GetStartedGuideProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mt-10 space-y-10">
      {/* ── Section Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 shadow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              How to Get Started
            </h2>
            <p className="text-xs text-slate-500">
              Your complete guide — four simple steps
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
        >
          {expanded ? (
            <>
              Collapse <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Expand <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {expanded && (
        <>
          {/* ── Steps ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.headline}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Step badge */}
                    <span
                      className={`absolute left-4 top-4 rounded-full bg-gradient-to-r ${step.accent} px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow`}
                    >
                      {step.tag}
                    </span>

                    {/* Step number watermark */}
                    <span className="absolute right-4 top-3 text-6xl font-black text-white/10 select-none">
                      {step.number}
                    </span>

                    {/* Icon pill pinned at bottom-left of image */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${step.accent} shadow-lg`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white drop-shadow">
                        {step.label}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {step.headline}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                    <button
                      onClick={onCreateProject}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                      {step.cta}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Feature Deep-Dive ─────────────────────────── */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
            {/* Banner */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1600&auto=format&fit=crop"
                alt="Smart Housing Platform"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-[2px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="mb-2 rounded-full bg-blue-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
                  Platform Capabilities
                </p>
                <h3 className="text-2xl font-bold text-white">
                  Everything you need to plan&nbsp;
                  <span className="text-blue-300">smarter housing</span>
                </h3>
                <p className="mt-1 text-sm text-blue-100/80">
                  RHS Engine brings advanced analysis tools into a single
                  workspace.
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-2">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-white p-6 space-y-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {f.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {f.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Testimonial / Social Proof ────────────────── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 shadow-2xl">
            {/* Background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-blue-400 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              {/* Quote */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-base font-medium italic text-white/90 leading-relaxed">
                  "RHS Engine cut our project feasibility analysis time from 3
                  weeks to 2 days. The scenario comparison alone saved us months
                  of back-and-forth with government planners."
                </blockquote>
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=80&auto=format&fit=crop"
                    alt="David M."
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">
                      David M.
                    </p>
                    <p className="text-xs text-blue-200">
                      Real Estate Developer, Nairobi
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-32 w-px bg-white/20 md:block" />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-5 text-center md:shrink-0">
                {[
                  { value: "50K+", label: "Units Planned" },
                  { value: "2 days", label: "Avg. Time to Report" },
                  { value: "$2B+", label: "Capital Modelled" },
                  { value: "15+", label: "Organisations" },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-[11px] text-blue-200">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Final CTA ─────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900 shadow-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Ready to build something great?
              </h3>
              <p className="text-sm text-slate-500">
                Create your first project in under 30 seconds. No setup, no
                credit card required.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={onCreateProject}
                className="gap-2 bg-blue-900 px-6 py-2.5 text-sm hover:bg-blue-800 shadow-lg"
              >
                <FolderPlus className="h-4 w-4" />
                Create My First Project
              </Button>
              <Button
                variant="outline"
                className="gap-2 px-6 py-2.5 text-sm"
                onClick={onCreateProject}
              >
                View a Demo Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {["Free to start", "No credit card", "Export to PDF", "Real-time analysis"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-xs text-slate-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
