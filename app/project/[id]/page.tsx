"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { projectStorage, scenarioStorage } from "@/lib/storage";
import type { Project, Scenario } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, ChevronLeft, Home, Menu, X, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { GlassLoader } from "@/components/glass-loader";
import { ScenarioSimulator } from "@/components/scenario-simulator";
import { ScenariosList } from "@/components/scenarios-list";
import { ProjectHeader } from "@/components/project-header";
import { ScenarioComparison } from "@/components/scenario-comparison";
import { DemandForecasting } from "@/components/demand-forecasting";
import { ProjectReport } from "@/components/project-report";
import { ProjectSettings } from "@/components/project-settings"
import { InvestmentReturns } from "@/components/investment-returns"
import { TimelineAndPhasing } from "@/components/timeline-and-phasing"
import { RegulatoryComplianceChecker } from "@/components/regulatory-compliance"
import { SpaceDesigner } from "@/components/space-designer"

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scenarios");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      const loadedProject = projectStorage.getById(resolvedParams.id) as unknown as Project | null;

      if (!loadedProject || loadedProject.userId !== user.id) {
        router.push("/");
        return;
      }

      setProject(loadedProject);
      loadScenarios();
      
      // Scroll to top when page loads
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Check navigation history
    setCanGoBack(window.history.length > 1);

    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [resolvedParams.id, user, isLoading, router]);

  const loadScenarios = () => {
    const projectScenarios = scenarioStorage.getByProjectId(resolvedParams.id);
    setScenarios(projectScenarios);
  };

  const handleCreateScenario = () => {
    if (!project) return;

    const newScenario = scenarioStorage.create({
      projectId: project.id,
      projectType: project.projectType,
      name: `Scenario ${scenarios.length + 1}`,
      unitSize: 50,
      unitsPerFloor: 8,
      numberOfFloors: 4,
      unitMix: {
        oneBedroom: 50,
        twoBedroom: 40,
        threeBedroom: 10,
      },
      sharedSpacePercentage: 20,
      numberOfUnits: 50,
      lotSize: 200,
      houseSize: 100,
      apartmentUnits: 100,
      singleFamilyUnits: 50,
      constructionCostPerSqm: 400,
      infrastructureCosts: {
        water: 15000,
        sewer: 20000,
        roads: 25000,
        electricity: 18000,
      },
      finishLevel: "standard" as const,
    });

    loadScenarios();
    setActiveScenarioId(newScenario.id);
    setActiveTab("simulator");
  };

  const handleScenarioDeleted = () => {
    loadScenarios();
    setActiveScenarioId(null);
  };

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleHome = useCallback(() => {
    router.push("/");
  }, [router]);

  if (isLoading || !project) {
    return <GlassLoader message="Loading project details..." />;
  }

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Left side: Navigation & Identity */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 group transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 group-hover:scale-105 transition-transform">
                  <Home className="h-5 w-5" />
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-sm font-black text-slate-900 leading-none">REALESTATE</span>
                  <span className="text-[10px] font-bold text-[#7A3F91] uppercase tracking-[0.2em]">HUB 2027</span>
                </div>
              </Link>
              
              <div className="h-6 w-[1px] bg-slate-200" />
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handleBack}
                  disabled={!canGoBack}
                  className={`group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold transition-all ${
                    canGoBack
                      ? "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className={`h-4 w-4 transition-transform ${canGoBack ? "group-hover:-translate-x-0.5" : ""}`} />
                  <span className="hidden md:inline">Back</span>
                </button>
              </div>
            </div>

            {/* Center Area: Page Context (Optional but professional) */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-50/50 px-4 py-1.5 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Project Control Center</span>
              </div>
            </div>

            {/* Right side: Global Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHome}
                  className="text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  <TrendingUp className="h-4 w-4 mr-2 text-[#7A3F91]" />
                  Dashboard
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setActiveTab("scenarios")}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200 rounded-lg px-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {/* User / Profile Placeholder or Menu */}
              <div className="h-8 w-8 rounded-full bg-[#7A3F91]/10 border border-[#7A3F91]/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-[#7A3F91]" />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex sm:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu drop-down */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-slate-100 py-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-slate-200 text-slate-600 font-bold"
                onClick={() => {
                  handleHome();
                  setMobileMenuOpen(false);
                }}
              >
                <Home className="h-4 w-4 mr-3 text-[#7A3F91]" />
                Analytics Dashboard
              </Button>
              <Button
                variant="default"
                className="w-full justify-start rounded-xl bg-slate-900 font-bold"
                onClick={() => {
                  setActiveTab("scenarios");
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-4 w-4 mr-3" />
                Initiate New Scenario
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-0">
          <ProjectHeader project={project} scenarios={scenarios} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="space-y-6"
            >
              <div className="w-full overflow-x-auto overflow-y-hidden">
                <TabsList className="bg-white border border-slate-200 rounded-lg inline-flex gap-1 px-1 py-1 min-w-full"
                  style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <TabsTrigger value="scenarios" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">Scenarios</TabsTrigger>
                  <TabsTrigger value="simulator" disabled={!activeScenario} className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">
                    Simulator
                  </TabsTrigger>
                  <TabsTrigger value="comparison" disabled={scenarios.length < 2} className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">
                    Comparison
                  </TabsTrigger>
                  <TabsTrigger value="forecasting" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">Forecasting</TabsTrigger>
                  <TabsTrigger value="investment" disabled={!activeScenario} className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">💰 Investment</TabsTrigger>
                   <TabsTrigger value="timeline" disabled={!activeScenario} className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">📅 Timeline</TabsTrigger>
                   <TabsTrigger value="compliance" disabled={!activeScenario} className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">✓ Compliance</TabsTrigger>
                   <TabsTrigger value="architecture" disabled={!activeScenario} className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">🎨 Architecture</TabsTrigger>
                   <TabsTrigger value="settings" className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">Settings</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="scenarios" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Project Scenarios
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Create and manage different design scenarios for this
                      project
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateScenario}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Scenario
                  </Button>
                </div>

                <ScenariosList
                  scenarios={scenarios}
                  project={project}
                  activeScenarioId={activeScenarioId}
                  onScenarioSelect={(id) => {
                    setActiveScenarioId(id);
                    setActiveTab("simulator");
                  }}
                  onScenarioDeleted={handleScenarioDeleted}
                />
              </TabsContent>

              <TabsContent value="simulator">
                {activeScenario && (
                  <ScenarioSimulator
                    scenario={activeScenario}
                    project={project}
                    onUpdate={loadScenarios}
                  />
                )}
              </TabsContent>

              <TabsContent value="comparison">
                {scenarios.length >= 2 && (
                  <ScenarioComparison scenarios={scenarios} project={project} />
                )}
              </TabsContent>

              <TabsContent value="forecasting">
                <DemandForecasting project={project} scenarios={scenarios} />
              </TabsContent>

              <TabsContent value="investment">
                {activeScenario && (
                  <InvestmentReturns
                    scenario={null}
                    scenarioResults={
                      activeScenario.calculatedResults || {
                        totalUnits: 0,
                        estimatedPopulation: 0,
                        builtUpArea: 0,
                        landCoveragePercentage: 0,
                        densityClassification: "low",
                        totalProjectCost: 0,
                        constructionCost: 0,
                        infrastructureCost: 0,
                        costPerUnit: 0,
                        costPerPerson: 0,
                        budgetStatus: "within",
                        dailyWaterDemand: 0,
                        electricityDemand: 0,
                        wasteGeneration: 0,
                        infrastructureStatus: "ok",
                      }
                    }
                    projectCurrency={project.budgetRange.currency}
                  />
                )}
              </TabsContent>

              <TabsContent value="timeline">
                {activeScenario && (
                  <TimelineAndPhasing
                    projectName={project.name}
                    totalCost={activeScenario.calculatedResults?.totalProjectCost || 0}
                    constructionMonths={12}
                    currency={project.budgetRange.currency}
                  />
                )}
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                 {activeScenario && (
                   <RegulatoryComplianceChecker
                     country={project.location.country}
                     city={project.location.city}
                     scenario={activeScenario}
                     scenarioResults={
                       activeScenario.calculatedResults || {
                         totalUnits: 0,
                         estimatedPopulation: 0,
                         builtUpArea: 0,
                         landCoveragePercentage: 0,
                         densityClassification: "low",
                         totalProjectCost: 0,
                         constructionCost: 0,
                         infrastructureCost: 0,
                         costPerUnit: 0,
                         costPerPerson: 0,
                         budgetStatus: "within",
                         dailyWaterDemand: 0,
                         electricityDemand: 0,
                         wasteGeneration: 0,
                         infrastructureStatus: "ok",
                       }
                     }
                   />
                 )}
               </TabsContent>

               <TabsContent value="architecture" className="space-y-6">
                 {activeScenario && (
                   <div className="h-[800px]">
                     <SpaceDesigner 
                       scenario={activeScenario} 
                       project={project}
                       onSave={(totalArea, rooms) => {
                         if (activeScenario) {
                           scenarioStorage.update(activeScenario.id, {
                             ...activeScenario,
                             unitSize: Math.round(totalArea),
                             houseSize: Math.round(totalArea),
                             architecture: { rooms }
                           });
                           loadScenarios();
                         }
                       }}
                     />
                   </div>
                 )}
               </TabsContent>

               <TabsContent value="settings">
                <ProjectSettings project={project} onUpdate={() => window.location.reload()} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <ProjectReport project={project} scenarios={scenarios} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
