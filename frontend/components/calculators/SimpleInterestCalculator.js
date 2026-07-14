import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function SimpleInterestCalculator() {
    const [principal, setPrincipal] = useState(100000)
    const [rate, setRate] = useState(10)
    const [timePeriod, setTimePeriod] = useState(5)
    const [result, setResult] = useState(null)

    useEffect(() => { calculate() }, [principal, rate, timePeriod])

    function calculate() {
        const P = parseFloat(principal)
        const R = parseFloat(rate)
        const T = parseFloat(timePeriod)

        // Validate all inputs (RULE 2)
        if (!isValidInput(P, R, T) || P <= 0 || R < 0 || T <= 0) {
            setResult(null)
            return
        }

        // Calculate simple interest
        const simpleInterest = (P * R * T) / 100
        const totalAmount = P + simpleInterest

        // Check for infinity/NaN (RULE 3)
        if (!isFiniteResult(totalAmount, simpleInterest)) {
            setResult(null)
            return
        }

        // Apply Math.max to prevent negative due to floating point errors (RULE 8)
        const safeSimpleInterest = Math.max(0, simpleInterest)
        const safeTotalAmount = Math.max(0, totalAmount)

        // Build yearly breakdown data
        const yearlyData = []
        const wholeYears = Math.floor(T)

        for (let year = 1; year <= wholeYears; year++) {
            const interest = (P * R * year) / 100
            yearlyData.push({
                year: `Year ${year}`,
                interest: Math.max(0, interest),
                totalAmount: Math.max(0, P + interest),
            })
        }

        // Handle fractional years
        if (T % 1 !== 0) {
            yearlyData.push({
                year: `Final (${T.toFixed(2)} Yrs)`,
                interest: safeSimpleInterest,
                totalAmount: safeTotalAmount,
            })
        }

        // Set complete result object (RULE 4)
        setResult({
            principalPaid: P,
            simpleInterest: safeSimpleInterest,
            totalAmount: safeTotalAmount,
            yearlyData,
        })
    }

    return (
        <div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Principal Amount</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={principal}
                    min="1"
                    onChange={e => setPrincipal(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Annual Interest Rate (%)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={rate}
                    step="0.1"
                    min="0"
                    onChange={e => setRate(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Time Period (Years)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={timePeriod}
                    step="0.5"
                    min="0.1"
                    onChange={e => setTimePeriod(Number(e.target.value))}
                />
            </div>

            {result && (
                <div className="mt-4">
                    <div className="row g-3 text-center mb-4">
                        <div className="col-md-4">
                            <div className="bg-light text-dark border rounded p-3 h-100">
                                <div className="small text-muted">Principal</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.principalPaid)}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Interest Earned</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.simpleInterest)}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Total Amount</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.totalAmount)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info text-center py-2">
                        📊 You earn <strong>{formatAmount(result.simpleInterest)}</strong> as
                        interest on <strong>{formatAmount(result.principalPaid)}</strong> over{' '}
                        <strong>{timePeriod} year{timePeriod > 1 ? 's' : ''}</strong> at{' '}
                        <strong>{formatPercent(rate)}</strong> per year.
                    </div>

                    {result.yearlyData.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold">Yearly Breakdown</h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Year</th>
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