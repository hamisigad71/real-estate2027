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
} from "lucide-react";

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
  {
    value: "Other",
    label: "Other",
    icon: Zap,
    description: "Other roles",
  },
];

/* ── Professional Logo SVG ─────────────────────────────────── */
function LogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
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
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      {/* Roofline */}
      <path
        d="M10 58 L50 22 L90 58"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Building body */}
      <rect x="24" y="56" width="52" height="28" rx="3" fill="url(#logoGrad)" opacity="0.15" />
      {/* Windows */}
      <rect x="33" y="62" width="10" height="8" rx="1.5" fill="url(#logoGrad)" opacity="0.7" />
      <rect x="57" y="62" width="10" height="8" rx="1.5" fill="url(#logoGrad)" opacity="0.7" />
      {/* Door */}
      <rect x="44" y="68" width="12" height="16" rx="2" fill="url(#logoGrad)" />
      {/* Analytics accent — upward trend line */}
      <path
        d="M62 48 L72 38 L82 42 L92 28"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="28" r="3" fill="#3b82f6" />
    </svg>
  );
}

function LogoIconWhite({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Roofline */}
      <path
        d="M10 58 L50 22 L90 58"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Building body */}
      <rect x="24" y="56" width="52" height="28" rx="3" fill="white" opacity="0.12" />
      {/* Windows */}
      <rect x="33" y="62" width="10" height="8" rx="1.5" fill="white" opacity="0.5" />
      <rect x="57" y="62" width="10" height="8" rx="1.5" fill="white" opacity="0.5" />
      {/* Door */}
      <rect x="44" y="68" width="12" height="16" rx="2" fill="white" opacity="0.8" />
      {/* Analytics accent */}
      <path
        d="M62 48 L72 38 L82 42 L92 28"
        fill="none"
        stroke="rgba(147,197,253,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="28" r="3" fill="rgba(147,197,253,0.9)" />
    </svg>
  );
}

/* ── Feature item for the branding panel ───────────────────── */
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
    <div className="flex items-start gap-3 group">
      <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-white/[0.1] transition-colors">
        <Icon className="w-4 h-4 text-blue-300" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white/95">{title}</h3>
        <p className="text-xs text-blue-200/60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ── Stat block ────────────────────────────────────────────── */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[11px] text-blue-200/50 uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUTH FORM — PREMIUM REDESIGN
   ══════════════════════════════════════════════════════════════ */
export function AuthForm() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [expandedOptionalFields, setExpandedOptionalFields] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInName, setSignInName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up Form State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState<RoleType | "">("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // Mounted state for animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ── handlers (unchanged logic) ──────────────────────────── */
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInName) {
      showError("Please fill in all required fields");
      return;
    }
    login(signInEmail, signInName);
    showSuccess(`Welcome back to RHS Engine, ${signInName}! Your dashboard is ready.`);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      showError("Please fill in all required fields");
      return;
    }
    login(email, name, organization, role, phone, country);
    showSuccess(`Account successfully created! Welcome to the RHS Engine ecosystem, ${name}.`);
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const demoEmail = "demo@example.com";
    const demoName = "Demo User";
    login(demoEmail, demoName, "Demo Organization", "Government Planner", "+1234567890", "United States");
    showSuccess(`Welcome back, ${demoName}! Access to your RHS Engine profile has been restored.`);
  };

  const handleQuickDemoLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    login("demo@example.com", "Demo User", "Demo Organization", "Government Planner", "+1234567890", "United States");
    showSuccess(`Demo environment initialized. Explore advanced architectural analysis for a sample 500-unit project.`);
  };

  const handleRoleSelect = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setShowRoleSelector(false);
  };

  const getRoleLabel = () => {
    const selected = ROLE_OPTIONS.find((opt) => opt.value === role);
    return selected ? selected.label : "Select your role";
  };

  /* ── render ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex bg-white">
      {/* ════════════════════════════════════════════════════════
          LEFT — DARK BRANDING PANEL
         ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#0a1628] flex-col justify-between p-10 xl:p-14">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{
              background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
              animation: mounted ? "float1 18s ease-in-out infinite" : "none",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
              animation: mounted ? "float2 22s ease-in-out infinite" : "none",
            }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Top content */}
        <div className="relative z-10 space-y-10">
          {/* Logo + Title */}
          <div className="space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
              <LogoIconWhite size={34} />
            </div>
            <div>
              <h1 className="text-4xl xl:text-[2.6rem] font-bold text-white tracking-tight leading-tight">
                RHS Engine
              </h1>
              <p className="mt-3 text-[15px] text-blue-200/50 leading-relaxed max-w-sm">
                Smart Affordable Housing Planning — Data-driven solutions for
                governments, NGOs, and developers.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <FeatureItem
              icon={Zap}
              title="Real-Time Financial Modeling"
              desc="Instantly calculate costs, ROI, and affordability metrics"
            />
            <FeatureItem
              icon={BarChart3}
              title="Scenario Comparison Engine"
              desc="Compare layouts, densities, and infrastructure impact"
            />
            <FeatureItem
              icon={Globe}
              title="Infrastructure Assessment"
              desc="Evaluate water, electricity, waste, and compliance needs"
            />
            <FeatureItem
              icon={TrendingUp}
              title="Demand Forecasting"
              desc="Project 5-20 year housing demand with demographic analysis"
            />
          </div>
        </div>

        {/* Bottom trust stats */}
        <div className="relative z-10">
          <div className="border-t border-white/[0.06] pt-6 mt-6">
            <p className="text-[11px] uppercase tracking-widest text-blue-200/30 mb-4 font-medium">
              Trusted by industry leaders
            </p>
            <div className="grid grid-cols-4 gap-3">
              <StatBlock value="50K+" label="Units" />
              <StatBlock value="15+" label="Orgs" />
              <StatBlock value="$2B+" label="Modeled" />
              <StatBlock value="100%" label="Secure" />
            </div>
          </div>
        </div>

        {/* Keyframes injected inline */}
        <style jsx global>{`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40px, 30px) scale(1.05); }
            66% { transform: translate(-20px, 50px) scale(0.97); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-30px, -40px) scale(1.03); }
            66% { transform: translate(20px, -20px) scale(0.98); }
          }
        `}</style>
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT — AUTH FORMS
         ════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30">
        <div className="w-full max-w-md">
          {/* Mobile logo header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-[#0a1628] flex items-center justify-center">
                <LogoIconWhite size={26} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">RHS Engine</h2>
                <p className="text-xs text-slate-500">
                  Smart Housing Planning
                </p>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.06)] border border-slate-100/80 p-7 sm:p-9">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                {activeTab === "signin" ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
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
              <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-slate-100/80 rounded-xl p-1">
                <TabsTrigger
                  value="signin"
                  className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* ──── SIGN IN TAB ──────────────────────────── */}
              <TabsContent value="signin" className="space-y-4 mt-0">
                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-sm font-medium transition-all cursor-pointer shadow-sm"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                {/* Demo button */}
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0a1628] bg-[#0a1628]/[0.03] hover:bg-[#0a1628] hover:text-white text-sm font-semibold text-[#0a1628] transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  Try Demo Project
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                      or continue with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signin-name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-name"
                        type="text"
                        placeholder="John Doe"
                        value={signInName}
                        onChange={(e) => setSignInName(e.target.value)}
                        required
                        className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 w-4 h-4"
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#0a1628] hover:bg-[#132240] text-white font-semibold shadow-lg shadow-slate-900/10 transition-all"
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              {/* ──── SIGN UP TAB ──────────────────────────── */}
              <TabsContent value="signup" className="space-y-4 mt-0 max-h-[580px] overflow-y-auto pr-1">
                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-sm font-medium transition-all cursor-pointer shadow-sm"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                      or create account
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Essential fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role selection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Role *
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowRoleSelector(!showRoleSelector)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-sm font-medium text-left flex items-center justify-between transition-all"
                    >
                      <span className={role ? "text-slate-900" : "text-slate-400"}>
                        {getRoleLabel()}
                      </span>
                      {showRoleSelector ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </button>

                    {showRoleSelector && (
                      <div className="grid grid-cols-2 gap-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50/50">
                        {ROLE_OPTIONS.map((opt) => {
                          const IconComponent = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleRoleSelect(opt.value)}
                              className={`p-2.5 rounded-lg text-left border transition-all ${
                                role === opt.value
                                  ? "border-blue-500 bg-blue-50 shadow-sm"
                                  : "border-transparent bg-white hover:bg-slate-50 hover:border-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-0.5">
                                <IconComponent className={`h-3.5 w-3.5 ${role === opt.value ? "text-blue-600" : "text-slate-500"}`} />
                                <p className="text-xs font-semibold text-slate-800">
                                  {opt.label}
                                </p>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug">
                                {opt.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Optional fields */}
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setExpandedOptionalFields(!expandedOptionalFields)}
                      className="w-full flex items-center justify-between py-2 px-1 text-sm font-medium text-slate-600 hover:text-slate-900 rounded transition-colors"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider">Optional Details</span>
                      <span className="text-xs text-blue-600 font-medium">
                        {expandedOptionalFields ? "Hide" : "Show"}
                      </span>
                    </button>

                    {expandedOptionalFields && (
                      <div className="space-y-3 mt-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="organization" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Organization
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id="organization"
                              type="text"
                              placeholder="Government Agency, NGO, Developer..."
                              value={organization}
                              onChange={(e) => setOrganization(e.target.value)}
                              className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Phone
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1234567890"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="country" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            Country
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              id="country"
                              type="text"
                              placeholder="United States"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#0a1628] hover:bg-[#132240] text-white font-semibold shadow-lg shadow-slate-900/10 transition-all"
                  >
                    Create Account & Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="h-3 w-3" />
              <span>Secured & encrypted · No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
