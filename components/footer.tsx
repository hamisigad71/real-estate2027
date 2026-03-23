"use client";

import { useState } from "react";
import {
  Building2,
  TrendingUp,
  Users,
  Zap,
  Github,
  Mail,
  ExternalLink,
  Code,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [creatorOpen, setCreatorOpen] = useState(false);

  return (
    <footer className="relative mt-16 border-t border-border bg-background">
      {/* Subtle decorative overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-linear-to-t from-primary/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Building2 className="w-9 h-9 text-primary" />
                <TrendingUp className="w-5 h-5 text-accent absolute -bottom-1 -right-1" />
              </div>
              <h3 className="text-xl font-bold bg-linear-to-r from-primary to-[#7A3F91] bg-clip-text text-transparent">
                HousingPlan
              </h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Empowering urban planners and developers with intelligent tools for sustainable and inclusive housing projects.
            </p>
          </div>

          {/* Platform Metrics */}
          <div className="space-y-5">
            <h4 className="font-semibold text-foreground">Key Capabilities</h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Unlimited Scenarios</p>
                  <p className="text-xs text-muted-foreground">Plan without limits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-medium">Instant Analysis</p>
                  <p className="text-xs text-muted-foreground">Real-time calculations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Population Forecasting</p>
                  <p className="text-xs text-muted-foreground">Accurate demand insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-semibold text-foreground">Features</h4>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm sm:gap-x-4 md:grid-cols-1 md:gap-y-3">
              {["Cost Analysis", "Layout Visualization", "Demand Forecasting", "Infrastructure Impact", "Scenario Comparison"].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 min-w-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-1.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-5">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="space-y-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all group"
              >
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
              </a>
              <a
                href="mailto:support@housingplan.dev"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Get in Touch</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p>© {currentYear} HousingPlan. Crafted for sustainable urban futures.</p>
            <p className="text-xs mt-1">
              A smart platform for planning, simulating, and comparing real estate projects in Kenya.
            </p>
          </div>

          <div className="flex w-full md:w-auto flex-col items-end gap-3 md:ml-auto">
            <div className="flex items-center gap-8 text-xs font-medium">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            </div>

            {/* Developer section */}
            <div className="relative flex w-full justify-end md:w-auto" suppressHydrationWarning>
              <button
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 border border-border text-muted-foreground bg-card hover:text-primary hover:border-primary/40"
                onClick={() => setCreatorOpen((v) => !v)}
                suppressHydrationWarning={true}
              >
                <Code className="w-3 h-3 text-primary" />
                Built by
                {creatorOpen ? (
                  <ChevronUp className="w-3 h-3 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-3 h-3 transition-transform duration-200" />
                )}
              </button>

              {creatorOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-72 rounded-3xl border border-border bg-card p-5 shadow-2xl z-50"
                >
                  <div className="h-1 -mx-5 -mt-5 mb-4 rounded-t-3xl bg-linear-to-r from-[#2B0D3E] via-[#7A3F91] to-[#C59DD9]" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/profile-avatar.jpg"
                        alt="Daysman Gad"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/30"
                      />
                      <div>
                        <p className="text-sm font-bold leading-none text-foreground">Daysman Gad</p>
                        <p className="text-xs text-muted-foreground">Full-stack Developer</p>
                      </div>
                    </div>

                    <div className="border-t border-border" />

                    <div className="space-y-2.5">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Built with precision for better housing decisions in Kenya.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Next.js", "Prisma", "TypeScript"].map((t) => (
                          <span
                            key={t}
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full border border-primary/25 bg-primary/10 text-primary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border" />

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Made with <span className="text-primary">♥</span> in Nairobi
                      </p>
                      <span className="text-xs font-bold px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary">
                        v1.0.0
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}