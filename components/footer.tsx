"use client";

import {
  Building2,
  TrendingUp,
  Users,
  Zap,
  Github,
  Mail,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-border bg-background">
      {/* Subtle decorative overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-primary/20 to-transparent" />
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
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
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
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Instant Analysis</p>
                  <p className="text-xs text-muted-foreground">Real-time calculations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
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
            <ul className="space-y-3 text-sm">
              {["Cost Analysis", "Layout Visualization", "Demand Forecasting", "Infrastructure Impact", "Scenario Comparison"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {item}
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
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p>© {currentYear} HousingPlan. Crafted for sustainable urban futures.</p>
            <p className="text-xs mt-1">Powered by Next.js • Built by Daysman Gad</p>
          </div>

          <div className="flex items-center gap-8 text-xs font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}