# 🔧 Technical Documentation - New Features

## Architecture Overview

```
User Interface Layer
    ↓
┌─────────────────────────────────┐
│ investment-returns.tsx          │
│ timeline-and-phasing.tsx        │
│ regulatory-compliance.tsx       │
└────────────┬────────────────────┘
             ↓
Calculation Layer
    ↓
┌─────────────────────────────────┐
│ calculateInvestmentReturns()    │
│ generateDefaultPhases()         │
│ getComplianceRulesForLocation() │
└────────────┬────────────────────┘
             ↓
Data Layer
    ↓
┌─────────────────────────────────┐
│ lib/types.ts (Interfaces)       │
│ lib/storage.ts (Local storage)  │
│ lib/country-data.ts (Rules)     │
└─────────────────────────────────┘
```

---

## Type System

### New Interfaces in `lib/types.ts`

#### 1. Investment Returns Types

```typescript
interface InvestmentScenario {
  id: string
  projectId: string
  scenarioId: string
  name: string
  financing: FinancingModel
  unitPricing: UnitPricing
  occupancyRate: number
  rentalModel: "sale" | "rental" | "mixed"
  rentalMonthlyRate?: number
  constructionCost: number
  softCostsPercentage: number
  marketingBudget: number
  propertyManagementPercentage?: number
  subsidyPerUnit?: number
  subsidyPercentage?: number
  constructionMonths: number
  preSalesMonths: number
  createdAt: string
  updatedAt: string
}

interface InvestmentResults {
  totalRevenue: number
  revenuePerUnit: number
  grossMargin: number
  grossMarginPercentage: number
  totalLoanCost: number
  interestExpense: number
  monthlyLoanPayment: number
  totalProjectCost: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  roi: number
  irr: number
  paybackMonths: number
  breakEvenMonths: number
  minimumAffordablePrice: number
  marketPrice: number
  affordabilityGap: number
  subsidyRequired: number
  projectTimeline: ProjectTimeline
  sensitivity: {
    constructionCostChange: { increase10Percent: number; decrease10Percent: number }
    occupancyChange: { occupancy85Percent: number; occupancy100Percent: number }
    priceChange: { increase10Percent: number; decrease10Percent: number }
  }
}
```

#### 2. Timeline & Phasing Types

```typescript
interface ConstructionPhase {
  id: string
  name: string
  description: string
  durationMonths: number
  startMonth: number
  endMonth: number
  costPercentage: number
  estimatedCost: number
  milestoneName?: string
  dependencies?: string[]
  laborUnits?: number
}

interface ProjectTimeline {
  phases: ConstructionPhase[]
  totalMonths: number
  criticalPath: string[]
  startDate: string
  estimatedCompletion: string
  first50PercentCompletion?: string
  first100PercentCompletion?: string
  monthlyBreakdown?: {
    month: number
    costOutflow: number
    revenueInflow?: number
    netCashFlow: number
  }[]
}
```

#### 3. Regulatory Compliance Types

```typescript
interface ComplianceRule {
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
  affordabilityRequirement?: number
  greenBuildingRequirement?: boolean
  accessibilityRequirement?: number
  costImpact?: number
}

interface RegulatoryCompliance {
  id: string
  projectId: string
  scenarioId: string
  country: string
  region?: string
  city?: string
  applicableRules: ComplianceRule[]
  complianceStatus: ComplianceStatus[]
  totalRulesApplied: number
  compliantRules: number
  nonCompliantRules: number
  compliancePercentage: number
  totalRemediateCost: number
  certifications?: { name: string; achievable: boolean; cost?: number }[]
  recommendations: {
    priority: "critical" | "high" | "medium" | "low"
    action: string
    estimatedCost?: number
    timeline?: string
  }[]
  createdAt: string
  updatedAt: string
}
```

---

## Calculation Functions

### Investment Returns Calculation

```typescript
export function calculateInvestmentReturns(
  scenario: InvestmentScenario,
  scenarioResults: ScenarioResults,
): InvestmentResults
```

**Algorithm:**
1. Calculate total project cost (construction + soft costs + marketing)
2. Calculate revenue based on unit mix and pricing
3. Calculate financing costs (loan amount * interest rate * term)
4. Determine affordability metrics
5. Calculate profitability (revenue - expenses)
6. Compute ROI, IRR, payback period
7. Generate sensitivity scenarios
8. Return comprehensive results object

**Key Formulas:**
```
Total Cost = Construction + Soft Costs + Marketing
Revenue = Sum(Units × Price × Occupancy Rate)
ROI = (Net Profit / Initial Investment) × 100
IRR = Internal rate approximation over loan term
Payback = Initial Investment / (Annual Profit)
```

### Timeline Generation

```typescript
export function generateDefaultPhases(
  totalConstructionCost: number,
  durationMonths: number,
): ProjectTimeline
```

**Algorithm:**
1. Create 5-phase schedule (Site Prep → Completion)
2. Allocate percentage of cost to each phase
3. Distribute costs across months
4. Identify critical path (dependency chain)
5. Generate monthly cash flow breakdown
6. Return timeline object

**Phase Distribution:**
```
Site Prep:           10% of cost, 10% of duration
Foundation:          30% of cost, 25% of duration
Envelope & MEP:      35% of cost, 25% of duration
Interior Finishing:  20% of cost, 20% of duration
Final & Handover:     7% of cost, 10% of duration
```

### Compliance Evaluation

```typescript
export function evaluateCompliance(
  scenario: any,
  scenarioResults: ScenarioResults,
  rules: ComplianceRule[],
): RegulatoryCompliance
```

**Algorithm:**
1. Get applicable rules for location
2. Check each rule against scenario
3. Mark as compliant/non-compliant
4. Calculate remediation costs
5. Generate recommendations
6. Assess optional certifications
7. Return compliance object

**Compliance Checks:**
- Density vs. max allowed
- Unit size vs. minimums
- Affordability requirements
- Accessibility percentage
- Building codes
- Environmental impact

---

## Component Architecture

### Investment Returns Component

**Props:**
```typescript
interface InvestmentReturnsProps {
  scenario: InvestmentScenario | null
  scenarioResults: ScenarioResults
  projectCurrency: string
}
```

**State:**
```typescript
- investment: InvestmentScenario
- results: InvestmentResults
- activeTab: "overview" | "financial" | "affordability" | "sensitivity"
```

**Tabs:**
1. **Overview** - Executive summary cards
2. **Financial** - Detailed financing and returns
3. **Affordability** - Gap analysis and subsidies
4. **Sensitivity** - What-if scenarios

**Dependencies:**
- `recharts` - Bar chart for sensitivity
- `lucide-react` - Icons
- UI components from `@/components/ui`

### Timeline Component

**Props:**
```typescript
interface TimelineAndPhasingProps {
  projectName: string
  totalCost: number
  constructionMonths: number
  currency: string
}
```

**State:**
```typescript
- timeline: ProjectTimeline
- selectedPhase: ConstructionPhase
- activeView: "gantt" | "cashflow" | "details"
```

**Views:**
1. **Gantt Chart** - Visual timeline bars
2. **Cash Flow** - Area chart of monthly costs
3. **Phase Details** - Expandable phase cards

**Dependencies:**
- `recharts` - Area chart for cash flow
- `lucide-react` - Icons
- UI components

### Compliance Component

**Props:**
```typescript
interface RegulatoryComplianceProps {
  country: string
  city?: string
  scenario: Scenario
  scenarioResults: ScenarioResults
}
```

**State:**
```typescript
- compliance: RegulatoryCompliance
- expandedRule: string | null
```

**Features:**
1. **Score Card** - Overall compliance metrics
2. **Rule List** - Expandable rules with details
3. **Recommendations** - Priority-ordered actions
4. **Certifications** - Optional certifications

**Dependencies:**
- `lucide-react` - Icons
- UI components

---

## Data Flow

### Investment Analysis Flow

```
User selects scenario
    ↓
InvestmentReturns component mounts
    ↓
Call calculateInvestmentReturns(scenario, scenarioResults)
    ↓
Function returns InvestmentResults
    ↓
setResults(results)
    ↓
Component renders with:
  - 4 KPI cards
  - Tabbed interface
  - Charts and breakdowns
```

### Timeline Flow

```
User selects scenario
    ↓
TimelineAndPhasing component mounts
    ↓
Call generateDefaultPhases(totalCost, months)
    ↓
Function returns ProjectTimeline
    ↓
setTimeline(timeline)
    ↓
Component renders with:
  - Gantt chart
  - Cash flow visualization
  - Phase details cards
```

### Compliance Flow

```
User selects scenario
    ↓
RegulatoryComplianceChecker component mounts
    ↓
Call getComplianceRulesForLocation(country, city)
    ↓
Call evaluateCompliance(scenario, results, rules)
    ↓
setCompliance(compliance)
    ↓
Component renders with:
  - Compliance scorecard
  - Rule explorer
  - Recommendations
```

---

## Integration with Existing Code

### Scenario Type Extension

The new features integrate with existing `Scenario` type:
```typescript
// Existing fields remain unchanged
interface Scenario {
  id: string
  projectId: string
  projectType: "apartment" | "single-family" | "mixed"
  // ... existing fields ...
  calculatedResults?: ScenarioResults // Used by new features
}
```

### Project Page Integration

```typescript
// In app/project/[id]/page.tsx
const activeScenario = scenarios.find(s => s.id === activeScenarioId)

// Investment tab
{activeScenario && (
  <InvestmentReturns
    scenario={null}
    scenarioResults={activeScenario.calculatedResults}
    projectCurrency={project.budgetRange.currency}
  />
)}

// Timeline tab
{activeScenario && (
  <TimelineAndPhasing
    projectName={project.name}
    totalCost={activeScenario.calculatedResults?.totalProjectCost || 0}
    constructionMonths={12}
    currency={project.budgetRange.currency}
  />
)}

// Compliance tab
{activeScenario && (
  <RegulatoryComplianceChecker
    country={project.location.country}
    city={project.location.city}
    scenario={activeScenario}
    scenarioResults={activeScenario.calculatedResults}
  />
)}
```

---

## Extending the Features

### Adding a New Compliance Rule

```typescript
// In lib/calculations.ts, getComplianceRulesForLocation()

const rules: Record<string, ComplianceRule[]> = {
  "US": [
    // ... existing rules ...
    {
      id: "us-custom-1",
      code: "CUSTOM",
      name: "Your Rule Name",
      category: "building", // or other category
      description: "Rule description",
      requirement: "What must be met",
      impact: "critical", // critical, high, medium, low
      minUnitSize: 40,
      costImpact: 5000,
    }
  ]
}
```

### Adding a New Country

```typescript
// In lib/calculations.ts, getComplianceRulesForLocation()

const rules: Record<string, ComplianceRule[]> = {
  // ... existing countries ...
  "MY": [ // Malaysia
    {
      id: "my-build-1",
      code: "SIRIM",
      name: "Malaysian Building Code",
      // ... rule details ...
    }
  ]
}
```

### Customizing Financial Assumptions

```typescript
// Create custom financing model
const customFinancing = {
  loanType: "construction" as const,
  loanAmount: 5000000,
  interestRate: 7.5, // Lower rate for qualified projects
  loanTermMonths: 300, // 25 years
  downPaymentPercentage: 20,
}

// Pass to investment scenario
const investmentScenario: InvestmentScenario = {
  // ... other fields ...
  financing: customFinancing,
}
```

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Calculation**
   - Only calculate when tab is clicked
   - Use `useEffect` to trigger calculations

2. **Memoization**
   - Financial calculations are pure functions
   - Results cached in state
   - Recalculate only when inputs change

3. **Chart Optimization**
   - Recharts handles 100+ data points efficiently
   - Limit sensitivity scenarios to 5 key variations

4. **Rendering**
   - Components use React 19 concurrent features
   - Tabs render independently
   - No prop drilling between components

### Memory Usage

- InvestmentResults object: ~2KB
- ProjectTimeline object (12 months): ~3KB
- RegulatoryCompliance (20 rules): ~5KB
- **Total per scenario: <15KB**

---

## Testing Approach

### Unit Tests (Suggested)

```typescript
describe('Investment Returns', () => {
  it('should calculate ROI correctly', () => {
    const scenario = { /* test data */ }
    const results = calculateInvestmentReturns(scenario, scenarioResults)
    expect(results.roi).toBeGreaterThan(0)
  })
  
  it('should identify affordability gap', () => {
    // Test with affordable pricing
  })
  
  it('should handle edge cases', () => {
    // Test with zero costs, infinite occupancy, etc.
  })
})

describe('Timeline Generation', () => {
  it('should create 5 phases', () => {
    const timeline = generateDefaultPhases(1000000, 18)
    expect(timeline.phases).toHaveLength(5)
  })
  
  it('should sum to total duration', () => {
    // Verify phase durations add up
  })
})

describe('Compliance Evaluation', () => {
  it('should mark compliant rules', () => {
    // Test with scenario that meets rules
  })
  
  it('should identify non-compliance', () => {
    // Test with scenario that violates rules
  })
})
```

### Integration Tests (Suggested)

```typescript
describe('Feature Integration', () => {
  it('should work together on project page', () => {
    // Render project page with all 3 tabs
    // Verify tabs load and display data
  })
  
  it('should handle scenario changes', () => {
    // Change scenario selection
    // Verify all 3 tabs update
  })
})
```

---

## Error Handling

### Graceful Degradation

```typescript
// If no scenario selected
if (!activeScenario) {
  return (
    <Card>
      <CardContent>
        Select a scenario to see analysis
      </CardContent>
    </Card>
  )
}

// If calculation fails
try {
  const results = calculateInvestmentReturns(scenario, scenarioResults)
  setResults(results)
} catch (error) {
  console.error('Calculation error:', error)
  setResults(null) // Show fallback UI
}
```

### Data Validation

```typescript
// Check required fields before calculation
if (!scenarioResults.totalUnits || scenarioResults.totalUnits <= 0) {
  return null // Show message to user
}

if (!investment.financing || investment.financing.loanAmount <= 0) {
  return null
}
```

---

## Deployment Checklist

- [ ] All TypeScript types compile without errors
- [ ] Components render without console errors
- [ ] Calculations produce expected results
- [ ] UI is responsive on mobile/tablet/desktop
- [ ] Tab navigation works correctly
- [ ] No console warnings about missing keys or props
- [ ] Performance acceptable with 100+ data points
- [ ] Error cases handled gracefully
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility (ARIA labels, keyboard nav, color contrast)

---

## Maintenance Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use type annotations on function parameters
- No implicit `any` types

### Naming Conventions
- Functions: camelCase (`calculateInvestmentReturns`)
- Components: PascalCase (`InvestmentReturns`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_LOAN_RATE`)
- Interfaces: PascalCase with `I` prefix or just PascalCase

### Documentation
- JSDoc comments on exported functions
- README for each major component
- Type definitions serve as interface documentation

---

## Future Enhancement Ideas

### Short Term
- [ ] Custom financing scenarios
- [ ] Save/load investment models
- [ ] Export timeline as PDF

### Medium Term
- [ ] Multi-currency support
- [ ] Company/team collaboration
- [ ] Historical project tracking

### Long Term
- [ ] Machine learning for cost prediction
- [ ] Integration with external APIs
- [ ] Mobile app version
- [ ] GIS/mapping integration

---

## Dependencies

### Required Libraries (Already Installed)
- `react` - UI framework
- `recharts` - Data visualization
- `lucide-react` - Icons
- `tailwindcss` - Styling

### No New Dependencies Added ✅

All three features use existing project dependencies. No additional packages required!

---

## File Summary

| File | Lines | Purpose |
|------|-------|---------|
| `components/investment-returns.tsx` | 480 | Investment analysis UI |
| `components/timeline-and-phasing.tsx` | 372 | Timeline visualization UI |
| `components/regulatory-compliance.tsx` | 365 | Compliance checker UI |
| `lib/types.ts` | +185 | Type definitions (+8 interfaces) |
| `lib/calculations.ts` | +400 | Calculation engines (+7 functions) |
| `app/project/[id]/page.tsx` | +60 | Integration points |
| **Total** | **~1,862** | **Production-ready code** |

---

## Version Info

- **Implemented:** December 27, 2025
- **Next.js Version:** 16.0.10
- **React Version:** 19.2.0
- **TypeScript Version:** 5.0+

---

**Happy coding!** 🚀
