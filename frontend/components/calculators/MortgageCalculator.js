import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function MortgageCalculator() {
    const [loanAmount,    setLoanAmount]    = useState(300000)
    const [interestRate,  setInterestRate]  = useState(5)
    const [loanTerm,      setLoanTerm]      = useState(30)
    const [result,        setResult]        = useState(null)

    const BALANCE_THRESHOLD = 0.01

    useEffect(() => { calculate() }, [loanAmount, interestRate, loanTerm])

    function calculate() {
        const P = parseFloat(loanAmount)
        const R = parseFloat(interestRate)
        const N = parseFloat(loanTerm)

        // RULE 2 — R < 0 allows zero interest (handled below)
        if (!isValidInput(P, R, N) || P <= 0 || R < 0 || N <= 0) {
            setResult(null)
            return
        }

        const monthlyRate   = R / 100 / 12
        const totalPayments = N * 12

        let monthlyEMI   = 0
        let totalPayment = 0
        let totalInterest = 0

        // Zero interest edge case
        if (monthlyRate === 0) {
            monthlyEMI    = P / totalPayments
            totalPayment  = P
            totalInterest = 0
        } else {
            // Mortgage Formula: P * r * (1+r)^n / ((1+r)^n - 1)
            const factor  = Math.pow(1 + monthlyRate, totalPayments)
            monthlyEMI    = (P * monthlyRate * factor) / (factor - 1)
            totalPayment  = monthlyEMI * totalPayments
            totalInterest = totalPayment - P
        }

        // RULE 3 — Infinity check after calculation
        if (!isFiniteResult(monthlyEMI, totalPayment, totalInterest)) {
            setResult(null)
            return
        }

        // Build amortization schedule (first 12 months)
        const amortizationSchedule = []
        let remainingBalance = P

        for (let month = 1; month <= Math.min(12, totalPayments); month++) {
            const interestPayment  = remainingBalance * monthlyRate
            let   principalPayment = monthlyEMI - interestPayment

            // Last payment adjustment
            if (principalPayment > remainingBalance) {
                principalPayment = remainingBalance
            }

            remainingBalance = Math.max(0, remainingBalance - principalPayment)

            // RULE 8 — Math.max on all pushed values
            amortizationSchedule.push({
                month,
                emi:              Math.max(0, monthlyEMI),
                interestPayment:  Math.max(0, interestPayment),
                principalPayment: Math.max(0, principalPayment),
                remainingBalance: remainingBalance,
            })

            if (remainingBalance <= BALANCE_THRESHOLD) {
                remainingBalance = 0
                break
            }
        }

        // RULE 4 — setResult includes ALL values shown in UI
        setResult({
            loanAmount:           P,
            interestRate:         R,
            loanTerm:             N,
            monthlyEMI:           Math.max(0, monthlyEMI),
            totalPayment:         Math.max(0, totalPayment),
            totalInterest:        Math.max(0, totalInterest),
            amortizationSchedule,
            totalPaymentsCount:   totalPayments,
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
                    min="1000"
                    step="1000"
                    onChange={e => setLoanAmount(Number(e.target.value))}
                />
                <div className="form-text">Enter the total loan amount you need</div>
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
                <div className="form-text">Enter the annual interest rate</div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Loan Term (Years)</label>
                <input
                    type="number"
                    className="form-control form-control-lg"
                    value={loanTerm}
                    step="1"
                    min="1"
                    max="50"
                    onChange={e => setLoanTerm(Number(e.target.value))}
                />
                <div className="form-text">Enter the loan duration in years (1–50 years)</div>
            </div>

            {result && (
                <div className="mt-4">

                    {/* Result Cards */}
                    <div className="row g-3 text-center mb-4">
                        <div className="col-md-4">
                            <div className="bg-primary text-white rounded p-3 h-100">
                                <div className="small">Monthly EMI</div>
                                <div className="fw-bold fs-5 mt-1">
                                    {formatAmount(result.monthlyEMI)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Total Interest Payable</div>
                                <div className="fw-bold fs-5 mt-1">
                                    {formatAmount(result.totalInterest)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Total Payment</div>
                                <div className="fw-bold fs-5 mt-1">
                                    {formatAmount(result.totalPayment)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Alert */}
                    <div className="alert alert-info text-center py-3">
                        🏠 For a loan of <strong>{formatAmount(result.loanAmount)}</strong> at{' '}
                        <strong>{formatPercent(result.interestRate)}</strong> over{' '}
                        <strong>{result.loanTerm} year{result.loanTerm > 1 ? 's' : ''}</strong>,
                        your monthly EMI will be <strong>{formatAmount(result.monthlyEMI)}</strong>.
                        You will pay a total interest of{' '}
                        <strong>{formatAmount(result.totalInterest)}</strong> over the loan term.
                    </div>

                    {/* Principal vs Interest breakdown */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="bg-light p-3 rounded border">
                                <div className="text-muted small">Principal Amount</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.loanAmount)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-light p-3 rounded border">
                                <div className="text-muted small">Total Interest</div>
                                <div className="fw-bold fs-6">
                                    {formatAmount(result.totalInterest)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amortization Table — first 12 months */}
                    {result.amortizationSchedule.length > 0 && (
                        <div className="mt-4">
                            <h5 className="fw-bold mb-3">
                                Amortization Schedule (First 12 Months)
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-striped table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Month</th>
                                            <th>EMI Payment</th>
                                            <th>Principal Paid</th>
                                            <th>Interest Paid</th>
                                            <th>Remaining Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.amortizationSchedule.map(row => (
                                            <tr key={row.month}>
                                                <td className="fw-semibold">{row.month}</td>
                                                <td>{formatAmount(row.emi)}</td>
                                                <td>{formatAmount(row.principalPayment)}</td>
                                                <td>{formatAmount(row.interestPayment)}</td>
                                                <td>{formatAmount(row.remainingBalance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="table-secondary">
                                        <tr>
                                            <td colSpan="4" className="text-end fw-semibold">
                                                Full Schedule:
                                            </td>
                                            <td className="fw-semibold">
                                                {result.totalPaymentsCount > 12
                                                    ? `${result.totalPaymentsCount - 12}+ more months`
                                                    : 'Complete'}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            {result.totalPaymentsCount > 12 && (
                                <div className="alert alert-secondary mt-2">
                                    <small>
                                        Showing first 12 months only.
                                        Full amortization schedule available upon request.
                                    </small>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}