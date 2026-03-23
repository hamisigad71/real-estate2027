"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "./auth-provider";
import { useToast } from "./toast-provider";
import {
  Building2,
  Mail,
  User,
  Phone,
  MapPin,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Zap,
  Globe,
  Users,
  ArrowRight,
  Play,
  Shield,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { Logo } from "./logo";

type RoleType =
  | "Government Planner"
  | "NGO Manager"
  | "Real Estate Developer"
  | "Architect"
  | "Consultant"
  | "Individual Homeowner"
  | "Other";

interface RoleOption {
  value: RoleType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "Government Planner",
    label: "Government Planner",
    icon: Building2,
    description: "Plan large-scale housing projects",
  },
  {
    value: "NGO Manager",
    label: "NGO Manager",
    icon: Users,
    description: "Manage affordable housing programs",
  },
  {
    value: "Real Estate Developer",
    label: "Real Estate Developer",
    icon: TrendingUp,
    description: "Analyze project viability & ROI",
  },
  {
    value: "Architect",
    label: "Architect",
    icon: BarChart3,
    description: "Design optimal layouts",
  },
  {
    value: "Consultant",
    label: "Consultant",
    icon: Globe,
    description: "Advisory & strategic planning",
  },
  {
    value: "Individual Homeowner",
    label: "Individual Homeowner",
    icon: CheckCircle,
    description: "Build your custom home",
  },
  { value: "Other", label: "Other", icon: Zap, description: "Other roles" },
];

/* ─────────────────────────────────────────────────────────────
   LOGO SVG — purple gradient version (used on light bg)
   ───────────────────────────────────────────────────────────── */
function LogoIcon({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A3F91" />
          <stop offset="100%" stopColor="#2B0D3E" />
        </linearGradient>
      </defs>
      <path
        d="M10 58 L50 22 L90 58"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="24"
        y="56"
        width="52"
        height="28"
        rx="3"
        fill="url(#logoGrad)"
        opacity="0.15"
      />
      <rect
        x="33"
        y="62"
        width="10"
        height="8"
        rx="1.5"
        fill="url(#logoGrad)"
        opacity="0.7"
      />
      <rect
        x="57"
        y="62"
        width="10"
        height="8"
        rx="1.5"
        fill="url(#logoGrad)"
        opacity="0.7"
      />
      <rect x="44" y="68" width="12" height="16" rx="2" fill="url(#logoGrad)" />
      <path
        d="M62 48 L72 38 L82 42 L92 28"
        fill="none"
        stroke="#7A3F91"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="28" r="3" fill="#7A3F91" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOGO SVG — white version (used on dark bg)
   ───────────────────────────────────────────────────────────── */
function LogoIconWhite({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 58 L50 22 L90 58"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="24"
        y="56"
        width="52"
        height="28"
        rx="3"
        fill="white"
        opacity="0.12"
      />
      <rect
        x="33"
        y="62"
        width="10"
        height="8"
        rx="1.5"
        fill="white"
        opacity="0.5"
      />
      <rect
        x="57"
        y="62"
        width="10"
        height="8"
        rx="1.5"
        fill="white"
        opacity="0.5"
      />
      <rect
        x="44"
        y="68"
        width="12"
        height="16"
        rx="2"
        fill="white"
        opacity="0.8"
      />
      <path
        d="M62 48 L72 38 L82 42 L92 28"
        fill="none"
        stroke="rgba(197,157,217,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="28" r="3" fill="rgba(197,157,217,0.9)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURE ITEM — left branding panel
   ───────────────────────────────────────────────────────────── */
function FeatureItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3.5 group">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
        style={{
          background: "rgba(197,157,217,0.1)",
          border: "1px solid rgba(197,157,217,0.15)",
        }}
      >
        <Icon className="w-4 h-4 text-[#C59DD9]" />
      </div>
      <div className="pt-0.5">
        <h3
          className="text-sm font-semibold"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          {title}
        </h3>
        <p
          className="text-xs leading-relaxed mt-0.5"
          style={{ color: "rgba(242,234,247,0.45)" }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT BLOCK — left branding panel
   ───────────────────────────────────────────────────────────── */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="text-center py-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p className="text-base font-extrabold text-white tracking-tight">
        {value}
      </p>
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
        style={{ color: "rgba(242,234,247,0.35)" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GOOGLE SVG ICON
   ───────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   DIVIDER
   ───────────────────────────────────────────────────────────── */
function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3 my-0.5">
      <div className="flex-1 h-px" style={{ background: "#E9DEEF" }} />
      <span
        className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-1"
        style={{ color: "#C59DD9" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "#E9DEEF" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FIELD WRAPPER — label + icon + input slot
   ───────────────────────────────────────────────────────────── */
function FieldWrap({
  htmlFor,
  label,
  required,
  icon: Icon,
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "#7A3F91" }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none text-[#C59DD9]" />
        )}
        {children}
      </div>
    </div>
  );
}

const inputBase =
  "h-11 rounded-xl text-sm border-[#E9DEEF] bg-white focus-visible:ring-2 focus-visible:ring-[#7A3F91]/20 focus-visible:border-[#7A3F91] transition-all duration-150 text-[#2B0D3E] placeholder:text-[#C59DD9]";
const withIcon = `${inputBase} pl-10`;
const noIcon = `${inputBase} pl-4`;

/* ═════════════════════════════════════════════════════════════
   AUTH FORM — MAIN EXPORT
   ═════════════════════════════════════════════════════════════ */
export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [expandedOptionalFields, setExpandedOptionalFields] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInName, setSignInName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState<RoleType | "">("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── handlers — identical logic to original ─────────────── */
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInName) {
      showError("Please fill in all required fields");
      return;
    }
    login(signInEmail, signInName);
    showSuccess(
      `Welcome back to RHS Engine, ${signInName}! Your dashboard is ready.`,
    );
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      showError("Please fill in all required fields");
      return;
    }
    login(email, name, organization, role, phone, country);
    showSuccess(
      `Account successfully created! Welcome to the RHS Engine ecosystem, ${name}.`,
    );
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    login(
      "demo@example.com",
      "Demo User",
      "Demo Organization",
      "Government Planner",
      "+1234567890",
      "United States",
    );
    showSuccess(
      "Welcome back, Demo User! Access to your RHS Engine profile has been restored.",
    );
  };

  const handleQuickDemoLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    login(
      "demo@example.com",
      "Demo User",
      "Demo Organization",
      "Government Planner",
      "+1234567890",
      "United States",
    );
    showSuccess(
      "Demo environment initialized. Explore advanced architectural analysis for a sample 500-unit project.",
    );
  };

  const handleRoleSelect = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setShowRoleSelector(false);
  };

  const getRoleLabel = () =>
    ROLE_OPTIONS.find((o) => o.value === role)?.label ?? "Select your role";

  /* ── render ──────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex bg-white"
      style={{ fontFamily: "'DM Sans','Inter',system-ui,sans-serif" }}
    >
      {/* ════════════════════════════════════════════════════════
          LEFT — DARK BRANDING PANEL
         ════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-12 xl:p-14"
        style={{ background: "#2B0D3E" }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full"
            style={{
              background:
                "radial-gradient(circle,rgba(122,63,145,0.32) 0%,transparent 68%)",
              animation: mounted ? "float1 38s ease-in-out infinite" : "none",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle,rgba(197,157,217,0.15) 0%,transparent 68%)",
              animation: mounted ? "float2 48s ease-in-out infinite" : "none",
            }}
          />
          {/* Dot-grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.6,
            }}
          />
        </div>

        {/* ── Top content ──────────────────────────────────── */}
        <div className="relative z-10 space-y-10">
          {/* Logo box + wordmark */}
          <div className="flex items-center gap-4 anim-logo">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <LogoIconWhite size={46} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white tracking-tight leading-none">
                RHS Engine
              </p>
              <p
                className="text-xs mt-1 font-medium"
                style={{ color: "rgba(242,234,247,0.42)" }}
              >
                Smart Affordable Housing Planning
              </p>
            </div>
          </div>

          {/* Hero headline */}
          <div className="anim-headline">
            <h1
              className="font-extrabold leading-[1.1] tracking-tight text-white"
              style={{ fontSize: "clamp(2rem,3vw,2.75rem)" }}
            >
              Plan smarter.
              <br />
              <span style={{ color: "#C59DD9" }}>Build better.</span>
              <br />
              House more.
            </h1>
            <p
              className="mt-4 text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(242,234,247,0.48)" }}
            >
              Data-driven solutions for governments, NGOs, and developers
              building the future of affordable housing.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="anim-feat-1">
              <FeatureItem
                icon={Zap}
                title="Real-Time Financial Modeling"
                desc="Instantly calculate costs, ROI, and affordability metrics"
              />
            </div>
            <div className="anim-feat-2">
              <FeatureItem
                icon={BarChart3}
                title="Scenario Comparison Engine"
                desc="Compare layouts, densities, and infrastructure impact"
              />
            </div>
            <div className="anim-feat-3">
              <FeatureItem
                icon={Globe}
                title="Infrastructure Assessment"
                desc="Evaluate water, electricity, waste, and compliance needs"
              />
            </div>
            <div className="anim-feat-4">
              <FeatureItem
                icon={TrendingUp}
                title="Demand Forecasting"
                desc="Project 5–20 year housing demand with demographic analysis"
              />
            </div>
          </div>
        </div>

        {/* ── Bottom — stats + trust ────────────────────────── */}
        <div className="relative z-10 space-y-5 anim-stats">
          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "rgba(242,234,247,0.28)" }}
          >
            Trusted by industry leaders
          </p>
          <div className="grid grid-cols-4 gap-2">
            <StatBlock value="50K+" label="Units" />
            <StatBlock value="15+" label="Orgs" />
            <StatBlock value="$2B+" label="Modeled" />
            <StatBlock value="100%" label="Secure" />
          </div>
          <div className="flex items-center gap-2">
            <Shield
              className="w-3 h-3 shrink-0"
              style={{ color: "rgba(197,157,217,0.45)" }}
            />
            <span
              className="text-[11px]"
              style={{ color: "rgba(242,234,247,0.3)" }}
            >
              SOC 2 compliant · End-to-end encrypted · GDPR ready
            </span>
          </div>
        </div>

        {/* Keyframe animations */}
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap");

          /* ── Floating orb animations ── */
          @keyframes float1 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(45px, 35px) scale(1.06);
            }
            66% {
              transform: translate(-25px, 55px) scale(0.96);
            }
          }
          @keyframes float2 {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(-35px, -45px) scale(1.04);
            }
            66% {
              transform: translate(25px, -20px) scale(0.97);
            }
          }

          /* ── Page-load entry animations ── */
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeLeft {
            from {
              opacity: 0;
              transform: translateX(-18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeRight {
            from {
              opacity: 0;
              transform: translateX(18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeScale {
            from {
              opacity: 0;
              transform: scale(0.94);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* ── Left panel staggered entry ── */
          .anim-logo {
            animation: fadeLeft 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.05s;
          }
          .anim-headline {
            animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.18s;
          }
          .anim-feat-1 {
            animation: fadeLeft 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.3s;
          }
          .anim-feat-2 {
            animation: fadeLeft 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.4s;
          }
          .anim-feat-3 {
            animation: fadeLeft 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.5s;
          }
          .anim-feat-4 {
            animation: fadeLeft 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.6s;
          }
          .anim-stats {
            animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.72s;
          }

          /* ── Right panel entry ── */
          .anim-mobile-hero {
            animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.1s;
          }
          .anim-card {
            animation: fadeScale 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.2s;
          }
          .anim-trust {
            animation: fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 0.55s;
          }

          /* ── Tab content slide-in ── */
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .slide-in {
            animation: slideIn 0.22s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          /* ── Expandable sections ── */
          @keyframes expandDown {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .expand-in {
            animation: expandDown 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          /* ── Scrollbar ── */
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #e9deef;
            border-radius: 4px;
          }
        `}</style>
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT — AUTH FORMS
         ════════════════════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14 relative overflow-y-auto"
        style={{
          background:
            "linear-gradient(145deg,#F2EAF7 0%,#FFFFFF 50%,#F9F5FC 100%)",
        }}
      >
        {/* Soft background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle,rgba(197,157,217,0.18) 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle,rgba(122,63,145,0.07) 0%,transparent 70%)",
            }}
          />
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          {/* ════════════════════════════════════════════════
              MOBILE HERO — visible only below lg breakpoint
             ════════════════════════════════════════════════ */}
          <div className="lg:hidden mb-10 anim-mobile-hero">
            {/* Mobile logo row */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#2B0D3E" }}
              >
                <LogoIconWhite size={40} />
              </div>
              <div>
                <h2
                  className="text-lg font-extrabold tracking-tight"
                  style={{ color: "#2B0D3E" }}
                >
                  RHS Engine
                </h2>
                <p className="text-xs font-medium" style={{ color: "#7A3F91" }}>
                  Smart Housing Planning
                </p>
              </div>
            </div>

            {/* Mobile hero content */}
            <div className="space-y-5 text-center">
              <div className="space-y-2.5">
                <h1
                  className="font-extrabold tracking-tight leading-tight"
                  style={{
                    fontSize: "clamp(1.75rem,6vw,2.25rem)",
                    color: "#2B0D3E",
                  }}
                >
                  Design the Future
                  <br />
                  <span style={{ color: "#7A3F91" }}>of Housing</span>
                </h1>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#7A3F91", opacity: 0.72 }}
                >
                  Harness advanced AI to synthesize complex architectural
                  constraints into beautiful, functional living spaces.
                  Real-time cost engineering meets high-fidelity design.
                </p>
              </div>

              {/* Mobile CTA buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setActiveTab("signup")}
                  className="flex-1 h-11 inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    border: "1.5px solid #E9DEEF",
                    background: "#FFFFFF",
                    color: "#2B0D3E",
                  }}
                >
                  Explore Features
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "#2B0D3E",
                    color: "#FFFFFF",
                    border: "none",
                    boxShadow: "0 4px 14px rgba(43,13,62,0.25)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </div>

              {/* Mobile trust line */}
              <p className="text-xs font-medium" style={{ color: "#C59DD9" }}>
                No credit card required · Free to explore
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              AUTH CARD
             ════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl anim-card"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E9DEEF",
              boxShadow:
                "0 8px 48px rgba(43,13,62,0.10), 0 2px 6px rgba(43,13,62,0.05)",
            }}
          >
            <div className="px-8 pt-8">
              {/* Card heading */}
              <div className="mb-6">
                <h2
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: "#2B0D3E" }}
                >
                  {activeTab === "signin"
                    ? "Welcome back"
                    : "Create your account"}
                </h2>
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: "#7A3F91", opacity: 0.65 }}
                >
                  {activeTab === "signin"
                    ? "Access the platform for housing planning & analysis"
                    : "Get started with smart housing analysis today"}
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(v: string) => {
                  if (v === "signin" || v === "signup") setActiveTab(v);
                }}
                className="w-full"
              >
                <TabsList
                  className="grid w-full grid-cols-2 h-11 p-1 rounded-xl mb-0"
                  style={{ background: "#F2EAF7" }}
                >
                  <TabsTrigger
                    value="signin"
                    className="rounded-lg text-sm font-bold transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#2B0D3E] data-[state=active]:shadow-sm data-[state=inactive]:text-[#7A3F91]"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-lg text-sm font-bold transition-all duration-150 data-[state=active]:bg-white data-[state=active]:text-[#2B0D3E] data-[state=active]:shadow-sm data-[state=inactive]:text-[#7A3F91]"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* ──────────────────────────────────────────
                    SIGN IN TAB
                   ────────────────────────────────────────── */}
                <TabsContent
                  value="signin"
                  className="mt-0 pt-6 space-y-3 slide-in"
                >
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      border: "1.5px solid #E9DEEF",
                      background: "#FFFFFF",
                      color: "#2B0D3E",
                      boxShadow: "0 1px 3px rgba(43,13,62,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#C59DD9";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#F2EAF7";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#E9DEEF";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#FFFFFF";
                    }}
                  >
                    <GoogleIcon /> Continue with Google
                  </button>

                  {/* Demo */}
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold cursor-pointer transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      border: "2px solid #7A3F91",
                      background: "rgba(122,63,145,0.04)",
                      color: "#7A3F91",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(122,63,145,0.09)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(122,63,145,0.04)";
                    }}
                  >
                    <Play className="h-3.5 w-3.5" /> Try Demo Project
                  </button>

                  <Divider label="or continue with email" />

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <FieldWrap
                      htmlFor="signin-email"
                      label="Email Address"
                      required
                      icon={Mail}
                    >
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className={withIcon}
                      />
                    </FieldWrap>

                    <FieldWrap
                      htmlFor="signin-name"
                      label="Full Name"
                      required
                      icon={User}
                    >
                      <Input
                        id="signin-name"
                        type="text"
                        placeholder="John Doe"
                        value={signInName}
                        onChange={(e) => setSignInName(e.target.value)}
                        required
                        className={withIcon}
                      />
                    </FieldWrap>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: "#7A3F91" }}
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm cursor-pointer font-medium"
                        style={{ color: "#7A3F91" }}
                      >
                        Remember me
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 rounded-xl font-bold text-sm text-white transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        background:
                          "linear-gradient(135deg,#7A3F91 0%,#5d2e70 100%)",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(122,63,145,0.28)",
                      }}
                    >
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                {/* ──────────────────────────────────────────
                    SIGN UP TAB
                   ────────────────────────────────────────── */}
                <TabsContent
                  value="signup"
                  className="mt-0 pt-6 space-y-3 slide-in scrollbar-thin"
                  style={{ maxHeight: 580, overflowY: "auto", paddingRight: 2 }}
                >
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      border: "1.5px solid #E9DEEF",
                      background: "#FFFFFF",
                      color: "#2B0D3E",
                      boxShadow: "0 1px 3px rgba(43,13,62,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#C59DD9";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#F2EAF7";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#E9DEEF";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#FFFFFF";
                    }}
                  >
                    <GoogleIcon /> Sign up with Google
                  </button>

                  <Divider label="or create account" />

                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-2 gap-3">
                      <FieldWrap
                        htmlFor="name"
                        label="Full Name"
                        required
                        icon={User}
                      >
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className={withIcon}
                        />
                      </FieldWrap>
                      <FieldWrap
                        htmlFor="email"
                        label="Email"
                        required
                        icon={Mail}
                      >
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={withIcon}
                        />
                      </FieldWrap>
                    </div>

                    {/* Role selector */}
                    <div className="space-y-1.5">
                      <Label
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: "#7A3F91" }}
                      >
                        Role <span style={{ color: "#ef4444" }}>*</span>
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowRoleSelector(!showRoleSelector)}
                        className="w-full h-11 px-4 rounded-xl text-sm flex items-center justify-between transition-all duration-150"
                        style={{
                          border: `1.5px solid ${showRoleSelector ? "#7A3F91" : "#E9DEEF"}`,
                          background: showRoleSelector
                            ? "rgba(122,63,145,0.03)"
                            : "#FFFFFF",
                          color: role ? "#2B0D3E" : "#C59DD9",
                          fontWeight: role ? 600 : 400,
                          fontFamily: "inherit",
                        }}
                      >
                        <span>{getRoleLabel()}</span>
                        {showRoleSelector ? (
                          <ChevronUp
                            className="h-4 w-4 shrink-0"
                            style={{ color: "#7A3F91" }}
                          />
                        ) : (
                          <ChevronDown
                            className="h-4 w-4 shrink-0"
                            style={{ color: "#C59DD9" }}
                          />
                        )}
                      </button>

                      {showRoleSelector && (
                        <div
                          className="grid grid-cols-2 gap-1.5 p-2 rounded-xl slide-in expand-in"
                          style={{
                            border: "1.5px solid #E9DEEF",
                            background: "#F2EAF7",
                          }}
                        >
                          {ROLE_OPTIONS.map((opt) => {
                            const IconComp = opt.icon;
                            const sel = role === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleRoleSelect(opt.value)}
                                className="p-2.5 rounded-xl text-left transition-all duration-150 hover:scale-[1.02]"
                                style={{
                                  border: `1.5px solid ${sel ? "#7A3F91" : "transparent"}`,
                                  background: sel
                                    ? "rgba(122,63,145,0.08)"
                                    : "#FFFFFF",
                                  fontFamily: "inherit",
                                }}
                              >
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <IconComp
                                    className={`h-3.5 w-3.5 shrink-0 ${sel ? "text-[#7A3F91]" : "text-[#C59DD9]"}`}
                                  />
                                  <p
                                    className="text-xs font-bold truncate"
                                    style={{
                                      color: sel ? "#7A3F91" : "#2B0D3E",
                                    }}
                                  >
                                    {opt.label}
                                  </p>
                                </div>
                                <p
                                  className="text-[11px] leading-snug"
                                  style={{ color: "#C59DD9" }}
                                >
                                  {opt.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Optional fields toggle */}
                    <div
                      style={{ borderTop: "1px solid #E9DEEF", paddingTop: 12 }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOptionalFields(!expandedOptionalFields)
                        }
                        className="w-full flex items-center justify-between transition-colors duration-150"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: "#7A3F91" }}
                        >
                          Optional Details
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#C59DD9" }}
                        >
                          {expandedOptionalFields ? "Hide" : "Add"}
                        </span>
                      </button>

                      {expandedOptionalFields && (
                        <div className="space-y-3 mt-3 slide-in expand-in">
                          <FieldWrap
                            htmlFor="organization"
                            label="Organization"
                            icon={Building2}
                          >
                            <Input
                              id="organization"
                              type="text"
                              placeholder="Government Agency, NGO, Developer…"
                              value={organization}
                              onChange={(e) => setOrganization(e.target.value)}
                              className={withIcon}
                            />
                          </FieldWrap>

                          <div className="grid grid-cols-2 gap-3">
                            <FieldWrap
                              htmlFor="phone"
                              label="Phone"
                              icon={Phone}
                            >
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+254 700 000000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={withIcon}
                              />
                            </FieldWrap>
                            <FieldWrap
                              htmlFor="country"
                              label="Country"
                              icon={MapPin}
                            >
                              <Input
                                id="country"
                                type="text"
                                placeholder="Kenya"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className={withIcon}
                              />
                            </FieldWrap>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 rounded-xl font-bold text-sm text-white transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                      style={{
                        background:
                          "linear-gradient(135deg,#7A3F91 0%,#5d2e70 100%)",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(122,63,145,0.28)",
                      }}
                    >
                      Create Account &amp; Get Started{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {/* Card footer */}
            <div
              className="mx-8 mb-7 mt-5 pt-5 flex items-center justify-center gap-2"
              style={{ borderTop: "1px solid #E9DEEF" }}
            >
              <Shield
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "#C59DD9" }}
              />
              <span
                className="text-[11px] font-medium"
                style={{ color: "#C59DD9" }}
              >
                Secured &amp; encrypted · No credit card required
              </span>
            </div>
          </div>

          {/* Below-card trust text */}
          <p
            className="mt-5 text-center text-[11px] font-medium anim-trust"
            style={{ color: "#C59DD9" }}
          >
            Trusted by housing agencies across East Africa &amp; beyond
          </p>
        </div>
      </div>
    </div>
  );
}
