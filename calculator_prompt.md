I am building calculator widgets for a website called CalculatorsNexus.

When I say "build [Calculator Name] calculator", generate exactly TWO
things — no backend code, no pages, no navbar, no footer, nothing else:

1. The React widget file (see WIDGET DESIGN PATTERN below)
2. The content block (see CONTENT TO GENERATE below)

Output path:   frontend/components/calculators/[WidgetName].js
Stack:         Plain JavaScript (.js, NOT TypeScript), React
Styling:       Bootstrap 5 classes only (no Tailwind)
Always import shared helpers exactly like this:
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

━━━ NAMING RULES ━━━

Calculator name : "BMI Calculator"
Slug            : "bmi-calculator"       (split by spaces → lowercase → hyphens)
Widget filename : "BmiCalculator.js"     (split slug by "-", capitalize each word, join)
Component name  : BmiCalculator          (same as filename without .js)

More examples:
"Simple Interest Calculator"   → "simple-interest-calculator"   → "SimpleInterestCalculator.js"
"Compound Interest Calculator" → "compound-interest-calculator" → "CompoundInterestCalculator.js"
"GST Calculator"               → "gst-calculator"               → "GstCalculator.js"

The filename and the exported component name must always match exactly.
Never copy an existing widget file to start a new one and leave the old
export name or logic in place — build each widget fresh for its own
calculator.

━━━ UTILS.JS — SHARED FUNCTIONS ━━━

Located at: frontend/lib/utils.js
ALWAYS import from here — NEVER rewrite these locally in any calculator.
Do not import any other package (no axios, lodash, moment, etc.) —
these five functions plus plain React are all a widget should ever need.

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
→ Returns true only if ALL values are valid, finite numbers >= 0 (zero passes)
→ For any field that must be strictly positive (principal, time period,
  tenure), add an extra check in the same if-statement: e.g. P <= 0
→ Fields where zero is a legitimate value (like an interest rate) don't
  need the extra check — let isValidInput handle them alone
→ NEVER use !value or !P checks — always use this function

export function isFiniteResult(...values)
→ Checks calculated results are not Infinity or NaN
→ Catches extreme input values like 999999999999
→ Use AFTER calculation, BEFORE setResult

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

        // Step 5: setResult — include ALL values shown in UI, including
        // any input values displayed in sentences (see Rule 7)
        setResult({
            principal: P,   // include input values used in display
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
                        <div className="col-md-4">
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
✅ if (!isValidInput(P, R, T) || P <= 0 || T <= 0) { setResult(null); return }
❌ if (!P || !r || P <= 0) return

RULE 3 — INFINITY PROTECTION
Always check after calculation, before setResult:
✅ if (!isFiniteResult(output1, output2)) { setResult(null); return }
Place this immediately after all math is done.

RULE 4 — SETRESULT COMPLETENESS
Every value shown in the result section — including input values reused
in summary sentences, not just calculated outputs — must be read from
the result object:
✅ setResult({ principal: P, interest, total })
   then use: {formatAmount(result.principal)}
❌ setResult({ interest, total })
   then use: {formatAmount(principal)}  ← raw state, breaks the snapshot

RULE 5 — NO CURRENCY SYMBOLS
formatAmount never shows $ £ € ₹ — site is global.
✅ {formatAmount(result.total)}   → "1,435,000"
❌ '$' + formatAmount(result.total) → "$1,435,000"

RULE 6 — PERCENT DISPLAY
formatPercent already appends % — never add it again:
✅ {formatPercent(result.rate)}    → "10.00%"
❌ {formatPercent(result.rate)}%   → "10.00%%"

RULE 7 — READ FROM RESULT OBJECT ONLY
Never display a raw useState variable anywhere inside the
`{result && (...)}` block — not even something as simple as a time
period or rate next to a properly-sourced value. `result` is a frozen
snapshot from the last successful calculation; the raw state variables
update live as the user types and can briefly disagree with it. Every
single value shown in the result section, without exception, must come
from `result.___`:
✅ {formatAmount(result.principal)}
✅ {result.timePeriod} years
❌ {formatAmount(principal)}
❌ {timePeriod} years          ← even though it "usually" matches result

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

━━━ QUALITY CHECKLIST — RUN THIS BEFORE HANDING BACK ANY WIDGET ━━━

CHECK 1 — No duplicate or orphan files.
Never copy an existing widget file to create a new one "as a starting
point" and leave the old export name or content in place. Build the
new widget's logic fresh for its own formula and inputs.

CHECK 2 — No extra dependencies.
Don't import anything beyond React and the five functions in
frontend/lib/utils.js. If a calculation genuinely needs something else,
say so and ask first instead of adding an import silently.

CHECK 3 — Read every rendered sentence once, out loud, before shipping.
Alert/summary sentences built from multiple {result.x} insertions are
the easiest place to ship a duplicated word or a redundant trailing
phrase. After assembling any sentence, read the final rendered text —
not just the JSX — before calling it done.

━━━ CONTENT TO GENERATE (alongside the widget) ━━━

Every time you build a widget, also generate this content block as
plain readable text — NOT code, NOT a Python dict, NOT wrapped in any
file structure. I enter this by hand into Django Admin myself. Use
these five labels, in this order:

1. description
   ~300 words as a baseline. Go shorter for a simple calculator (e.g.
   a basic percentage or tip calculator) and longer for a genuinely
   complex one (e.g. a full amortizing mortgage calculator) if it
   actually needs the extra length to explain properly — don't pad a
   simple calculator to hit 300 words. Explain what the calculator
   does, why someone would use it, and who it's useful for. Plain
   prose, no headers, no bullet points.

2. how_to_use
   Numbered steps a first-time user follows, start to finish:
   Step 1: ...
   Step 2: ...
   Step 3: ...
   (as many steps as the calculator genuinely needs — don't pad or
   compress artificially)

3. formula
   The exact mathematical formula(s) used, with every variable defined:
   Formula = ...
   Where:
   P = ...
   R = ...
   If the calculator uses more than one formula (e.g. EMI first, then
   a monthly amortization breakdown), include all of them, each with
   its own variable definitions.

4. example
   Exactly one fully worked example: state the sample inputs, then show
   the calculation step-by-step, then state the final result — using
   the same formula and variable names from #3 above, so a reader can
   follow along and verify the widget's math against it.

5. faqs
   Minimum 5, maximum 10, as Question / Answer pairs, numbered in the
   order they should display. Each question must be genuinely specific
   to this calculator (not generic filler like "what is a calculator")
   — cover things like: how the formula handles edge cases, common
   points of confusion for this specific calculation, what a "good" or
   "typical" result looks like, and how it differs from a related
   calculator if one exists on the site.
   1. Question? → Answer
   2. Question? → Answer
   ...

The formula in #3 and the math inside the widget's calculate() function
must produce identical results — if they'd disagree on the same inputs,
fix one so they match before returning either.

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

        if (!isValidInput(P, R, T) || P <= 0 || T <= 0) {
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
            principalPaid:  P,
            interestRate:   R,
            timePeriod:     T,
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
                        <div className="col-md-4">
                            <div className="bg-light text-dark border rounded p-3 h-100">
                                <div className="small text-muted">Principal</div>
                                <div className="fw-bold fs-6">{formatAmount(result.principalPaid)}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Interest Earned</div>
                                <div className="fw-bold fs-6">{formatAmount(result.simpleInterest)}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Total Amount</div>
                                <div className="fw-bold fs-6">{formatAmount(result.totalAmount)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="alert alert-info text-center py-2">
                        📊 You earn <strong>{formatAmount(result.simpleInterest)}</strong> as
                        interest on <strong>{formatAmount(result.principalPaid)}</strong> over{' '}
                        <strong>{result.timePeriod} year{result.timePeriod > 1 ? 's' : ''}</strong> at{' '}
                        <strong>{formatPercent(result.interestRate)}</strong> per year.
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
