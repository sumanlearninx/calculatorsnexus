import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState(100000)
    const [rate, setRate] = useState(8)
    const [timePeriod, setTimePeriod] = useState(5)
    const [compoundingFrequency, setCompoundingFrequency] = useState(12) // Monthly default
    const [result, setResult] = useState(null)

    useEffect(() => { calculate() }, [principal, rate, timePeriod, compoundingFrequency])
    function getFrequencyLabel(n) {
        const labels = {
            1:   'annually',
            2:   'semi-annually',
            4:   'quarterly',
            12:  'monthly',
            365: 'daily',
        }
        return labels[n] || 'monthly'
    }
    function calculate() {
        const P = parseFloat(principal)
        const R = parseFloat(rate)
        const T = parseFloat(timePeriod)
        const N = parseFloat(compoundingFrequency)

        // Validate all inputs
        if (!isValidInput(P, R, T, N) || P <= 0 || R < 0 || T <= 0) {
            setResult(null)
            return
        }

        // Compound Interest Formula: A = P * (1 + r/n)^(n*t)
        const rDecimal = R / 100
        const totalAmount = P * Math.pow(1 + rDecimal / N, N * T)
        const compoundInterest = totalAmount - P

        // Check for infinity/NaN
        if (!isFiniteResult(totalAmount, compoundInterest)) {
            setResult(null)
            return
        }

        // Apply Math.max to prevent negative due to floating point errors (RULE 8)
        const safeTotalAmount = Math.max(0, totalAmount)
        const safeCompoundInterest = Math.max(0, compoundInterest)

        // Build yearly breakdown data
        const yearlyData = []
        const wholeYears = Math.floor(T)

        for (let year = 1; year <= wholeYears; year++) {
            const yearlyAmount = P * Math.pow(1 + rDecimal / N, N * year)
            const totalInterestEarned = yearlyAmount - P
            yearlyData.push({
                year: `Year ${year}`,
                interest: Math.max(0, totalInterestEarned),
                totalAmount: Math.max(0, yearlyAmount),
            })
        }

        // Handle fractional years
        if (T % 1 !== 0) {
            yearlyData.push({
                year: `Final (${T.toFixed(2)} Yrs)`,
                interest: safeCompoundInterest,
                totalAmount: safeTotalAmount,
            })
        }

        setResult({
            principalPaid: P,
            compoundInterest: safeCompoundInterest,
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

            <div className="row">
                <div className="col-md-6 mb-3">
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
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Compounding Frequency</label>
                    <select
                        className="form-select form-select-lg"
                        value={compoundingFrequency}
                        onChange={e => setCompoundingFrequency(Number(e.target.value))}
                    >
                        <option value={1}>Annually (Once a year)</option>
                        <option value={2}>Semi-Annually (Twice a year)</option>
                        <option value={4}>Quarterly (4 times a year)</option>
                        <option value={12}>Monthly (12 times a year)</option>
                        <option value={365}>Daily (365 times a year)</option>
                    </select>
                </div>
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
                                <div className="fw-bold fs-6">{formatAmount(result.compoundInterest)}</div>
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
                        📈 Your investment grows to <strong>{formatAmount(result.totalAmount)}</strong> with
                        <strong> {formatAmount(result.compoundInterest)}</strong> in interest earned over{' '}
                        <strong>{timePeriod} year{timePeriod > 1 ? 's' : ''}</strong> at{' '}
                        <strong>at {formatPercent(rate)} compounded {getFrequencyLabel(compoundingFrequency)}</strong> annual return.
                    </div>

                    {result.yearlyData.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold">Yearly Growth Schedule</h5>
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