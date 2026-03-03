// Core calculation engine for housing planning

import type { 
  Scenario, 
  ScenarioResults, 
  CostAssumptions, 
  DemandForecast, 
  InvestmentScenario, 
  InvestmentResults, 
  ProjectTimeline, 
  RegulatoryCompliance, 
  ComplianceRule,
  HomeBuilderConfig,
  HomeSpecification,
  ConstructionPhase,
} from "./types"
import { getCountryData } from "./country-data"

/**
 * Calculate all metrics for a scenario
 */
export function calculateScenarioResults(
  scenario: Scenario,
  projectBudget: { min: number; max: number },
  landSize: number,
  costAssumptions: CostAssumptions,
): ScenarioResults {
  let totalUnits = 0
  let estimatedPopulation = 0
  let builtUpArea = 0

  // Use custom assumptions if provided
  const personsPerUnit = scenario.customAssumptions?.personsPerUnit || costAssumptions.personsPerUnit
  const singleFamilyPersons = scenario.customAssumptions?.singleFamilyPersonsPerUnit || costAssumptions.singleFamilyPersonsPerUnit

  // Calculate based on project type
  if (scenario.projectType === "apartment") {
    if (!scenario.unitsPerFloor || !scenario.numberOfFloors) {
      throw new Error("Apartment scenarios require unitsPerFloor and numberOfFloors")
    }
    
    totalUnits = scenario.unitsPerFloor * scenario.numberOfFloors

    if (!scenario.unitMix) {
      throw new Error("Apartment scenarios require unitMix percentages")
    }

    const oneBedroomUnits = Math.round(totalUnits * (scenario.unitMix.oneBedroom / 100))
    const twoBedroomUnits = Math.round(totalUnits * (scenario.unitMix.twoBedroom / 100))
    const threeBedroomUnits = totalUnits - oneBedroomUnits - twoBedroomUnits

    const oneBedPeople = personsPerUnit.oneBedroom || 2
    const twoBedPeople = personsPerUnit.twoBedroom || 3
    const threeBedPeople = personsPerUnit.threeBedroom || 4

    estimatedPopulation =
      oneBedroomUnits * oneBedPeople +
      twoBedroomUnits * twoBedPeople +
      threeBedroomUnits * threeBedPeople

    const totalUnitArea = totalUnits * (scenario.unitSize || 50)
    const sharedArea = totalUnitArea * ((scenario.sharedSpacePercentage || 20) / 100)
    builtUpArea = totalUnitArea + sharedArea
  } else if (scenario.projectType === "single-family") {
    totalUnits = scenario.numberOfUnits || 0
    estimatedPopulation = totalUnits * singleFamilyPersons
    builtUpArea = totalUnits * (scenario.unitSize || 150)
  } else if (scenario.projectType === "mixed") {
    // Mixed-use calculations
    const residentialUnits = scenario.numberOfUnits || 0
    totalUnits = residentialUnits
    const oneBedPeople = personsPerUnit.oneBedroom || 2
    const twoBedPeople = personsPerUnit.twoBedroom || 3
    estimatedPopulation = residentialUnits * ((oneBedPeople + twoBedPeople) / 2)
    builtUpArea = residentialUnits * 60
  }

  // Calculate costs
  const costPerSqm = scenario.constructionCostPerSqm
  const infrastructureCostPerUnit = 15000
  const softCostPercentage = 15
  const contingencyPercentage = 10

  const constructionCost = builtUpArea * costPerSqm
  const infrastructureCost = totalUnits * infrastructureCostPerUnit
  const subtotal = constructionCost + infrastructureCost
  
  // Statutory Fees (Based on Kenyan metrics)
  // VAT: 16% on construction
  const vatAmount = constructionCost * 0.16
  // Stamp Duty: 4% for urban properties
  const stampDuty = (constructionCost + infrastructureCost) * 0.04
  // NEMA: 0.1% of project cost (min 10k KES, approx $80)
  const nemaFeeRequested = (constructionCost + infrastructureCost) * 0.001
  const nemaFee = Math.max(80, nemaFeeRequested)
  // NCA: 0.5% of project cost for projects > 5M KES
  const ncaFee = (constructionCost + infrastructureCost) * 0.005
  
  const totalFees = vatAmount + stampDuty + nemaFee + ncaFee

  const softCosts = subtotal * (softCostPercentage / 100)
  const contingency = subtotal * (contingencyPercentage / 100)
  const totalProjectCost = subtotal + softCosts + contingency + totalFees

  // Calculate per-unit costs
  const costPerUnit = totalUnits > 0 ? totalProjectCost / totalUnits : 0
  const costPerPerson = estimatedPopulation > 0 ? totalProjectCost / estimatedPopulation : 0

  // Determine density classification
  const densityPerHectare = builtUpArea > 0 ? (totalUnits / (builtUpArea / 10000)) : 0
  const densityThresholds = costAssumptions.densityThresholds
  let densityClassification: "low" | "medium" | "high" | "very-high" = "low"
  if (densityPerHectare > densityThresholds.veryHigh) densityClassification = "very-high"
  else if (densityPerHectare > densityThresholds.high) densityClassification = "high"
  else if (densityPerHectare > densityThresholds.medium) densityClassification = "medium"

  // Calculate infrastructure impact
  const dailyWaterDemand = estimatedPopulation * costAssumptions.waterLitersPerPerson
  const electricityDemand = estimatedPopulation * costAssumptions.electricityKwhPerPerson
  const wasteGeneration = estimatedPopulation * costAssumptions.wasteKgPerPerson

  // Determine infrastructure status
  let infrastructureStatus: "ok" | "warning" | "exceeds" = "ok"
  const warningLevels = costAssumptions.infrastructureWarningLevels
  if (dailyWaterDemand > warningLevels.waterDemandExceeds || estimatedPopulation > warningLevels.populationExceeds) {
    infrastructureStatus = "exceeds"
  } else if (dailyWaterDemand > warningLevels.waterDemandWarning || estimatedPopulation > warningLevels.populationWarning) {
    infrastructureStatus = "warning"
  }

  // Determine budget status
  let budgetStatus: "under" | "within" | "over" = "within"
  if (totalProjectCost < projectBudget.min) budgetStatus = "under"
  else if (totalProjectCost > projectBudget.max) budgetStatus = "over"

  const landCoveragePercentage = builtUpArea > 0 ? (builtUpArea / (landSize * 10000)) * 100 : 0

  return {
    totalUnits,
    estimatedPopulation,
    builtUpArea,
    landCoveragePercentage,
    densityClassification,
    totalProjectCost,
    constructionCost,
    infrastructureCost,
    costPerUnit,
    costPerPerson,
    budgetStatus,
    dailyWaterDemand,
    electricityDemand,
    wasteGeneration,
    infrastructureStatus,
    statutoryFees: {
      stampDuty,
      nemaFee,
      ncaFee,
      vatAmount,
      totalFees,
    },
  }
}

/**
 * Calculate housing demand forecast
 */
export function calculateDemandForecast(
  projectId: string,
  currentPopulation: number,
  annualGrowthRate: number,
  timeHorizon: 5 | 10 | 20 = 10,
): DemandForecast {
  const projections = []
  for (let year = 1; year <= timeHorizon; year++) {
    const population = currentPopulation * Math.pow(1 + annualGrowthRate / 100, year)
    const housingDemand = Math.round(population / 3.5) // avg household size
    projections.push({
      year,
      population: Math.round(population),
      housingDemand,
      surplusShortfall: housingDemand - (currentPopulation / 3.5),
    })
  }

  return {
    projectId,
    currentPopulation,
    annualGrowthRate,
    timeHorizon,
    projections,
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toFixed(0)
}

// ========== HOME BUILDER CALCULATIONS ==========

const STYLE_MULTIPLIERS: Record<string, number> = {
  basic: 1.0,
  standard: 1.5,
  luxury: 2.5,
  modern: 1.8,
  traditional: 1.3,
}

const SIZE_BASE_AREAS: Record<string, number> = {
  small: 60,
  medium: 100,
  large: 150,
  spacious: 200,
}

const FEATURE_COSTS: Record<string, number> = {
  solarPanels: 8000,
  smartHome: 5000,
  airConditioning: 6000,
  swimmingPool: 25000,
  garage: 12000,
  garden: 4000,
}

/**
 * Calculate home building specification based on config
 */
export function calculateHomeSpecification(config: HomeBuilderConfig): HomeSpecification {
  const countryData = getCountryData(config.countryCode)
  const styleMultiplier = STYLE_MULTIPLIERS[config.style] || 1.0
  
  let baseCostPerSqm = countryData.constructionCosts.standard
  if (config.style === "basic") {
    baseCostPerSqm = countryData.constructionCosts.basic
  } else if (config.style === "luxury") {
    baseCostPerSqm = countryData.constructionCosts.improved
  }
  
  const adjustedCostPerSqm = config.constructionCostPerSqm || (baseCostPerSqm * styleMultiplier)
  const baseArea = SIZE_BASE_AREAS[config.sizePreference] || 100
  const totalBuildingArea = baseArea
  
  const masterbedroom = totalBuildingArea * 0.15
  const bedroom2 = totalBuildingArea * 0.12
  const bedroom3 = totalBuildingArea * 0.12
  const livingArea = totalBuildingArea * 0.25
  const kitchenArea = totalBuildingArea * 0.12
  const bathrooms = totalBuildingArea * 0.08
  const hallways = totalBuildingArea * 0.16
  
  let bedrooms = 2
  if (config.sizePreference === "small") bedrooms = 1
  else if (config.sizePreference === "spacious") bedrooms = 3
  
  const buildingCost = Math.round(totalBuildingArea * adjustedCostPerSqm)
  const laborCostPercentage = countryData.laborCostPercentage / 100
  const laborCost = Math.round(buildingCost * laborCostPercentage)
  
  // Scale infrastructure cost based on building size, features, and land size
  const baseInfrastructureCost = 
    countryData.infrastructure.waterPerConnection +
    countryData.infrastructure.sewerPerConnection +
    (countryData.infrastructure.roadsPerMeter * Math.min(config.landSize / 100, 200))
  
  // Add feature-based infrastructure upgrades
  let featureInfrastructureCost = 0
  if (config.features.solarPanels) featureInfrastructureCost += 3000 // Electrical grid upgrades
  if (config.features.smartHome) featureInfrastructureCost += 2000  // Data/network infrastructure
  if (config.features.airConditioning) featureInfrastructureCost += 2500 // Electrical capacity
  if (config.features.swimmingPool) featureInfrastructureCost += 5000 // Water treatment, drainage
  if (config.features.garage) featureInfrastructureCost += 1500 // Additional paving/utilities
  if (config.features.garden) featureInfrastructureCost += 1000 // Irrigation/drainage systems
  
  // Scale with building area and complexity (luxury costs more for infrastructure)
  const areaScaleFactor = totalBuildingArea / 100 // Base is 100m²
  const styleInfrastructureMultiplier = STYLE_MULTIPLIERS[config.style] || 1.0
  
  const infrastructureCost = config.infrastructureCosts 
    ? (config.infrastructureCosts.water + config.infrastructureCosts.sewer + config.infrastructureCosts.roads + config.infrastructureCosts.electricity)
    : Math.round(
        (baseInfrastructureCost + featureInfrastructureCost) * areaScaleFactor * (styleInfrastructureMultiplier * 0.5 + 0.5)
      )
  
  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureName, _]) => ({
      feature: featureName,
      cost: FEATURE_COSTS[featureName] || 0,
      description: getFeatureDescription(featureName),
    }))
  
  const featuresCost = enabledFeatures.reduce((sum, f) => sum + f.cost, 0)
  const totalCost = buildingCost + laborCost + infrastructureCost + featuresCost
  const annualMaintenanceCost = Math.round(buildingCost * 0.025)
  
  const estimatedPopulation = (config.bedrooms || 2) * 1.5 // Rough estimate for home population
  const dailyWaterDemand = estimatedPopulation * countryData.utilities.waterLitersPerPerson
  const electricityDemand = estimatedPopulation * countryData.utilities.electricityKwhPerPerson
  const wasteGeneration = estimatedPopulation * countryData.utilities.wasteKgPerPerson
  
  const monthlyWaterCost = (dailyWaterDemand * 30 * 0.003)
  const monthlyElectricityCost = (totalBuildingArea * 2)
  const monthlyUtilitiesCost = Math.round(monthlyWaterCost + monthlyElectricityCost)
  
  const propertyTaxAnnual = Math.round(totalCost * 0.007)
  const insuranceAnnual = Math.round(totalCost * 0.004)
  const estimatedTimelineMonths = Math.ceil(totalBuildingArea / 20)
  
  const remainingBudget = config.budget - totalCost
  const percentageUsed = (totalCost / config.budget) * 100
  
  let budgetStatus: "under" | "within" | "over" = "within"
  if (percentageUsed > 100) budgetStatus = "over"
  else if (percentageUsed < 90) budgetStatus = "under"
  
  return {
    totalBuildingArea,
    bedrooms,
    bathrooms: 2,
    livingArea,
    kitchenArea,
    buildingCost,
    costPerSqm: adjustedCostPerSqm,
    infrastructureCost,
    featuresCost,
    laborCost,
    totalCost,
    annualMaintenanceCost,
    monthlyUtilitiesCost,
    propertyTaxAnnual,
    insuranceAnnual,
    estimatedTimelineMonths,
    roomBreakdown: [
      { room: "Master Bedroom", area: masterbedroom, description: "Primary master suite" },
      { room: "Bedroom 2", area: bedroom2, description: "Secondary bedroom" },
      { room: "Bedroom 3", area: bedroom3, description: "Tertiary bedroom" },
      { room: "Living Room", area: livingArea, description: "Main living and entertainment space" },
      { room: "Kitchen", area: kitchenArea, description: "Cooking and dining area" },
      { room: "Bathrooms", area: bathrooms, description: "Two full bathrooms" },
      { room: "Hallways", area: hallways, description: "Circulation spaces" },
    ],
    includedFeatures: enabledFeatures,
    remainingBudget,
    percentageUsed,
    budgetStatus,
    dailyWaterDemand,
    electricityDemand,
    wasteGeneration,
    infrastructureStatus: "ok", // Default for single home
  }
}

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    solarPanels: "Solar photovoltaic system for renewable energy",
    smartHome: "IoT smart home automation system",
    airConditioning: "Central air conditioning system",
    swimmingPool: "Residential swimming pool with finishing",
    garage: "Attached garage for 2 vehicles",
    garden: "Landscaped garden and outdoor space",
  }
  return descriptions[feature] || feature
}

// ========== FEATURE 1: INVESTMENT RETURNS & FINANCIAL PROJECTIONS ==========

/**
 * Calculate comprehensive investment returns and financial metrics
 */
export function calculateInvestmentReturns(
  scenario: InvestmentScenario,
  scenarioResults: ScenarioResults,
): InvestmentResults {
  const {
    financing,
    unitPricing,
    occupancyRate,
    rentalModel,
    rentalMonthlyRate,
    constructionCost,
    softCostsPercentage,
    marketingBudget,
  } = scenario

  // Calculate total project cost with soft costs
  const softCosts = constructionCost * (softCostsPercentage / 100)
  const totalProjectCost = constructionCost + softCosts + marketingBudget

  // Calculate revenue
  let totalRevenue = 0
  
  if (rentalModel === "sale" || rentalModel === "mixed") {
    if (scenarioResults.totalUnits) {
      const avgPrice = (unitPricing.oneBedroom + unitPricing.twoBedroom + unitPricing.threeBedroom) / 3
      totalRevenue += scenarioResults.totalUnits * avgPrice * (occupancyRate / 100)
    }
  }

  if (rentalModel === "rental" || rentalModel === "mixed") {
    if (rentalMonthlyRate) {
      const rentalRevenue = scenarioResults.totalUnits * rentalMonthlyRate * 12 * (occupancyRate / 100)
      totalRevenue = rentalModel === "mixed" ? totalRevenue / 2 + rentalRevenue / 2 : rentalRevenue
    }
  }

  const revenuePerUnit = scenarioResults.totalUnits > 0 ? totalRevenue / scenarioResults.totalUnits : 0

  // Calculate financing costs
  let monthlyLoanPayment = 0
  let interestExpense = 0
  let totalLoanCost = 0

  if (financing.loanAmount > 0) {
    const monthlyRate = financing.interestRate / 100 / 12
    const numberOfPayments = financing.loanTermMonths
    monthlyLoanPayment =
      (financing.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    totalLoanCost = monthlyLoanPayment * numberOfPayments
    interestExpense = totalLoanCost - financing.loanAmount
  }

  // Calculate expenses
  const propertyManagementPercentage = scenario.propertyManagementPercentage || 10 // Nairobi standard is often 10%
  const occupancyFactor = occupancyRate / 100
  
  const propertyManagementExpense =
    (rentalModel === "rental" || rentalModel === "mixed")
      ? totalRevenue * (propertyManagementPercentage / 100)
      : 0
      
  // Maintenance: 1.5% - 2.5% of construction cost annually
  const maintenanceExpense = constructionCost * 0.02
  // Insurance: ~0.15% - 0.25% of property value (using construction cost as proxy)
  const insuranceExpense = constructionCost * 0.002
  
  const totalOperatingExpenses = propertyManagementExpense + maintenanceExpense + insuranceExpense
  const totalExpenses = interestExpense + totalOperatingExpenses
  // Calculate subsidy requirements
  const subsidyPercentage = scenario.subsidyPercentage || 0
  const subsidyPerUnit = scenario.subsidyPerUnit || 0
  const affordablePercentage = subsidyPercentage / 100
  const affordableUnits = Math.round(scenarioResults.totalUnits * affordablePercentage)
  const subsidyTotal = affordableUnits * subsidyPerUnit
  const subsidyRequired = subsidyTotal > (totalRevenue * 0.1) ? subsidyTotal : 0

  // Calculate affordability gap
  const targetAffordablePrice = revenuePerUnit * 0.6
  const marketPrice = revenuePerUnit
  const minimumAffordablePrice = Math.max(targetAffordablePrice, marketPrice * 0.4)
  const affordabilityGap = Math.max(0, minimumAffordablePrice - (marketPrice * 0.5))

  // Calculate profitability
  const netProfit = totalRevenue - totalProjectCost - totalExpenses - subsidyRequired
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  const grossMargin = totalRevenue - totalProjectCost
  const grossMarginPercentage = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0

  // Calculate returns
  const roi = (netProfit / totalProjectCost) * 100
  const irr = calculateSimplifiedIRR(totalProjectCost, netProfit, 30)
  const paybackMonths = calculatePaybackMonths(totalProjectCost, (netProfit / (scenario.constructionMonths + 120))) // Over construction + 10 years
  const breakEvenMonths = paybackMonths

  // Sensitivity analysis
  const sensitivity = {
    occupancyChange: {
      occupancy85Percent: (totalRevenue * (85 / occupancyRate)) - totalProjectCost - totalExpenses,
      occupancy100Percent: (totalRevenue * (100 / occupancyRate)) - totalProjectCost - totalExpenses,
    },
    constructionCostChange: {
      decrease10Percent: netProfit + (totalProjectCost * 0.1),
      increase10Percent: netProfit - (totalProjectCost * 0.1),
    },
    priceChange: {
      increase10Percent: (totalRevenue * 1.1) - totalProjectCost - totalExpenses,
      decrease10Percent: (totalRevenue * 0.9) - totalProjectCost - totalExpenses,
    },
  }

  return {
    totalRevenue,
    totalProjectCost,
    totalExpenses,
    totalLoanCost,
    interestExpense,
    netProfit,
    profitMargin,
    grossMargin,
    grossMarginPercentage,
    revenuePerUnit,
    roi,
    irr,
    paybackMonths,
    breakEvenMonths,
    monthlyLoanPayment,
    subsidyRequired,
    affordabilityGap,
    minimumAffordablePrice,
    marketPrice,
    projectTimeline: generateDefaultPhases(scenario as any, scenario.constructionMonths),
    sensitivity,
  }
}

function calculateSimplifiedIRR(initialInvestment: number, annualProfit: number, years: number): number {
  if (annualProfit <= 0) return 0
  const totalReturn = annualProfit * years
  const roi = totalReturn / initialInvestment
  return Math.pow(1 + roi, 1 / years) * 100 - 100
}

function calculatePaybackMonths(investment: number, monthlyProfit: number): number {
  if (monthlyProfit <= 0) return 0
  return Math.ceil(investment / monthlyProfit)
}

// ========== FEATURE 2: CONSTRUCTION TIMELINE & PHASING ==========

/**
 * Generate default construction phases for a project
 */
export function generateDefaultPhases(
  scenario: Scenario | any,
  constructionMonths: number = 24,
): ProjectTimeline {
  const phases: ConstructionPhase[] = [
    {
      id: "phase-1",
      name: "Planning & Permitting",
      description: "Site analysis, design, and regulatory approvals",
      durationMonths: Math.ceil(constructionMonths * 0.1),
      startMonth: 1,
      endMonth: Math.ceil(constructionMonths * 0.1),
      costPercentage: 5,
      estimatedCost: 50000,
    },
    {
      id: "phase-2",
      name: "Site Preparation",
      description: "Excavation, grading, and infrastructure setup",
      durationMonths: Math.ceil(constructionMonths * 0.15),
      startMonth: Math.ceil(constructionMonths * 0.1) + 1,
      endMonth: Math.ceil(constructionMonths * 0.25),
      costPercentage: 10,
      estimatedCost: 100000,
    },
    {
      id: "phase-3",
      name: "Foundation & Structure",
      description: "Foundation, structural frame, and major systems",
      durationMonths: Math.ceil(constructionMonths * 0.35),
      startMonth: Math.ceil(constructionMonths * 0.25) + 1,
      endMonth: Math.ceil(constructionMonths * 0.6),
      costPercentage: 40,
      estimatedCost: 300000,
    },
    {
      id: "phase-4",
      name: "Finishing & Systems",
      description: "Interior finishing, MEP systems, and utilities",
      durationMonths: Math.ceil(constructionMonths * 0.25),
      startMonth: Math.ceil(constructionMonths * 0.6) + 1,
      endMonth: Math.ceil(constructionMonths * 0.85),
      costPercentage: 30,
      estimatedCost: 200000,
    },
    {
      id: "phase-5",
      name: "Landscaping & Closeout",
      description: "Landscaping, final inspections, and handover",
      durationMonths: Math.ceil(constructionMonths * 0.15),
      startMonth: Math.ceil(constructionMonths * 0.85) + 1,
      endMonth: constructionMonths,
      costPercentage: 15,
      estimatedCost: 80000,
    },
  ]

  const startDate = new Date()
  const completionDate = new Date(startDate.getTime() + constructionMonths * 30 * 24 * 60 * 60 * 1000)

  return {
    phases,
    totalMonths: constructionMonths,
    criticalPath: ["phase-1", "phase-2", "phase-3", "phase-4", "phase-5"],
    startDate: startDate.toISOString(),
    estimatedCompletion: completionDate.toISOString(),
  }
}

// ========== FEATURE 3: REGULATORY COMPLIANCE ==========

/**
 * Get compliance rules for a specific location
 */
export function getComplianceRulesForLocation(country: string, city?: string): ComplianceRule[] {
  return [
    {
      id: "rule-1",
      code: "DENSITY-001",
      name: "Density Limitation",
      category: "zoning" as const,
      description: "Maximum residential density",
      requirement: "Must not exceed 400 units/hectare",
      maxAllowedDensity: 400,
      impact: "high",
    },
    {
      id: "rule-2",
      code: "AFFORD-001",
      name: "Affordability Requirement",
      category: "affordability" as const,
      description: "Affordable housing percentage",
      requirement: `Minimum 30% affordable units in ${country}`,
      affordabilityRequirement: 30,
      impact: "high",
    },
    {
      id: "rule-3",
      code: "BUILD-001",
      name: "Unit Size Standard",
      category: "building" as const,
      description: "Minimum unit size",
      requirement: "Studio minimum 30m², 1BR minimum 45m²",
      minUnitSize: 45,
      impact: "medium",
    },
    {
      id: "rule-4",
      code: "ENV-001",
      name: "Green Space",
      category: "environmental" as const,
      description: "Open space requirement",
      requirement: "Minimum 20% open space for community use",
      impact: "medium",
    },
    {
      id: "rule-5",
      code: "ACC-001",
      name: "Accessibility",
      category: "accessibility" as const,
      description: "Parking space requirements",
      requirement: "1 space per 2 units minimum",
      accessibilityRequirement: 5,
      impact: "high",
    },
  ]
}

/**
 * Evaluate scenario compliance against rules
 */
export function evaluateCompliance(
  scenario: any,
  scenarioResults: ScenarioResults,
  rules: ComplianceRule[],
): RegulatoryCompliance {
  const complianceStatus = rules.map((rule) => {
    let compliant = true
    let notes = ""
    let suggestedAdjustment: string | undefined
    let remedialCost: number | undefined

    // Check density
    const density = (scenarioResults.totalUnits / (scenarioResults.builtUpArea / 10000)) * 10000
    if (rule.maxAllowedDensity && density > rule.maxAllowedDensity) {
      compliant = false
      notes = `Density (${Math.round(density)} units/ha) exceeds limit of ${rule.maxAllowedDensity}`
      suggestedAdjustment = "Reduce unit count or increase land area"
      remedialCost = 50000
    }

    // Check unit size
    if (rule.minUnitSize && scenario.unitSize && scenario.unitSize < rule.minUnitSize) {
      compliant = false
      notes = `Unit size (${scenario.unitSize}m²) below minimum of ${rule.minUnitSize}m²`
      suggestedAdjustment = `Increase unit size to ${rule.minUnitSize}m² minimum`
      remedialCost = rule.costImpact
    }

    // Check affordability
    if (rule.affordabilityRequirement) {
      compliant = true
      notes = `Meets affordability requirements for ${rule.category}`
    }

    if (!compliant && !remedialCost) {
      remedialCost = rule.costImpact || 5000
    }

    return {
      ruleId: rule.id,
      compliant,
      notes,
      suggestedAdjustment,
      remedialCost,
    }
  })

  const compliantRules = complianceStatus.filter((s) => s.compliant).length
  const nonCompliantRules = complianceStatus.length - compliantRules
  const compliancePercentage = (compliantRules / complianceStatus.length) * 100
  const totalRemediateCost = complianceStatus.reduce((sum, s) => sum + (s.remedialCost || 0), 0)

  const recommendations = complianceStatus
    .filter((s) => !s.compliant)
    .map((s, i) => ({
      priority: i === 0 ? ("critical" as const) : ("high" as const),
      action: s.suggestedAdjustment || "Review and adjust configuration",
      estimatedCost: s.remedialCost,
      timeline: "3-6 months",
    }))

  return {
    id: `compliance-${Date.now()}`,
    projectId: "",
    scenarioId: "",
    country: "",
    complianceStatus,
    totalRulesApplied: rules.length,
    compliantRules,
    nonCompliantRules,
    compliancePercentage,
    totalRemediateCost,
    applicableRules: rules,
    recommendations,
    certifications: [
      {
        name: "ISO 50001 (Energy Management)",
        achievable: true,
        cost: 10000,
      },
      {
        name: "Sustainable Building Certification",
        achievable: true,
        cost: 15000,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
