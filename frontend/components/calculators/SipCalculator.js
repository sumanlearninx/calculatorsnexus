import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function SipCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(2500)
    const [annualReturn, setAnnualReturn] = useState(12)
    const [timePeriod, setTimePeriod] = useState(10)
    const [result, setResult] = useState(null)

    useEffect(() => { calculate() }, [monthlyInvestment, annualReturn, timePeriod])

    function calculate() {
        const P = parseFloat(monthlyInvestment)
        const R = parseFloat(annualReturn)
        const T = parseFloat(timePeriod)

        // Validate all inputs (RULE 2)
        if (!isValidInput(P, R, T) || P <= 0 || R < 0 || T <= 0) {
            setResult(null)
            return
        }

        // SIP Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
        // Where i = monthly rate, n = total months
        const monthlyRate = R / 12 / 100
        const totalMonths = Math.floor(T * 12)

        let maturityAmount = 0
        if (monthlyRate === 0) {
            maturityAmount = P * totalMonths
        } else {
            maturityAmount = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
        }

        const totalInvestment = P * totalMonths
        const wealthGained = maturityAmount - totalInvestment

        // Check for infinity/NaN (RULE 3)
        if (!isFiniteResult(maturityAmount, totalInvestment, wealthGained)) {
            setResult(null)
            return
        }

        // Apply Math.max to prevent negative due to floating point errors (RULE 8)
        const safeMaturityAmount = Math.max(0, maturityAmount)
        const safeTotalInvestment = Math.max(0, totalInvestment)
        const safeWealthGained = Math.max(0, wealthGained)

        // Build yearly breakdown data
        const yearlyData = []
        const wholeYears = Math.floor(T)

        for (let year = 1; year <= wholeYears; year++) {
            const months = year * 12
            let amount = 0
            if (monthlyRate === 0) {
                amount = P * months
            } else {
                amount = P * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
            }
            const invested = P * months

            yearlyData.push({
                year: `Year ${year}`,
                invested: Math.max(0, invested),
                gain: Math.max(0, amount - invested),
                amount: Math.max(0, amount),
            })
        }

        // Handle fractional years
        if (T % 1 !== 0) {
            yearlyData.push({
                year: `Final (${T.toFixed(2)} Yrs)`,
                invested: safeTotalInvestment,
                gain: safeWealthGained,
                amount: safeMaturityAmount,
            })
        }

        // Set complete result object (RULE 4)
        setResult({
            monthlyInvestment: P,
            annualReturn: R,
            timePeriod: T,
            totalInvestment: safeTotalInvestment,
            wealthGained: safeWealthGained,
            maturityAmount: safeMaturityAmount,
            yearlyData,
        })
    }

    return (
        <div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Monthly Investment Amount</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={monthlyInvestment}
                    min="1"
                    onChange={e => setMonthlyInvestment(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Expected Annual Return (%)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={annualReturn}
                    min="0"
                    step="0.1"
                    onChange={e => setAnnualReturn(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Investment Period (Years)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={timePeriod}
                    min="0.1"
                    step="0.5"
                    onChange={e => setTimePeriod(Number(e.target.value))}
                />
            </div>

            {result && (
                <div className="mt-4">
                    <div className="row g-3 text-center mb-4">
                        <div className="col-md-4">
                            <div className="bg-light text-dark border rounded p-3 h-100">
                                <div className="small text-muted">Total Investment</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.totalInvestment)}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Wealth Gained</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.wealthGained)}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Maturity Amount</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.maturityAmount)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info text-center py-2">
                        📈 Investing <strong>{formatAmount(result.monthlyInvestment)}</strong> every month for{' '}
                        <strong>{result.timePeriod} year{result.timePeriod > 1 ? 's' : ''}</strong> at an expected return of{' '}
                        <strong>{formatPercent(result.annualReturn)}</strong> may grow your wealth to{' '}
                        <strong>{formatAmount(result.maturityAmount)}</strong>.
                    </div>
                    
                    {result.yearlyData.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold">Yearly Growth Breakdown</h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Year</th>
                                            <th>Total Invested</th>
                                            <th>Wealth Gained</th>
                                            <th>Total Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.yearlyData.map(row => (
                                            <tr key={row.year}>
                                                <td>{row.year}</td>
                                                <td>{formatAmount(row.invested)}</td>
                                                <td>{formatAmount(row.gain)}</td>
                                                <td>{formatAmount(row.amount)}</td>
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