import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function EmiCalculator() {
    const [loanAmount, setLoanAmount] = useState(1000000)
    const [interestRate, setInterestRate] = useState(12)
    const [tenure, setTenure] = useState(10)
    const [result, setResult] = useState(null)
    const BALANCE_THRESHOLD = 0.01

    useEffect(() => { calculate() }, [loanAmount, interestRate, tenure])

    function calculate() {
        const P = parseFloat(loanAmount)
        const R = parseFloat(interestRate)
        const T = parseFloat(tenure)

        // Validate all inputs (RULE 2)
        if (!isValidInput(P, R, T) || P <= 0 || R < 0 || T <= 0) {
            setResult(null)
            return
        }

        const monthlyRate = R / 12 / 100
        const totalMonths = Math.floor(T * 12)

        let emi = 0
        let totalPayment = 0
        let totalInterest = 0

        // Handle zero interest rate edge case
        if (monthlyRate === 0) {
            emi = P / totalMonths
            totalPayment = P
            totalInterest = 0
        } else {
            // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
            const powerFactor = Math.pow(1 + monthlyRate, totalMonths)
            emi = P * monthlyRate * powerFactor / (powerFactor - 1)
            totalPayment = emi * totalMonths
            totalInterest = totalPayment - P
        }

        // Check for infinity/NaN (RULE 3)
        if (!isFiniteResult(emi, totalPayment, totalInterest)) {
            setResult(null)
            return
        }

        // Apply Math.max to prevent negative due to floating point errors (RULE 8)
        const safeEmi = Math.max(0, emi)
        const safeTotalPayment = Math.max(0, totalPayment)
        const safeTotalInterest = Math.max(0, totalInterest)

        // Build yearly amortization schedule
        let balance = P
        const schedule = []
        const wholeYears = Math.floor(T)

        for (let year = 1; year <= wholeYears; year++) {
            let yearPrincipal = 0
            let yearInterest = 0

            for (let month = 0; month < 12; month++) {
                if (balance <= BALANCE_THRESHOLD) break

                const interest = balance * monthlyRate
                let principal = safeEmi - interest

                // Handle last payment adjustments
                if (principal > balance) {
                    principal = balance
                }

                yearInterest += interest
                yearPrincipal += principal
                balance -= principal

                if (balance <= BALANCE_THRESHOLD) {
                    balance = 0
                    break
                }
            }

            schedule.push({
                year: `Year ${year}`,
                principal: Math.max(0, yearPrincipal),
                interest: Math.max(0, yearInterest),
                balance: Math.max(0, balance),
            })

            if (balance <= BALANCE_THRESHOLD) break
        }

        // Handle fractional years if needed
        if (T % 1 !== 0 && balance > 0) {
            const fractionalMonths = (T % 1) * 12
            let fracPrincipal = 0
            let fracInterest = 0

            for (let month = 0; month < fractionalMonths; month++) {
                if (balance <= BALANCE_THRESHOLD) break

                const interest = balance * monthlyRate
                let principal = safeEmi - interest

                if (principal > balance) {
                    principal = balance
                }

                fracInterest += interest
                fracPrincipal += principal
                balance -= principal

                if (balance <= BALANCE_THRESHOLD) {
                    balance = 0
                    break
                }
            }

            if (fracPrincipal > 0 || fracInterest > 0) {
                schedule.push({
                    year: `Final (${T.toFixed(2)} Yrs)`,
                    principal: Math.max(0, fracPrincipal),
                    interest: Math.max(0, fracInterest),
                    balance: Math.max(0, balance),
                })
            }
        }

        // Set complete result object (RULE 4)
        setResult({
            loanAmount: P,
            interestRate: R,
            tenure: T,
            emi: safeEmi,
            totalPayment: safeTotalPayment,
            totalInterest: safeTotalInterest,
            schedule,
        })
    }

    return (
        <div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Loan Amount</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={loanAmount}
                    min="1"
                    onChange={e => setLoanAmount(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Annual Interest Rate (%)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={interestRate}
                    step="0.1"
                    min="0"
                    onChange={e => setInterestRate(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Loan Tenure (Years)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={tenure}
                    min="0.5"
                    step="0.5"
                    max="30"
                    onChange={e => setTenure(Number(e.target.value))}
                />
            </div>

            {result && (
                <div className="mt-4">
                    <div className="row g-3 text-center mb-4">
                        <div className="col-md-4">
                            <div className="bg-primary text-white rounded p-3 h-100">
                                <div className="small">Monthly EMI</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.emi)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Total Interest</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.totalInterest)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Total Payment</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.totalPayment)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="alert alert-info text-center py-2">
                        🏠 For a loan of <strong>{formatAmount(result.loanAmount)}</strong> at{' '}
                        <strong>{formatPercent(result.interestRate)}</strong> over{' '}
                        <strong>{result.tenure} year{result.tenure > 1 ? 's' : ''}</strong>, your monthly EMI is{' '}
                        <strong>{formatAmount(result.emi)}</strong>.
                    </div>

                    {result.schedule.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold">Yearly Amortization Schedule</h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Year</th>
                                            <th>Principal Paid</th>
                                            <th>Interest Paid</th>
                                            <th>Remaining Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.schedule.map(row => (
                                            <tr key={row.year}>
                                                <td>{row.year}</td>
                                                <td>{formatAmount(row.principal)}</td>
                                                <td>{formatAmount(row.interest)}</td>
                                                <td>{formatAmount(row.balance)}</td>
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