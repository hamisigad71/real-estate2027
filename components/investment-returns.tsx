"use client"

import { useState, useEffect } from "react"
import type { InvestmentScenario, ScenarioResults, InvestmentResults } from "@/lib/types"
import { calculateInvestmentReturns, formatCurrency, formatNumber } from "@/lib/calculations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Zap
} from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface InvestmentReturnsProps {
  scenario: InvestmentScenario | null
  scenarioResults: ScenarioResults
  projectCurrency: string
}

export function InvestmentReturns({
  scenario,
  scenarioResults,
  projectCurrency,
}: InvestmentReturnsProps) {
  const [investment, setInvestment] = useState<InvestmentScenario | null>(scenario)
  const [results, setResults] = useState<InvestmentResults | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Default investment scenario if none provided
  const defaultInvestment: InvestmentScenario = {
    id: "default",
    projectId: "",
    scenarioId: "",
    name: "Standard Investment",
    financing: {
      loanType: "construction",
      loanAmount: scenarioResults.totalProjectCost * 0.7,
      interestRate: 8.5,
      loanTermMonths: 240,
      downPaymentPercentage: 30,
    },
    unitPricing: {
      oneBedroom: 150000,
      twoBedroom: 200000,
      threeBedroom: 250000,
    },
    occupancyRate: 95,
    rentalModel: "sale",
    constructionCost: scenarioResults.totalProjectCost,
    softCostsPercentage: 12,
    marketingBudget: 50000,
    constructionMonths: 18,
    preSalesMonths: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  useEffect(() => {
    const inv = investment || defaultInvestment
    if (inv && scenarioResults) {
      const calcs = calculateInvestmentReturns(inv, scenarioResults)
      setResults(calcs)
    }
  }, [investment, scenarioResults])

  if (!results) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Investment Returns Analysis
          </CardTitle>
          <CardDescription>Loading investment analysis...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getSensitivityColor = (value: number) => {
    if (value > 0) return "text-emerald-600"
    if (value < 0) return "text-red-600"
    return "text-slate-600"
  }

  // Prepare sensitivity data for chart
  const sensitivityData = [
    { scenario: "Base Case", netProfit: results.netProfit },
    { scenario: "Const +10%", netProfit: results.sensitivity.constructionCostChange.increase10Percent },
    { scenario: "Const -10%", netProfit: results.sensitivity.constructionCostChange.decrease10Percent },
    { scenario: "Occupancy 85%", netProfit: results.sensitivity.occupancyChange.occupancy85Percent },
    { scenario: "Occupancy 100%", netProfit: results.sensitivity.occupancyChange.occupancy100Percent },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ROI Card */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{results.roi.toFixed(1)}%</div>
            <p className="text-xs text-emerald-600 mt-1">Return on Investment</p>
          </CardContent>
        </Card>

        {/* Net Profit Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(results.netProfit, projectCurrency)}
            </div>
            <p className="text-xs text-blue-600 mt-1">{results.profitMargin.toFixed(1)}% margin</p>
          </CardContent>
        </Card>

        {/* Payback Period Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              Payback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{results.paybackMonths} mo</div>
            <p className="text-xs text-purple-600 mt-1">Break-even in {results.breakEvenMonths} months</p>
          </CardContent>
        </Card>

        {/* IRR Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              IRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{results.irr.toFixed(1)}%</div>
            <p className="text-xs text-orange-600 mt-1">Internal Rate of Return</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="affordability">Affordability</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Economics Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue Section */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-3">Revenue Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Total Revenue</p>
                    <p className="text-xl font-bold text-emerald-700">
                      {formatCurrency(results.totalRevenue, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Revenue per Unit</p>
                    <p className="text-xl font-bold text-emerald-700">
                      {formatCurrency(results.revenuePerUnit, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Gross Margin</p>
                    <p className="text-xl font-bold text-emerald-700">
                      {formatCurrency(results.grossMargin, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Gross Margin %</p>
                    <p className="text-xl font-bold text-emerald-700">
                      {results.grossMarginPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Cost Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Total Project Cost</p>
                    <p className="text-xl font-bold text-slate-700">
                      {formatCurrency(results.totalProjectCost, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Expenses</p>
                    <p className="text-xl font-bold text-slate-700">
                      {formatCurrency(results.totalExpenses, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Interest Expense</p>
                    <p className="text-xl font-bold text-slate-700">
                      {formatCurrency(results.interestExpense, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Cost per Unit</p>
                    <p className="text-xl font-bold text-slate-700">
                      {formatCurrency(results.totalProjectCost / scenarioResults.totalUnits, projectCurrency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profitability Section */}
              <div className={`border rounded-lg p-4 ${results.netProfit > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className={`font-semibold mb-3 ${results.netProfit > 0 ? 'text-green-900' : 'text-red-900'}`}>
                  Profitability
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Net Profit</p>
                    <p className={`text-2xl font-bold ${results.netProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(results.netProfit, projectCurrency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Profit Margin</p>
                    <p className={`text-2xl font-bold ${results.netProfit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {results.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financing & Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Financing Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Loan Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Monthly Payment</span>
                      <span className="font-semibold text-blue-700">
                        {formatCurrency(results.monthlyLoanPayment, projectCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Interest Expense</span>
                      <span className="font-semibold text-blue-700">{formatCurrency(results.interestExpense, projectCurrency)}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-900">Total Loan Cost</span>
                        <span className="font-bold text-blue-700">
                          {formatCurrency(results.totalLoanCost, projectCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Metrics */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-900 mb-3">Return Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">ROI</span>
                      <span className="font-semibold text-emerald-700">{results.roi.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">IRR</span>
                      <span className="font-semibold text-emerald-700">{results.irr.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Payback Period</span>
                      <span className="font-semibold text-emerald-700">{results.paybackMonths} months</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Break-Even</span>
                      <span className="font-semibold text-emerald-700">{results.breakEvenMonths} months</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affordability Tab */}
        <TabsContent value="affordability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Affordability Analysis</CardTitle>
              <CardDescription>
                Understanding the affordability gap and subsidy requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-600 mb-2">Market Price per Unit</p>
                  <p className="text-2xl font-bold text-slate-700">
                    {formatCurrency(results.marketPrice, projectCurrency)}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-600 mb-2">Minimum Affordable Price</p>
                  <p className="text-2xl font-bold text-slate-700">
                    {formatCurrency(results.minimumAffordablePrice, projectCurrency)}
                  </p>
                </div>

                <div className={`border rounded-lg p-4 ${results.affordabilityGap > 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${results.affordabilityGap > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    Affordability Gap per Unit
                  </p>
                  <p className={`text-2xl font-bold ${results.affordabilityGap > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                    {formatCurrency(results.affordabilityGap, projectCurrency)}
                  </p>
                </div>

                <div className={`border rounded-lg p-4 ${results.subsidyRequired > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${results.subsidyRequired > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Total Subsidy Required
                  </p>
                  <p className={`text-2xl font-bold ${results.subsidyRequired > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {formatCurrency(results.subsidyRequired, projectCurrency)}
                  </p>
                </div>
              </div>

              {results.subsidyRequired > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Subsidy Needed</p>
                    <p className="text-sm text-amber-800">
                      This project requires {formatCurrency(results.subsidyRequired, projectCurrency)} in subsidies to achieve affordability targets. Consider government programs, grants, or cross-subsidization.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitivity Analysis Tab */}
        <TabsContent value="sensitivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sensitivity Analysis</CardTitle>
              <CardDescription>
                How net profit changes with key parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chart */}
              <div className="w-full h-80 bg-slate-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="scenario" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number, projectCurrency)}
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="netProfit" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sensitivity Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Construction Cost */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Construction Cost Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">+10% Cost</span>
                      <span className={`font-semibold ${getSensitivityColor(results.sensitivity.constructionCostChange.increase10Percent)}`}>
                        {formatCurrency(results.sensitivity.constructionCostChange.increase10Percent, projectCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">-10% Cost</span>
                      <span className={`font-semibold ${getSensitivityColor(results.sensitivity.constructionCostChange.decrease10Percent)}`}>
                        {formatCurrency(results.sensitivity.constructionCostChange.decrease10Percent, projectCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Occupancy */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Occupancy Rate Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">85% Occupancy</span>
                      <span className={`font-semibold ${getSensitivityColor(results.sensitivity.occupancyChange.occupancy85Percent)}`}>
                        {formatCurrency(results.sensitivity.occupancyChange.occupancy85Percent, projectCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">100% Occupancy</span>
                      <span className={`font-semibold ${getSensitivityColor(results.sensitivity.occupancyChange.occupancy100Percent)}`}>
                        {formatCurrency(results.sensitivity.occupancyChange.occupancy100Percent, projectCurrency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
