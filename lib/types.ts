// Core TypeScript interfaces for the application

export interface User {
  id: string
  email: string
  name: string
  organization?: string
  role?: string
  phone?: string
  country?: string
  createdAt: string
}

export interface Project {
  id: string
  userId: string
  name: string
  projectType: "apartment" | "single-family" | "mixed"
  location: {
    city: string
    country: string
    countryCode?: string  // ISO country code for data lookups
  }
  landSize: number // in square meters
  landSizeUnit: "sqm" | "acres"
  targetIncomeGroup: "low" | "lower-middle" | "middle" | "mixed"
  budgetRange: {
    min: number
    max: number
    currency: string
  }
  // Project-level custom assumptions (override country defaults)
  customAssumptions?: {
    personsPerUnit?: {
      oneBedroom?: number
      twoBedroom?: number
      threeBedroom?: number
    }
    densityThresholds?: {
      low: number      // units per hectare upper bound
      medium: number   // units per hectare upper bound
      high: number     // units per hectare upper bound
      veryHigh: number // units per hectare upper bound
    }
    infrastructureWarningLevels?: {
      waterDemandM3: number      // Daily water in m³
      populationCount: number     // Population threshold
      warningWaterDemandM3: number
      warningPopulation: number
    }
    roomSizes?: {
      masterBedroom: number    // m²
      bedroom: number          // m²
      livingRoom: number       // m²
      kitchen: number          // m²
      bathroom: number         // m²
      hallway: number          // m²
    }
  }
  createdAt: string
  updatedAt: string
}

export interface Scenario {
  id: string
  projectId: string
  projectType: "apartment" | "single-family" | "mixed" // Link to project type
  name: string

  // Apartment-specific parameters
  unitSize?: number // sqm per unit
  unitsPerFloor?: number
  numberOfFloors?: number
  unitMix?: {
    oneBedroom: number // percentage
    twoBedroom: number // percentage
    threeBedroom: number // percentage
  }
  sharedSpacePercentage?: number // percentage for corridors, stairs, lifts

  // Single-family specific parameters
  numberOfUnits?: number // Total single-family homes
  lotSize?: number // sqm per lot
  houseSize?: number // sqm of built-up area per house

  // Mixed-use parameters (combines both apartment and single-family)
  apartmentUnits?: number
  singleFamilyUnits?: number
  apartmentFloors?: number
  apartmentUnitsPerFloor?: number

  // Cost parameters
  constructionCostPerSqm: number
  softCostsPercentage?: number     // % of (construction + infra) — default 15
  contingencyPercentage?: number   // % of (construction + infra) — default 10
  infrastructureCostPerUnit?: number // per-unit infra cost override — default from country data
  infrastructureCosts: {
    water: number
    sewer: number
    roads: number
    electricity: number
  }
  finishLevel: "basic" | "standard" | "improved"

  // Scenario-level custom assumptions (override project/country defaults)
  customAssumptions?: {
    personsPerUnit?: {
      oneBedroom?: number
      twoBedroom?: number
      threeBedroom?: number
    }
    singleFamilyPersonsPerUnit?: number
  }
  
  // Architecture Design Data
  architecture?: {
    rooms: any[]
  }

  // Calculated results (cached)
  calculatedResults?: ScenarioResults

  createdAt: string
  updatedAt: string
}

export interface ScenarioResults {
  totalUnits: number
  estimatedPopulation: number
  builtUpArea: number
  landCoveragePercentage: number
  densityClassification: "low" | "medium" | "high" | "very-high"

  // Cost results
  totalProjectCost: number
  constructionCost: number
  infrastructureCost: number
  costPerUnit: number
  costPerPerson: number
  budgetStatus: "under" | "within" | "over"

  // Infrastructure impact
  dailyWaterDemand: number // liters
  electricityDemand: number // kWh per day
  wasteGeneration: number // kg per day
  infrastructureStatus: "ok" | "warning" | "exceeds"

  // Statutory Fees & Taxes
  statutoryFees?: {
    stampDuty: number
    nemaFee: number
    ncaFee: number
    vatAmount: number
    totalFees: number
  }
}

export interface DemandForecast {
  projectId: string
  currentPopulation: number
  annualGrowthRate: number // percentage
  timeHorizon: 5 | 10 | 20 // years

  // Calculated projections
  projections?: {
    year: number
    population: number
    housingDemand: number
    surplusShortfall: number
  }[]
}

export interface CostAssumptions {
  country: string

  // Construction costs (per sqm)
  constructionCosts: {
    basic: number
    standard: number
    improved: number
  }

  // Infrastructure unit costs
  waterPerConnection: number
  sewerPerConnection: number
  roadsPerMeter: number

  // Occupancy assumptions
  personsPerUnit: {
    oneBedroom: number
    twoBedroom: number
    threeBedroom: number
  }

  // Single-family occupancy
  singleFamilyPersonsPerUnit: number

  // Infrastructure consumption per person per day
  waterLitersPerPerson: number
  electricityKwhPerPerson: number
  wasteKgPerPerson: number

  // Density thresholds (units per hectare)
  densityThresholds: {
    low: number      // upper bound for low density
    medium: number   // upper bound for medium density
    high: number     // upper bound for high density
    veryHigh: number // everything above this is very-high
  }

  // Infrastructure warning thresholds
  infrastructureWarningLevels: {
    waterDemandExceeds: number       // m³ per day (exceeds threshold)
    waterDemandWarning: number       // m³ per day (warning threshold)
    populationExceeds: number        // population count (exceeds)
    populationWarning: number        // population count (warning)
  }

  // Room sizes for layout visualization (m²)
  roomSizes: {
    masterBedroom: number
    bedroom: number
    livingRoom: number
    kitchen: number
    bathroom: number
    hallway: number
  }
}

// Home Configurator Types - for individual homeowners
export interface HomeBuilderConfig {
  id: string
  userId: string
  country: string
  countryCode: string
  landSize: number // in square meters
  grossArea?: number // total built area in m²
  netArea?: number // usable indoor area in m²
  storeys?: number
  budget: number // total budget in USD
  style: "basic" | "standard" | "luxury" | "modern" | "traditional"
  sizePreference: "small" | "medium" | "large" | "spacious"
  constructionCostPerSqm?: number
  infrastructureCosts?: {
    water: number
    sewer: number
    roads: number
    electricity: number
  }
  finishLevel?: "basic" | "standard" | "improved"
  bathrooms?: number
  financing?: {
    mode: "cash" | "mortgage" | "mixed"
    downPaymentPercent: number
    annualInterestRate: number
    loanTermYears: number
  }
  landServiced?: boolean
  timelineMonths?: number
  siteConditions?: {
    slope: "flat" | "gentle" | "steep"
    soilType: "stable" | "mixed" | "weak"
    floodRisk: "low" | "medium" | "high"
    seismicZone: "low" | "medium" | "high"
  }
  household?: {
    adults: number
    children: number
    remoteWorkers: number
    vehicles: number
  }
  utilitiesProfile?: {
    waterReliability: "high" | "medium" | "low"
    gridReliability: "high" | "medium" | "low"
  }
  compliance?: {
    accessibilityRequired: boolean
    parkingSpaces: number
  }
  features: {
    solarPanels: boolean
    waterStorage: boolean
    smartHome: boolean
    airConditioning: boolean
    swimmingPool: boolean
    garage: boolean
    garden: boolean
  }
  bedrooms: number
  architecture?: {
    rooms: any[]
  }
  createdAt: string
  updatedAt: string
}

export interface HomeSpecification {
  totalBuildingArea: number // m²
  bedrooms: number
  bathrooms: number
  livingArea: number // m²
  kitchenArea: number // m²
  
  // Cost breakdown
  buildingCost: number // total construction cost
  costPerSqm: number
  infrastructureCost: number
  featuresCost: number // additional features
  laborCost: number
  totalCost: number
  
  // Maintenance and operations
  annualMaintenanceCost: number
  monthlyUtilitiesCost: number
  propertyTaxAnnual: number
  insuranceAnnual: number
  
  // Timeline
  estimatedTimelineMonths: number
  
  // Infrastructure impact
  dailyWaterDemand: number // liters
  electricityDemand: number // kWh per day
  wasteGeneration: number // kg per day
  infrastructureStatus: "ok" | "warning" | "exceeds"
  
  // Room breakdown
  roomBreakdown: {
    room: string
    area: number // m²
    description: string
  }[]
  
  // Features included
  includedFeatures: {
    feature: string
    cost: number
    description: string
  }[]
  
  // Budget analysis
  remainingBudget: number
  percentageUsed: number
  budgetStatus: "under" | "within" | "over"
}

export interface HomeBuilderResult {
  config: HomeBuilderConfig
  specification: HomeSpecification
  visualization: {
    lotSize: number
    houseSize: number
    coverage: number // percentage of lot
  }
}

// ============ FEATURE 1: INVESTMENT RETURNS & FINANCIAL PROJECTIONS ============

export interface FinancingModel {
  loanType: "construction" | "mortgage" | "mixed" | "none"
  loanAmount: number
  interestRate: number // annual percentage
  loanTermMonths: number
  downPaymentPercentage: number
}

export interface UnitPricing {
  oneBedroom: number
  twoBedroom: number
  threeBedroom: number
  singleFamily?: number
}

export interface InvestmentScenario {
  id: string
  projectId: string
  scenarioId: string
  name: string
  
  // Financing
  financing: FinancingModel
  
  // Revenue
  unitPricing: UnitPricing
  occupancyRate: number // percentage (e.g., 95)
  rentalModel: "sale" | "rental" | "mixed"
  rentalMonthlyRate?: number // if rental model
  
  // Costs
  constructionCost: number
  softCostsPercentage: number // 10-15% (permits, consulting, etc.)
  marketingBudget: number
  propertyManagementPercentage?: number // percentage of rental income
  
  // Subsidy
  subsidyPerUnit?: number
  subsidyPercentage?: number // percentage of total project cost
  
  // Timeline
  constructionMonths: number
  preSalesMonths: number
  
  createdAt: string
  updatedAt: string
}

export interface InvestmentResults {
  // Revenue Analysis
  totalRevenue: number
  revenuePerUnit: number
  grossMargin: number
  grossMarginPercentage: number
  
  // Financing Impact
  totalLoanCost: number
  interestExpense: number
  monthlyLoanPayment: number
  
  // Financial Summary
  totalProjectCost: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  
  // Return Metrics
  roi: number // return on investment percentage
  irr: number // internal rate of return
  paybackMonths: number
  breakEvenMonths: number
  
  // Affordability Impact
  minimumAffordablePrice: number
  marketPrice: number
  affordabilityGap: number
  subsidyRequired: number
  
  // Timing
  projectTimeline: ProjectTimeline
  
  // Sensitivity Analysis
  sensitivity: {
    constructionCostChange: {
      increase10Percent: number
      decrease10Percent: number
    }
    occupancyChange: {
      occupancy85Percent: number
      occupancy100Percent: number
    }
    priceChange: {
      increase10Percent: number
      decrease10Percent: number
    }
  }
}

// ============ FEATURE 2: TIMELINE & PHASING ============

export interface ConstructionPhase {
  id: string
  name: string
  description: string
  durationMonths: number
  startMonth: number
  endMonth: number
  costPercentage: number // percentage of total construction cost
  estimatedCost: number
  milestoneName?: string
  dependencies?: string[] // phase IDs this phase depends on
  laborUnits?: number // number of workers
}

export interface ProjectTimeline {
  phases: ConstructionPhase[]
  totalMonths: number
  criticalPath: string[] // phase IDs on critical path
  
  // Key milestones
  startDate: string // ISO date
  estimatedCompletion: string // ISO date
  first50PercentCompletion?: string
  first100PercentCompletion?: string
  
  // Cash flow
  monthlyBreakdown?: {
    month: number
    costOutflow: number
    revenueInflow?: number
    netCashFlow: number
  }[]
}

export interface ProjectPhasing {
  id: string
  projectId: string
  scenarioId: string
  name: string
  
  // Phases configuration
  phases: ConstructionPhase[]
  
  // Pre-construction
  permitMonths: number
  designMonths: number
  fundingMonths: number
  
  // Post-construction
  handoverMonths: number
  
  // Key dates
  projectStartDate: string // ISO date
  
  createdAt: string
  updatedAt: string
}

// ============ FEATURE 3: REGULATORY COMPLIANCE ============

export interface ComplianceRule {
  id: string
  code: string
  name: string
  category: "zoning" | "building" | "accessibility" | "environmental" | "affordability" | "sustainability"
  description: string
  requirement: string
  impact: "critical" | "high" | "medium" | "low"
  minAllowedDensity?: number
  maxAllowedDensity?: number
  minUnitSize?: number
  maxUnitSize?: number
  affordabilityRequirement?: number // percentage
  greenBuildingRequirement?: boolean
  accessibilityRequirement?: number // percentage of units
  costImpact?: number // estimated cost to comply
}

export interface ComplianceStatus {
  ruleId: string
  compliant: boolean
  notes: string
  suggestedAdjustment?: string
  remedialCost?: number
}

export interface RegulatoryCompliance {
  id: string
  projectId: string
  scenarioId: string
  country: string
  region?: string
  city?: string
  
  // Applicable rules
  applicableRules: ComplianceRule[]
  
  // Compliance checks
  complianceStatus: ComplianceStatus[]
  
  // Summary
  totalRulesApplied: number
  compliantRules: number
  nonCompliantRules: number
  compliancePercentage: number
  
  // Cost impact
  totalRemediateCost: number
  
  // Certifications
  certifications?: {
    name: string
    achievable: boolean
    cost?: number
  }[]
  
  // Recommendations
  recommendations: {
    priority: "critical" | "high" | "medium" | "low"
    action: string
    estimatedCost?: number
    timeline?: string
  }[]
  
  createdAt: string
  updatedAt: string
}
