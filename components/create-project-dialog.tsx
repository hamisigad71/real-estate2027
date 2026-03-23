"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";
import { projectStorage } from "@/lib/storage";
import { getAvailableCountries } from "@/lib/country-data";
import {
  Building2,
  Home,
  Layers,
  MapPin,
  Globe,
  Ruler,
  Users,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

/* ── Step config ─────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Project", icon: Building2, desc: "Name & type" },
  { id: 2, label: "Location", icon: MapPin, desc: "Site details" },
  { id: 3, label: "Land", icon: Ruler, desc: "Size & plot" },
  { id: 4, label: "Finance", icon: DollarSign, desc: "Budget range" },
];

/* ── Housing type cards ──────────────────────────────────────── */
const PROJECT_TYPES = [
  {
    value: "apartment",
    label: "Multi-Unit Apartments",
    sub: "High Density",
    icon: Building2,
    desc: "Ideal for urban areas with high demand and limited land.",
  },
  {
    value: "single-family",
    label: "Single-Family Homes",
    sub: "Low Density",
    icon: Home,
    desc: "Suburban developments with individual plots per unit.",
  },
  {
    value: "mixed",
    label: "Mixed Development",
    sub: "Hybrid",
    icon: Layers,
    desc: "Combines apartments and homes for diverse communities.",
  },
];

const INCOME_GROUPS = [
  { value: "low", label: "Low Income", color: "#059669" },
  { value: "lower-middle", label: "Lower-Middle Income", color: "#7A3F91" },
  { value: "middle", label: "Middle Income", color: "#d97706" },
  { value: "mixed", label: "Mixed Income", color: "#2B0D3E" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "KES", "NGN", "ZAR", "GHS", "TZS"];

/* ── Reusable styled field wrapper ──────────────────────────── */
function FieldWrap({
  label,
  required,
  icon: Icon,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: "#7A3F91" }} />}
        <label
          className="text-[10px] font-black uppercase tracking-[0.16em]"
          style={{ color: "#7A3F91" }}
        >
          {label}
          {required && <span style={{ color: "#ef4444" }}> *</span>}
        </label>
      </div>
      {children}
      {hint && (
        <p className="text-[10px] font-medium" style={{ color: "#C59DD9" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ── Styled input ─────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  height: 44,
  borderRadius: 12,
  border: "1.5px solid #E9DEEF",
  background: "#FFFFFF",
  fontSize: 14,
  color: "#2B0D3E",
  paddingLeft: 14,
  paddingRight: 14,
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
  transition: "border-color 0.15s, box-shadow 0.15s",
};

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#7A3F91";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(122,63,145,0.1)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#E9DEEF";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );
}

/* ── Step progress bar ─────────────────────────────────────────── */
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        const Icon = step.icon;
        return (
          <div
            key={step.id}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background: done ? "#7A3F91" : active ? "#2B0D3E" : "#F2EAF7",
                  borderColor: done || active ? "transparent" : "#E9DEEF",
                  scale: active ? 1.08 : 1,
                }}
                transition={{ duration: 0.25 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ border: "1.5px solid #E9DEEF" }}
              >
                {done ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Icon
                    className="w-4 h-4"
                    style={{ color: active ? "#C59DD9" : "#C59DD9" }}
                  />
                )}
              </motion.div>
              <div className="text-center">
                <p
                  className="text-[9px] font-black uppercase tracking-[0.12em] leading-none"
                  style={{
                    color: active ? "#2B0D3E" : done ? "#7A3F91" : "#C59DD9",
                  }}
                >
                  {step.label}
                </p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                className="flex-1 mx-2 mb-5"
                style={{ height: 1.5, borderRadius: 2 }}
                animate={{ background: done ? "#7A3F91" : "#E9DEEF" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Project type card ─────────────────────────────────────────── */
function TypeCard({
  type,
  selected,
  onClick,
}: {
  type: (typeof PROJECT_TYPES)[0];
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = type.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="relative text-left p-4 rounded-2xl transition-all duration-200 w-full"
      style={{
        border: `1.5px solid ${selected ? "#7A3F91" : "#E9DEEF"}`,
        background: selected ? "rgba(122,63,145,0.04)" : "#FFFFFF",
        boxShadow: selected
          ? "0 4px 20px rgba(122,63,145,0.15)"
          : "0 2px 8px rgba(122,63,145,0.06)",
        fontFamily: "inherit",
      }}
    >
      {/* Selected checkmark */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#7A3F91" }}
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{
          background: selected ? "rgba(122,63,145,0.12)" : "#F2EAF7",
        }}
      >
        <Icon
          className="w-4.5 h-4.5"
          style={{ color: selected ? "#7A3F91" : "#C59DD9" }}
        />
      </div>

      <p
        className="text-sm font-bold leading-tight mb-0.5"
        style={{ color: "#2B0D3E" }}
      >
        {type.label}
      </p>
      <p
        className="text-[10px] font-black uppercase tracking-[0.12em] mb-1.5"
        style={{ color: selected ? "#7A3F91" : "#C59DD9" }}
      >
        {type.sub}
      </p>
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: "rgba(43,13,62,0.45)" }}
      >
        {type.desc}
      </p>
    </motion.button>
  );
}

/* ── Income group pill ─────────────────────────────────────────── */
function IncomePill({
  group,
  selected,
  onClick,
}: {
  group: (typeof INCOME_GROUPS)[0];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
      style={{
        border: `1.5px solid ${selected ? group.color : "#E9DEEF"}`,
        background: selected ? `${group.color}10` : "#FFFFFF",
        color: selected ? group.color : "#7A3F91",
        fontFamily: "inherit",
      }}
    >
      {selected && <Check className="w-3.5 h-3.5" />}
      {group.label}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DIALOG
   ═══════════════════════════════════════════════════════════════ */
export function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    projectType: "apartment" as "apartment" | "single-family" | "mixed",
    city: "",
    countryCode: "",
    countryName: "",
    landSize: "",
    landSizeUnit: "sqm" as "sqm" | "acres",
    targetIncomeGroup: "low" as "low" | "lower-middle" | "middle" | "mixed",
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const parseBudgetNumber = (v: string) => {
    const s = v.trim().replace(/,/g, "");
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  const canNext = () => {
    if (step === 1) return formData.name.trim().length > 0;
    if (step === 2)
      return formData.city.trim().length > 0 && formData.countryCode !== "";
    if (step === 3) return formData.landSize !== "";
    return true;
  };

  const budgetMinNum = parseBudgetNumber(formData.budgetMin);
  const budgetMaxNum = parseBudgetNumber(formData.budgetMax);

  const canCreate = () => {
    if (!formData.budgetMin || !formData.budgetMax) return false;
    if (budgetMinNum === null || budgetMaxNum === null) return false;
    return budgetMaxNum >= budgetMinNum;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.countryCode) {
      showError("Please select a country");
      return;
    }

    const budgetMin = parseBudgetNumber(formData.budgetMin);
    const budgetMax = parseBudgetNumber(formData.budgetMax);
    if (budgetMin === null || budgetMax === null) {
      showError("Please enter a valid minimum and maximum budget.");
      return;
    }
    if (budgetMax < budgetMin) {
      showError("Maximum budget must be greater than or equal to minimum budget.");
      return;
    }

    projectStorage.create({
      userId: user.id,
      projectType: formData.projectType,
      name: formData.name,
      location: {
        city: formData.city,
        country: formData.countryName,
        countryCode: formData.countryCode,
      },
      landSize: parseFloat(formData.landSize),
      landSizeUnit: formData.landSizeUnit,
      targetIncomeGroup: formData.targetIncomeGroup,
      budgetRange: {
        min: budgetMin,
        max: budgetMax,
        currency: formData.currency,
      },
    });

    showSuccess(`Project "${formData.name}" created successfully!`);

    // Reset
    setFormData({
      name: "",
      projectType: "apartment",
      city: "",
      countryCode: "",
      countryName: "",
      landSize: "",
      landSizeUnit: "sqm",
      targetIncomeGroup: "low",
      budgetMin: "",
      budgetMax: "",
      currency: "USD",
    });
    setStep(1);
    onProjectCreated();
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
  };
  const [slideDir, setSlideDir] = useState(1);

  const goNext = () => {
    setSlideDir(1);
    setStep((s) => s + 1);
  };
  const goPrev = () => {
    setSlideDir(-1);
    setStep((s) => s - 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="p-0 overflow-hidden gap-0"
        style={{
          maxWidth: 580,
          borderRadius: 24,
          border: "1.5px solid #E9DEEF",
          boxShadow:
            "0 24px 64px rgba(122,63,145,0.14), 0 4px 16px rgba(122,63,145,0.06)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        <DialogTitle className="sr-only">Create project</DialogTitle>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
          select option { color: #2B0D3E; background: #fff; }
        `}</style>

        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="relative px-8 pt-8 pb-6 overflow-hidden"
          style={{ background: "#FFFFFF" }}
        >
          {/* Subtle orb */}
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(197,157,217,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(122,63,145,0.2) 0%, transparent 70%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{
              background: "rgba(122,63,145,0.08)",
              color: "rgba(43,13,62,0.6)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(122,63,145,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(122,63,145,0.08)";
            }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "#2B0D3E",
                  border: "1px solid rgba(197,157,217,0.35)",
                }}
              >
                <img
                  src="/new-project_9850158.png"
                  alt=""
                  className="w-4 h-4 object-contain"
                />
              </div>
              <span
                className="text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: "#C59DD9" }}
              >
                New Project
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#2B0D3E] tracking-tight leading-tight">
              {step === 1 && "Project Identity"}
              {step === 2 && "Site Location"}
              {step === 3 && "Land & Density"}
              {step === 4 && "Budget & Finance"}
            </h2>
            <p
              className="text-sm mt-1 font-medium"
              style={{ color: "rgba(43,13,62,0.45)" }}
            >
              {step === 1 &&
                "Give your project a name and choose the housing type."}
              {step === 2 && "Where will this housing development be located?"}
              {step === 3 && "Define the land area and intended use intensity."}
              {step === 4 && "Set a budget range and income group target."}
            </p>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────── */}
        <div className="px-8 pt-7 pb-8" style={{ background: "#FAFAFA" }}>
          {/* Step bar */}
          <StepBar current={step} />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={step}
                custom={slideDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* ── STEP 1: Project ─────────────────────── */}
                {step === 1 && (
                  <div className="space-y-6">
                    <FieldWrap
                      label="Project Name"
                      required
                      icon={Building2}
                      hint="Give it a memorable, descriptive name"
                    >
                      <StyledInput
                        placeholder="e.g., Riverside Affordable Housing"
                        value={formData.name}
                        onChange={(e) => update({ name: e.target.value })}
                        required
                      />
                    </FieldWrap>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Layers
                          className="w-3.5 h-3.5"
                          style={{ color: "#7A3F91" }}
                        />
                        <label
                          className="text-[10px] font-black uppercase tracking-[0.16em]"
                          style={{ color: "#7A3F91" }}
                        >
                          Housing Type{" "}
                          <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {PROJECT_TYPES.map((type) => (
                          <TypeCard
                            key={type.value}
                            type={type}
                            selected={formData.projectType === type.value}
                            onClick={() =>
                              update({ projectType: type.value as any })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Location ────────────────────── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <FieldWrap
                      label="City / Town"
                      required
                      icon={MapPin}
                      hint="The primary city or town where the project will be built"
                    >
                      <StyledInput
                        placeholder="e.g., Nairobi, Lagos, Accra"
                        value={formData.city}
                        onChange={(e) => update({ city: e.target.value })}
                        required
                      />
                    </FieldWrap>

                    <FieldWrap
                      label="Country"
                      required
                      icon={Globe}
                      hint="Select the country to apply correct cost indices"
                    >
                      <Select
                        value={formData.countryCode}
                        onValueChange={(code) => {
                          const country = getAvailableCountries().find(
                            (c) => c.code === code,
                          );
                          update({
                            countryCode: code,
                            countryName: country?.name || "",
                          });
                        }}
                      >
                        <SelectTrigger
                          className="h-11 rounded-xl text-sm font-medium"
                          style={{
                            border: "1.5px solid #E9DEEF",
                            background: "#FFFFFF",
                            color: formData.countryCode ? "#2B0D3E" : "#C59DD9",
                          }}
                        >
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
                          {getAvailableCountries().map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.code}
                              className="text-sm"
                            >
                              <span className="font-semibold text-[#2B0D3E]">
                                {country.name}
                              </span>
                              <span
                                className="ml-2 text-[10px] uppercase tracking-wider font-bold"
                                style={{ color: "#C59DD9" }}
                              >
                                {country.region}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldWrap>

                    {/* Map preview hint card */}
                    {formData.city && formData.countryName && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3.5 rounded-xl"
                        style={{
                          background: "rgba(122,63,145,0.05)",
                          border: "1px solid rgba(122,63,145,0.12)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(122,63,145,0.1)" }}
                        >
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: "#7A3F91" }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "#2B0D3E" }}
                          >
                            {formData.city}, {formData.countryName}
                          </p>
                          <p
                            className="text-[11px] font-medium"
                            style={{ color: "#C59DD9" }}
                          >
                            Location confirmed · cost data will be loaded
                          </p>
                        </div>
                        <Check
                          className="w-4 h-4 ml-auto shrink-0"
                          style={{ color: "#7A3F91" }}
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ── STEP 3: Land ────────────────────────── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <FieldWrap
                        label="Land Size"
                        required
                        icon={Ruler}
                        hint="Total area of the development site"
                      >
                        <StyledInput
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="e.g., 10000"
                          value={formData.landSize}
                          onChange={(e) => update({ landSize: e.target.value })}
                          required
                        />
                      </FieldWrap>

                      <FieldWrap label="Unit" icon={Layers}>
                        <Select
                          value={formData.landSizeUnit}
                          onValueChange={(v: "sqm" | "acres") =>
                            update({ landSizeUnit: v })
                          }
                        >
                          <SelectTrigger
                            className="h-11 rounded-xl text-sm font-medium"
                            style={{
                              border: "1.5px solid #E9DEEF",
                              background: "#FFFFFF",
                            }}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sqm">
                              Square Meters (m²)
                            </SelectItem>
                            <SelectItem value="acres">Acres</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldWrap>
                    </div>

                    {/* Live size display */}
                    {formData.landSize && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-2 gap-3"
                      >
                        {[
                          {
                            label: "Site Area",
                            value: `${parseFloat(formData.landSize).toLocaleString()} ${formData.landSizeUnit === "sqm" ? "m²" : "acres"}`,
                          },
                          {
                            label: "Est. Footprint",
                            value:
                              formData.landSizeUnit === "sqm"
                                ? `${(parseFloat(formData.landSize) * 0.0001).toFixed(2)} ha`
                                : `${(parseFloat(formData.landSize) * 4047).toLocaleString()} m²`,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="p-3.5 rounded-xl text-center"
                            style={{
                              background: "#F2EAF7",
                              border: "1px solid #E9DEEF",
                            }}
                          >
                            <p
                              className="text-base font-extrabold"
                              style={{ color: "#2B0D3E" }}
                            >
                              {value}
                            </p>
                            <p
                              className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                              style={{ color: "#C59DD9" }}
                            >
                              {label}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Users
                          className="w-3.5 h-3.5"
                          style={{ color: "#7A3F91" }}
                        />
                        <label
                          className="text-[10px] font-black uppercase tracking-[0.16em]"
                          style={{ color: "#7A3F91" }}
                        >
                          Target Income Group{" "}
                          <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {INCOME_GROUPS.map((g) => (
                          <IncomePill
                            key={g.value}
                            group={g}
                            selected={formData.targetIncomeGroup === g.value}
                            onClick={() =>
                              update({ targetIncomeGroup: g.value as any })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Finance ─────────────────────── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <FieldWrap
                      label="Currency"
                      icon={DollarSign}
                      hint="Select the currency for budget figures"
                    >
                      <div className="flex flex-wrap gap-2">
                        {CURRENCIES.map((cur) => (
                          <motion.button
                            key={cur}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => update({ currency: cur })}
                            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                            style={{
                              border: `1.5px solid ${formData.currency === cur ? "#7A3F91" : "#E9DEEF"}`,
                              background:
                                formData.currency === cur
                                  ? "rgba(122,63,145,0.08)"
                                  : "#FFFFFF",
                              color:
                                formData.currency === cur
                                  ? "#7A3F91"
                                  : "#C59DD9",
                              fontFamily: "inherit",
                            }}
                          >
                            {cur}
                          </motion.button>
                        ))}
                      </div>
                    </FieldWrap>

                    <div className="grid grid-cols-2 gap-4">
                      <FieldWrap
                        label="Minimum Budget"
                        required
                        icon={DollarSign}
                        hint="Lower bound of project budget"
                      >
                        <StyledInput
                          type="number"
                          placeholder="e.g., 500,000"
                          value={formData.budgetMin}
                          onChange={(e) =>
                            update({ budgetMin: e.target.value })
                          }
                          required
                        />
                      </FieldWrap>
                      <FieldWrap
                        label="Maximum Budget"
                        required
                        icon={DollarSign}
                        hint="Upper bound of project budget"
                      >
                        <StyledInput
                          type="number"
                          placeholder="e.g., 2,000,000"
                          value={formData.budgetMax}
                          onChange={(e) =>
                            update({ budgetMax: e.target.value })
                          }
                          required
                        />
                      </FieldWrap>
                    </div>

                    {/* Budget preview */}
                    {budgetMinNum !== null && budgetMaxNum !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl"
                        style={{
                          background: "rgba(122,63,145,0.03)",
                          border: "1.5px solid #E9DEEF",
                        }}
                      >
                        <p
                          className="text-[10px] font-black uppercase tracking-[0.15em] mb-3"
                          style={{ color: "#C59DD9" }}
                        >
                          Budget Summary
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className="text-[10px] font-bold mb-0.5"
                              style={{ color: "#C59DD9" }}
                            >
                              Range
                            </p>
                            <p
                              className="text-sm font-extrabold"
                              style={{ color: "#2B0D3E" }}
                            >
                              {formData.currency}{" "}
                              {budgetMinNum.toLocaleString()}{" "}
                              —{" "}
                              {budgetMaxNum.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-[10px] font-bold mb-0.5"
                              style={{ color: "#C59DD9" }}
                            >
                              Midpoint
                            </p>
                            <p
                              className="text-sm font-extrabold"
                              style={{ color: "#7A3F91" }}
                            >
                              {formData.currency}{" "}
                              {((budgetMinNum + budgetMaxNum) / 2).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {/* Bar visualisation */}
                        <div
                          className="mt-3 relative h-1.5 rounded-full overflow-hidden"
                          style={{ background: "#E9DEEF" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{
                              duration: 0.8,
                              delay: 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #7A3F91, #C59DD9)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Summary recap */}
                    <div
                      className="p-4 rounded-2xl space-y-2"
                      style={{
                        background: "#F2EAF7",
                        border: "1px solid #E9DEEF",
                      }}
                    >
                      <p
                        className="text-[10px] font-black uppercase tracking-[0.15em] mb-2"
                        style={{ color: "#7A3F91" }}
                      >
                        Project Summary
                      </p>
                      {[
                        { label: "Name", value: formData.name },
                        {
                          label: "Type",
                          value: PROJECT_TYPES.find(
                            (t) => t.value === formData.projectType,
                          )?.label,
                        },
                        {
                          label: "Location",
                          value:
                            formData.city && formData.countryName
                              ? `${formData.city}, ${formData.countryName}`
                              : "—",
                        },
                        {
                          label: "Land",
                          value: formData.landSize
                            ? `${parseFloat(formData.landSize).toLocaleString()} ${formData.landSizeUnit}`
                            : "—",
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between items-center py-0.5"
                        >
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: "#C59DD9" }}
                          >
                            {label}
                          </span>
                          <span
                            className="text-xs font-bold truncate max-w-[200px]"
                            style={{ color: "#2B0D3E" }}
                          >
                            {value || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation row ─────────────────────────── */}
            <div
              className="flex items-center justify-between mt-8 pt-5"
              style={{ borderTop: "1px solid #E9DEEF" }}
            >
              <button
                type="button"
                onClick={step === 1 ? handleClose : goPrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
                style={{
                  border: "1.5px solid #E9DEEF",
                  background: "#FFFFFF",
                  color: "#7A3F91",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#C59DD9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#E9DEEF";
                }}
              >
                {step === 1 ? (
                  <>
                    <X className="w-3.5 h-3.5" /> Cancel
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* Step dots */}
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: s.id === step ? 20 : 6,
                      height: 6,
                      background:
                        s.id === step
                          ? "#7A3F91"
                          : s.id < step
                            ? "#C59DD9"
                            : "#E9DEEF",
                    }}
                  />
                ))}
              </div>

              {step < 4 ? (
                <motion.button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext()}
                  whileHover={canNext() ? { scale: 1.02 } : {}}
                  whileTap={canNext() ? { scale: 0.98 } : {}}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
                  style={{
                    background: "linear-gradient(135deg, #2B0D3E, #7A3F91)",
                    color: "#FFFFFF",
                    border: "none",
                    fontFamily: "inherit",
                    boxShadow: canNext()
                      ? "0 4px 14px rgba(122,63,145,0.28)"
                      : "none",
                    opacity: canNext() ? 1 : 0.7,
                    cursor: canNext() ? "pointer" : "not-allowed",
                  }}
                >
                  Continue <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold"
                  disabled={!canCreate()}
                  style={{
                    background: "linear-gradient(135deg, #7A3F91, #C59DD9)",
                    color: "#FFFFFF",
                    border: "none",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 16px rgba(122,63,145,0.32)",
                    opacity: canCreate() ? 1 : 0.7,
                    cursor: canCreate() ? "pointer" : "not-allowed",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Create Project
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
