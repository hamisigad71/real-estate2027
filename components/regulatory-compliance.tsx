"use client"

import { useState, useEffect } from "react"
import type { RegulatoryCompliance, ComplianceRule, ComplianceStatus } from "@/lib/types"
import { getComplianceRulesForLocation, evaluateCompliance, formatCurrency } from "@/lib/calculations"
import type { Scenario, ScenarioResults } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  FileCheck,
  TrendingUp,
  Lightbulb,
} from "lucide-react"

interface RegulatoryComplianceProps {
  country: string
  city?: string
  scenario: Scenario
  scenarioResults: ScenarioResults
}

export function RegulatoryComplianceChecker({
  country,
  city,
  scenario,
  scenarioResults,
}: RegulatoryComplianceProps) {
  const [compliance, setCompliance] = useState<RegulatoryCompliance | null>(null)
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  useEffect(() => {
    const rules = getComplianceRulesForLocation(country, city)
    const evaluated = evaluateCompliance(scenario, scenarioResults, rules)
    setCompliance(evaluated)
  }, [country, city, scenario, scenarioResults])

  if (!compliance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Compliance</CardTitle>
        </CardHeader>
        <CardContent>Loading compliance data...</CardContent>
      </Card>
    )
  }

  const getStatusColor = (compliant: boolean) => {
    return compliant ? "text-emerald-600" : "text-red-600"
  }

  const getStatusIcon = (compliant: boolean) => {
    return compliant ? (
      <CheckCircle className="h-5 w-5 text-emerald-600" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-600" />
    )
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      building: "bg-blue-50 text-blue-700 border-blue-200",
      zoning: "bg-purple-50 text-purple-700 border-purple-200",
      accessibility: "bg-emerald-50 text-emerald-700 border-emerald-200",
      environmental: "bg-green-50 text-green-700 border-green-200",
      affordability: "bg-orange-50 text-orange-700 border-orange-200",
      sustainability: "bg-teal-50 text-teal-700 border-teal-200",
    }
    return colors[category] || "bg-slate-50 text-slate-700 border-slate-200"
  }

  const getImpactColor = (impact: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-700 border-red-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    }
    return colors[impact] || "bg-slate-100 text-slate-700 border-slate-300"
  }

  const nonCompliantRules = compliance.complianceStatus.filter((s) => !s.compliant)

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Compliance Score */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileCheck className="h-3 w-3 text-blue-600" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {compliance.compliancePercentage.toFixed(0)}%
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{compliance.compliantRules} OF {compliance.totalRulesApplied} RULES MET</p>
          </CardContent>
        </Card>

        {/* Compliant Rules */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              Compliant
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight">{compliance.compliantRules}</div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">RULES SATISFIED</p>
          </CardContent>
        </Card>

        {/* Non-Compliant Rules */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className={`h-3 w-3 ${nonCompliantRules.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className={`text-2xl font-black tracking-tight ${nonCompliantRules.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {compliance.nonCompliantRules}
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">
              {nonCompliantRules.length > 0 ? "ACTION REQUIRED" : "ALL CLEAR"}
            </p>
          </CardContent>
        </Card>

        {/* Remediation Cost */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-amber-500" />
              Remediation
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(compliance.totalRemediateCost, "USD")}
            </div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">ESTIMATED COST</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      {nonCompliantRules.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 mb-1">Compliance Issues Detected</p>
            <p className="text-sm text-red-800">
              Your scenario has {nonCompliantRules.length} rule violation(s) that need to be addressed. Review the issues below and adjust your configuration accordingly.
            </p>
          </div>
        </div>
      )}

      {/* Compliance Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applicable Rules & Requirements</CardTitle>
          <CardDescription>
            {compliance.country}{compliance.city && `, ${compliance.city}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {compliance.complianceStatus.map((status, idx) => {
              const rule = compliance.applicableRules.find((r) => r.id === status.ruleId)
              if (!rule) return null

              return (
                <div
                  key={status.ruleId}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    expandedRule === status.ruleId ? "ring-2 ring-blue-500" : ""
                  } ${status.compliant ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'}`}
                  onClick={() => setExpandedRule(expandedRule === status.ruleId ? null : status.ruleId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getStatusIcon(status.compliant)}</div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className={`text-sm font-bold tracking-tight ${status.compliant ? 'text-slate-900' : 'text-rose-900'}`}>
                            {rule.name}
                          </h4>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rule.code}</span>
                          <div className="flex gap-1.5 ml-auto sm:ml-0">
                            <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-wider h-5 px-2 ${getCategoryColor(rule.category)}`}>
                              {rule.category}
                            </Badge>
                            <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-wider h-5 px-2 ${getImpactColor(rule.impact)}`}>
                              {rule.impact}
                            </Badge>
                          </div>
                        </div>
                        <p className={`text-xs leading-relaxed font-medium ${status.compliant ? 'text-slate-500' : 'text-rose-700/80'}`}>
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRule === status.ruleId && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <p className="font-medium text-sm text-slate-900 mb-1">Requirement</p>
                        <p className="text-sm text-slate-700">{rule.requirement}</p>
                      </div>

                      {!status.compliant && (
                        <>
                          <div className={`bg-red-50 border border-red-200 rounded p-3`}>
                            <p className="font-medium text-sm text-red-900 mb-1">Issue</p>
                            <p className="text-sm text-red-800">{status.notes}</p>
                          </div>

                          {status.suggestedAdjustment && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="font-medium text-sm text-blue-900 mb-1 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Suggested Adjustment
                              </p>
                              <p className="text-sm text-blue-800">{status.suggestedAdjustment}</p>
                            </div>
                          )}

                          {status.remedialCost && (
                            <div className="bg-amber-50 border border-amber-200 rounded p-3">
                              <p className="font-medium text-sm text-amber-900 mb-1">Remediation Cost</p>
                              <p className="text-sm text-amber-800">
                                Estimated {formatCurrency(status.remedialCost, "USD")} to address this issue
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {status.compliant && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-emerald-800">This requirement is met by your configuration.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {compliance.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Actions to improve compliance and project viability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {compliance.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 ${
                    rec.priority === "critical"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 mt-1 ${
                        rec.priority === "critical"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-amber-100 text-amber-700 border-amber-300"
                      }`}
                    >
                      {rec.priority.toUpperCase()}
                    </Badge>
                    <div className="flex-1">
                      <p className={`font-semibold ${rec.priority === "critical" ? "text-red-900" : "text-amber-900"}`}>
                        {rec.action}
                      </p>
                      {rec.estimatedCost && (
                        <p className={`text-sm mt-1 ${rec.priority === "critical" ? "text-red-700" : "text-amber-700"}`}>
                          <span className="font-medium">Cost:</span> {formatCurrency(rec.estimatedCost, "USD")}
                        </p>
                      )}
                      {rec.timeline && (
                        <p className={`text-sm ${rec.priority === "critical" ? "text-red-700" : "text-amber-700"}`}>
                          <span className="font-medium">Timeline:</span> {rec.timeline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Certifications */}
      {compliance.certifications && compliance.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optional Certifications</CardTitle>
            <CardDescription>
              Additional certifications to enhance project value and sustainability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compliance.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{cert.name}</h4>
                    {cert.achievable ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  {cert.cost && (
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Cost:</span> {formatCurrency(cert.cost, "USD")}
                    </p>
                  )}
                  <p className={`text-xs mt-2 ${cert.achievable ? "text-emerald-600" : "text-slate-500"}`}>
                    {cert.achievable ? "Can be achieved with this configuration" : "Not achievable with current configuration"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
