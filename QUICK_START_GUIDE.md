# 🚀 Quick Start Guide - New Features

## What You're Getting

Three powerful new analytical modules integrated into your Affordable Housing Planning Tool:

| Feature | Tab Icon | What It Does | For Whom |
|---------|----------|-------------|----------|
| 💰 Investment Returns | 💰 Investment | Financial projections, ROI, profitability analysis | Investors, Developers |
| 📅 Timeline & Phasing | 📅 Timeline | Construction schedule, cash flow, milestones | Project Managers |
| ✓ Regulatory Compliance | ✓ Compliance | Regulatory requirements, compliance score, remediation costs | Planners, Lawyers |

---

## Getting Started

### Step 1: Create a Project
```
1. Log in to the application
2. Click "Create New Project" on dashboard
3. Fill in project details (name, location, budget, land size)
4. Click "Create"
```

### Step 2: Add a Scenario
```
1. On project page, click "New Scenario" button
2. Configure building/unit parameters in the simulator
3. Adjust costs and finishes
4. Click "Save"
```

### Step 3: Analyze with New Features

#### 💰 Investment Returns Tab
```
1. Select your scenario
2. Click "💰 Investment" tab
3. View key metrics:
   - ROI % (target: 15-20%)
   - Net Profit (should be positive)
   - Payback Period (months)
   - IRR (Internal Rate of Return)
4. Click "Sensitivity" to see what-if scenarios
```

**What to Look For:**
- ✅ ROI > 15% = Good investment
- ✅ Payback < 60 months = Quick turnaround
- ⚠️  Affordability Gap > 0 = Subsidy needed

#### 📅 Timeline & Phasing Tab
```
1. Select your scenario
2. Click "📅 Timeline" tab
3. View Gantt chart showing:
   - 5 construction phases
   - Timeline bar for each phase
   - Milestones on the right
4. Click "Cash Flow" to see monthly budget distribution
5. Click "Phase Details" for individual phase breakdown
```

**What to Look For:**
- 📊 Total duration (months)
- 💰 Peak monthly cost
- 🎯 Critical path phases
- 👷 Labor unit requirements

#### ✓ Compliance Tab
```
1. Select your scenario
2. Click "✓ Compliance" tab
3. View compliance score (0-100%)
4. Review:
   - Compliant rules (✓)
   - Non-compliant rules (⚠️)
   - Remediation costs
5. Click on rule cards to see detailed recommendations
```

**What to Look For:**
- 🟢 Compliance Score > 80% = Good
- 🟡 Any "Critical" issues = Must fix
- 💰 Remediation cost vs. project budget

---

## Common Use Cases

### 📌 Use Case 1: Get Investor Approval
```
1. Create project and scenarios
2. Go to 💰 Investment tab
3. Review ROI, profitability, payback period
4. Export "Overview" tab metrics
5. Share with investors in pitch deck
```

**Key Metrics for Investors:**
- ROI %, IRR %, Net Profit, Payback Months

### 📌 Use Case 2: Plan Construction Timeline
```
1. Create project and scenarios
2. Go to 📅 Timeline tab
3. Review Gantt chart (understand phase sequence)
4. Check "Cash Flow" to understand financing needs
5. Identify critical path (longest dependent chain)
6. Plan financing releases around cash flow peaks
```

**Key Metrics for Project Managers:**
- Total Duration, Monthly Cash Flow, Critical Path

### 📌 Use Case 3: Regulatory Approval
```
1. Create project and scenarios
2. Go to ✓ Compliance tab
3. Review compliance score
4. Identify non-compliant rules
5. Expand each non-compliant rule for recommendations
6. Adjust scenario parameters to improve score
7. Track remediation costs
```

**Key Metrics for Planners:**
- Compliance Score %, Issues Found, Remediation Cost

### 📌 Use Case 4: What-If Analysis
```
1. Create base scenario
2. Go to 💰 Investment tab
3. Click "Sensitivity" tab
4. Review impact of:
   - Construction cost +/- 10%
   - Occupancy 85% vs 100%
   - Pricing +/- 10%
5. Create alternate scenarios based on findings
6. Compare in Scenario Comparison tab
```

---

## Understanding the Metrics

### Investment Returns Metrics

| Metric | What It Means | Good Range | How to Improve |
|--------|--------------|-----------|----------------|
| **ROI** | Return on investment % | > 15% | Lower costs, higher prices |
| **IRR** | Internal rate of return (annualized) | > 10% | Faster revenue, lower costs |
| **Net Profit** | Total profit after all costs | > 0 | Positive means profitable |
| **Payback** | Months to recover investment | < 60 mo | Faster is better |
| **Affordability Gap** | Subsidy needed per unit | = 0 (ideal) | Increase volume, lower unit price |

### Timeline Metrics

| Metric | What It Means | Typical Range |
|--------|--------------|--------------|
| **Total Duration** | Months to build everything | 18-36 months |
| **Peak Monthly Cost** | Highest monthly spending | Usually Phase 2-3 |
| **Critical Path** | Phases that delay project | Usually 60-70% of phases |

### Compliance Metrics

| Metric | What It Means | Good Range |
|--------|--------------|-----------|
| **Compliance Score** | % of rules met | > 80% |
| **Issues Found** | Non-compliant rules | Should be 0 or documented |
| **Remediation Cost** | Cost to fix issues | Should fit in budget |

---

## Tips & Tricks

### 💡 Tip 1: Compare Scenarios Side-by-Side
```
1. Create 3-4 different scenarios:
   - Conservative (lower density, higher costs)
   - Base case (expected parameters)
   - Optimistic (higher density, cost savings)
2. Go to "Comparison" tab
3. Compare all three on metrics
4. Use sensitivity analysis to understand tradeoffs
```

### 💡 Tip 2: Use Compliance as Design Guide
```
1. Start with high non-compliance score
2. Read recommendations in Compliance tab
3. Adjust scenario parameters
4. Re-check compliance score
5. Iterate until score improves
6. This becomes your "compliant design"
```

### 💡 Tip 3: Align Timeline with Financing
```
1. Check timeline cash flow peaks
2. Plan loan draws/financing releases around peaks
3. Use monthly breakdown to create
   phased funding schedule
4. Avoid cash crunches by matching funding to costs
```

### 💡 Tip 4: Affordability Strategy
```
1. Review affordability gap in Investment tab
2. If gap > 0, you need subsidies
3. Increase project volume (more units) to spread costs
4. Reduce unit prices with government subsidies
5. Use mixed-income (cross-subsidization) approach
```

---

## Tab Navigation

```
Scenarios       → View all scenarios, create new ones
Simulator       → Edit scenario parameters
Comparison      → Compare 2+ scenarios side-by-side
Forecasting     → Population growth and demand projections
💰 Investment   → ROI, profitability, sensitivity (NEW!)
📅 Timeline     → Gantt, cash flow, milestones (NEW!)
✓ Compliance    → Regulatory requirements, score (NEW!)
Settings        → Project configuration
```

All tabs appear in the horizontal tab bar at top of project page.

---

## Data Input Requirements

### For Investment Returns to Work:
- ✅ Scenario must have calculated results (automatic)
- ✅ Project must have currency specified
- ℹ️ Uses default financing (70% loan at 8.5%)
- ℹ️ Can be customized in future versions

### For Timeline to Work:
- ✅ Scenario must have total cost
- ✅ Construction duration (auto-estimated)
- ℹ️ Generates 5-phase default schedule
- ℹ️ Can customize in future versions

### For Compliance to Work:
- ✅ Scenario must be defined
- ✅ Project must have country specified
- ✅ Scenario results must exist
- ℹ️ Rule database pre-loaded with US, Kenya, Nigeria

---

## Troubleshooting

### "Tabs Are Disabled/Grayed Out"
**Solution:** These tabs only work when a scenario is selected.
- Go to "Scenarios" tab
- Click on a scenario name
- New tabs should now be enabled

### "No Data Showing"
**Solution:** Make sure scenario has calculated results.
- Ensure scenario has all required parameters filled
- Save the scenario
- Refresh the page
- Reselect the scenario

### "Compliance Rules Don't Match My Region"
**Solution:** Rules are configured per country in `lib/calculations.ts`
- Supported: US, Kenya (KE), Nigeria (NG)
- Other countries use default generic rules
- Custom rules can be added in future versions

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close any expanded card |
| `Tab` | Navigate between tabs |
| `Enter` | Select/expand item |

---

## Next Steps

1. ✅ **Try Investment Analysis** → Create scenario → Check ROI
2. ✅ **Review Timeline** → See construction phases and cash flow
3. ✅ **Check Compliance** → Understand regulatory requirements
4. ✅ **Compare Scenarios** → Use Comparison tab to see tradeoffs
5. ✅ **Export Reports** → Use Project Report to share findings

---

## Support & Feedback

Having issues or want to suggest improvements?

**Known Limitations:**
- Financing defaults to 70% LTV at 8.5% (configurable in code)
- Compliance rules are simplified (not legal advice)
- Timeline phases are generic (can be customized)

**Future Enhancements:**
- Custom financing scenarios
- More detailed compliance rules
- Carbon footprint tracking
- GIS integration for land data

---

## Key Takeaways

🎯 **Investment Returns Tab:**
- Tells you if the project is profitable
- Shows return on investment
- Helps with investor pitches

📅 **Timeline Tab:**
- Shows construction phases and duration
- Displays monthly cash flow needs
- Helps plan financing and resources

✓ **Compliance Tab:**
- Checks against regulatory requirements
- Identifies non-compliance issues
- Shows costs to remediate

**Use all three together to make better housing development decisions!** 🏢

---

**Happy planning!** 🚀
