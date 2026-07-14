I am building a calculator website called CalculatorsNexus.
The tech stack is Django REST Framework (backend) + Next.js (frontend).

━━━ PROJECT ARCHITECTURE ━━━

Backend: Django REST Framework
- Runs on http://127.0.0.1:8000
- All API endpoints are under /api/
- Models: SEO, Category, Calculator, FAQ
- Calculator has: name, slug, icon, icon_image, short_description,
  description, how_to_use, formula, example, is_featured, is_new
- FAQ is a separate model linked to Calculator (question, answer, order)

Frontend: Next.js (Pages Router, NOT App Router)
- Runs on http://localhost:3000
- Talks to Django via lib/api.js
- Bootstrap 5 is used for styling (loaded via CDN in Layout.js)
- No Tailwind, no TypeScript

━━━ FOLDER STRUCTURE ━━━

frontend/
├── lib/
│   ├── api.js                          ← all fetch calls to Django
│   └── utils.js                        ← shared utility functions (formatAmount, isValidInput etc.)
├── components/
│   ├── Layout.js                       ← navbar + footer + SEO head
│   ├── CalcIcon.js                     ← displays emoji OR uploaded image icon
│   ├── CalculatorCard.js               ← reusable card for calculator listings
│   ├── CategoryCard.js                 ← reusable category card
│   └── calculators/
│       └── [WidgetName].js             ← one file per calculator widget
├── pages/
│   ├── index.js                        ← homepage
│   ├── search.js                       ← search page
│   └── [category]/
│       ├── index.js                    ← category page (/finance/, /health/ etc.)
│       └── [slug].js                   ← calculator page (auto loads widget)

━━━ URL STRUCTURE ━━━

Category pages:    calculatorsnexus.com/finance/
                   calculatorsnexus.com/health/
Calculator pages:  calculatorsnexus.com/finance/emi-calculator/
                   calculatorsnexus.com/health/bmi-calculator/

NOT like this:     calculatorsnexus.com/calculator/emi-calculator/   ← WRONG
NOT like this:     calculatorsnexus.com/category/finance/            ← WRONG

━━━ HOW CALCULATOR WIDGETS WORK ━━━

The file pages/[category]/[slug].js automatically loads the correct
widget component based on the calculator slug using slugToComponentName()
from lib/utils.js:

slug "emi-calculator"              → component file "EmiCalculator.js"
slug "bmi-calculator"              → component file "BmiCalculator.js"
slug "simple-interest-calculator"  → component file "SimpleInterestCalculator.js"

Conversion rule: split by "-", capitalize each word, join together.
File lives in: frontend/components/calculators/[WidgetName].js

━━━ UTILS.JS — SHARED FUNCTIONS ━━━

Located at: frontend/lib/utils.js
ALWAYS import from here — NEVER rewrite these locally in any calculator.

export function formatAmount(amount)
→ Formats number with commas, NO currency symbol
→ 1435000 → "1,435,000"
→ NEVER use $ £ € ₹ symbols — site is global

export function formatDecimal(amount, decimals = 2)
→ Formats decimal with commas
→ 1435.678 → "1,435.68"

export function formatPercent(value, decimals = 2)
→ Formats percentage — ALREADY INCLUDES % SYMBOL
→ 12.5 → "12.50%"
→ NEVER add % after this: {formatPercent(rate)} NOT {formatPercent(rate)}%

export function isValidInput(...values)
→ Uses isNaN() internally — validates all inputs at once
→ Returns true only if ALL values are valid numbers > 0
→ NEVER use !value or !P checks — always use this function

export function isFiniteResult(...values)
→ Checks calculated results are not Infinity or NaN
→ Catches extreme input values like 999999999999
→ Use AFTER calculation, BEFORE setResult

export function slugToComponentName(slug)
→ "emi-calculator" → "EmiCalculator"
→ Used in pages/[category]/[slug].js to load widget dynamically

━━━ SEED DATA STRUCTURE ━━━

Seed data is split by category inside:
backend/calculators/management/commands/seeds/

seeds/
├── __init__.py
├── finance.py      ← all finance calculators
├── health.py       ← all health calculators
├── math.py         ← all math calculators
├── business.py     ← all business calculators
└── everyday.py     ← all everyday calculators

Main seed_data.py imports from these files.
When adding a new calculator, add its data dict to the correct category file.

Each calculator data dict structure:
{
    'slug':              'calculator-slug',
    'name':              'Calculator Name',
    'icon':              '🧮',
    'short_description': 'One line description shown on cards',
    'description':       '2-3 paragraph SEO description',
    'how_to_use':        'Step 1...\nStep 2...\nStep 3...',
    'formula':           'Formula = ...\nWhere:\nP = ...',
    'example':           'Input: ...\nResult: ...',
    'is_featured':       True or False,
    'is_new':            True or False,
    'order':             1,  (display order within category)
    'meta_title':        'Calculator Name – Free Tool | calculatorsnexus',
    'meta_description':  '150-160 char SEO description',
    'meta_keywords':     'keyword1, keyword2, keyword3',
    'faqs': [
        ('Question 1?', 'Answer 1', 1),
        ('Question 2?', 'Answer 2', 2),
        ('Question 3?', 'Answer 3', 3),
        ('Question 4?', 'Answer 4', 4),
        ('Question 5?', 'Answer 5', 5),
    ]
}

━━━ WIDGET DESIGN PATTERN ━━━

Every calculator widget follows this EXACT pattern — no exceptions:

```javascript
import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function [Name]Calculator() {

    // 1. State — all inputs as numbers (not strings)
    const [input1, setInput1] = useState(defaultNumber)
    const [input2, setInput2] = useState(defaultNumber)
    const [result, setResult] = useState(null)

    // 2. Auto calculate on any input change
    useEffect(() => { calculate() }, [input1, input2])

    // 3. Calculation function
    function calculate() {
        // Step 1: Parse inputs
        const P = parseFloat(input1)
        const R = parseFloat(input2)

        // Step 2: Validate — always use isValidInput from utils
        if (!isValidInput(P, R)) {
            setResult(null)
            return
        }

        // Step 3: Calculate
        const output1 = P * R
        const output2 = P + output1

        // Step 4: Infinity check — always after calculation
        if (!isFiniteResult(output1, output2)) {
            setResult(null)
            return
        }

        // Step 5: setResult — include ALL values shown in UI
        setResult({
            principalPaid: P,   // include input values used in display
            output1,
            output2,
        })
    }

    return (
        <div>
            {/* Input fields */}
            <div className="mb-3">
                <label className="form-label fw-semibold">Label</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={input1}
                    onChange={e => setInput1(Number(e.target.value))}
                />
            </div>

            {/* Results — only show when result is not null */}
            {result && (
                <div className="mt-4">
                    <div className="row g-3 text-center">
                        <div className="col-4">
                            <div className="bg-primary text-white rounded p-3">
                                <div className="small">Label</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.output1)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
```

━━━ MANDATORY RULES — NEVER BREAK THESE ━━━

RULE 1 — INPUT CASTING
Every onChange must cast to Number():
✅ onChange={e => setState(Number(e.target.value))}
❌ onChange={e => setState(e.target.value)}
Applies to ALL inputs — principal, rate, time, tenure, every field.

RULE 2 — VALIDATION
Always use isValidInput() from utils. Never use !value.
✅ if (!isValidInput(P, R, T)) { setResult(null); return }
❌ if (!P || !r || P <= 0) return

RULE 3 — INFINITY PROTECTION
Always check after calculation, before setResult:
✅ if (!isFiniteResult(output1, output2)) { setResult(null); return }
Place this immediately after all math is done.

RULE 4 — SETRESULT COMPLETENESS
Every value shown in UI must be in setResult:
✅ setResult({ principalPaid: P, interest, total })
   then use: {formatAmount(result.principalPaid)}
❌ setResult({ interest, total })
   then use: {formatAmount(principal)}  ← BREAKS when input is cleared

RULE 5 — NO CURRENCY SYMBOLS
formatAmount never shows $ £ € ₹ — site is global.
✅ {formatAmount(result.total)}   → "1,435,000"
❌ '$' + formatAmount(result.total) → "$1,435,000"

RULE 6 — PERCENT DISPLAY
formatPercent already appends % — never add it again:
✅ {formatPercent(rate)}    → "10.00%"
❌ {formatPercent(rate)}%   → "10.00%%"

RULE 7 — READ FROM RESULT OBJECT ONLY
Never display raw state variables in result section:
✅ {formatAmount(result.principalPaid)}
❌ {formatAmount(principal)}

RULE 8 — MATH PROTECTION
Use Math.max(0, value) for values that should never be negative:
✅ balance: Math.max(0, balance)
Prevents showing -0.01 due to floating point errors.

RULE 9 — COMPONENT ISOLATION
Each widget must be 100% self contained:
- No global variables
- No state outside the component
- All logic inside the component function only

RULE 10 — CODE QUALITY
- 4 space indentation throughout
- No submit button — auto calculate with useEffect
- Show results only when result !== null

RULE 11 — formatAmount vs formatDecimal:

Use formatAmount for:
→ All money values (loan amounts, EMI, interest, totals)
→ Whole number results where decimals add no value

Use formatDecimal for:
→ BMI, percentages, rates, ratios
→ Any value where decimal precision matters
→ Scientific or comparison values

Examples:
✅ formatAmount(result.emi)          → "14,347"
✅ formatAmount(result.totalPayment) → "1,721,640"
✅ formatDecimal(result.bmi)         → "24.56"
✅ formatDecimal(result.rate)        → "10.50"
❌ formatDecimal(result.emi)         → "14,347.00" (unnecessary)
❌ formatAmount(result.bmi)          → "25" (loses precision)

RULE 12 — Alert sentences:
Always end alert summary sentences with a period (.)
Consistent across all calculators.

RULE 13 — Table guard:
Always wrap tables in a length check:
{result.yearlyData.length > 0 && (...)}
{result.schedule.length > 0 && (...)}
Prevents empty table rendering for edge case inputs.

RULE 14 — Result card columns:
Use col-md-4 for 3 card layouts (better mobile UX)
Use col-md-6 for 2 card layouts
Use col-12 for single card layouts


━━━ RESULT BOX COLORS ━━━

Use consistently across ALL calculators:
- Primary result   → bg-primary text-white
- Positive/returns → bg-success text-white
- Total/summary    → bg-dark text-white
- Warning value    → bg-warning text-dark
- Neutral info     → bg-light text-dark border

━━━ TABLE STYLING ━━━

For amortization, schedule, breakdown tables:
className="table table-sm table-striped table-bordered"
thead: className="table-dark"
Always wrap in: <div className="table-responsive">

━━━ NAMING RULES ━━━

Calculator name : "BMI Calculator"
Slug            : "bmi-calculator"       (auto generated from name)
Widget filename : "BmiCalculator.js"     (must match slug conversion)
Component name  : BmiCalculator          (same as filename without .js)

More examples:
"Simple Interest Calculator" → "simple-interest-calculator" → "SimpleInterestCalculator.js"
"Compound Interest Calculator" → "compound-interest-calculator" → "CompoundInterestCalculator.js"
"GST Calculator" → "gst-calculator" → "GstCalculator.js"

━━━ WHAT TO GENERATE ━━━

When I say "build [Calculator Name] calculator", generate ONLY two things:

1. React widget file:
   Path: frontend/components/calculators/[WidgetName].js
   Contains: inputs, calculate(), result display
   Does NOT contain: navbar, footer, SEO, breadcrumb, how to use,
   formula section, FAQ section — all handled by pages/[category]/[slug].js

2. Seed data dictionary block (Python):
   One data dict to add inside the calculators = [...] list
   in the correct seeds/[category].py file
   Must include: all fields, meta_title, meta_description,
   meta_keywords, and 5 FAQs as tuples (question, answer, order)

━━━ EXAMPLE COMPLETE WIDGET (SimpleInterestCalculator.js) ━━━

import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function SimpleInterestCalculator() {
    const [principal,  setPrincipal]  = useState(100000)
    const [rate,       setRate]       = useState(10)
    const [timePeriod, setTimePeriod] = useState(5)
    const [result,     setResult]     = useState(null)

    useEffect(() => { calculate() }, [principal, rate, timePeriod])

    function calculate() {
        const P = parseFloat(principal)
        const R = parseFloat(rate)
        const T = parseFloat(timePeriod)

        if (!isValidInput(P, R, T) || P <= 0 || R < 0 || T <= 0) {
            setResult(null)
            return
        }

        const simpleInterest = (P * R * T) / 100
        const totalAmount    = P + simpleInterest

        if (!isFiniteResult(totalAmount, simpleInterest)) {
            setResult(null)
            return
        }

        const yearlyData = []
        const wholeYears = Math.floor(T)
        for (let year = 1; year <= wholeYears; year++) {
            const interest = (P * R * year) / 100
            yearlyData.push({
                year:        `Year ${year}`,
                interest:    Math.max(0, interest),
                totalAmount: Math.max(0, P + interest),
            })
        }
        if (T % 1 !== 0) {
            yearlyData.push({
                year:        `Final (${T.toFixed(2)} Yrs)`,
                interest:    Math.max(0, simpleInterest),
                totalAmount: Math.max(0, totalAmount),
            })
        }

        setResult({
            principalPaid: P,
            simpleInterest: Math.max(0, simpleInterest),
            totalAmount:    Math.max(0, totalAmount),
            yearlyData,
        })
    }

    return (
        <div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Principal Amount</label>
                <input type="number" className="form-control form-control-lg"
                    value={principal} min="1"
                    onChange={e => setPrincipal(Number(e.target.value))} />
            </div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Annual Interest Rate (%)</label>
                <input type="number" className="form-control form-control-lg"
                    value={rate} step="0.1" min="0"
                    onChange={e => setRate(Number(e.target.value))} />
            </div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Time Period (Years)</label>
                <input type="number" className="form-control form-control-lg"
                    value={timePeriod} step="0.5" min="0.1"
                    onChange={e => setTimePeriod(Number(e.target.value))} />
            </div>

            {result && (
                <div className="mt-4">
                    <div className="row g-3 text-center mb-4">
                        <div className="col-4">
                            <div className="bg-light text-dark border rounded p-3 h-100">
                                <div className="small text-muted">Principal</div>
                                <div className="fw-bold fs-6">{formatAmount(result.principalPaid)}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Interest Earned</div>
                                <div className="fw-bold fs-6">{formatAmount(result.simpleInterest)}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Total Amount</div>
                                <div className="fw-bold fs-6">{formatAmount(result.totalAmount)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="alert alert-info text-center py-2">
                        📊 You earn <strong>{formatAmount(result.simpleInterest)}</strong> as
                        interest on <strong>{formatAmount(result.principalPaid)}</strong> over{' '}
                        <strong>{timePeriod} year{timePeriod > 1 ? 's' : ''}</strong> at{' '}
                        <strong>{formatPercent(rate)}</strong> per year
                    </div>
                    {result.yearlyData.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold">Yearly Breakdown</h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Timeline</th>
                                            <th>Interest Earned</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.yearlyData.map(row => (
                                            <tr key={row.year}>
                                                <td>{row.year}</td>
                                                <td>{formatAmount(row.interest)}</td>
                                                <td>{formatAmount(row.totalAmount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

