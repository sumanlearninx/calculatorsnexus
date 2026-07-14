import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'

export default function LoanCalculator() {
    const [loanAmount,    setLoanAmount]    = useState(50000)
    const [interestRate,  setInterestRate]  = useState(10)
    const [loanTerm,      setLoanTerm]      = useState(5)
    const [loanType,      setLoanType]      = useState('reducing')
    const [result,        setResult]        = useState(null)

    const BALANCE_THRESHOLD = 0.01

    useEffect(() => { calculate() }, [loanAmount, interestRate, loanTerm, loanType])

    function calculate() {
        const P = parseFloat(loanAmount)
        const R = parseFloat(interestRate)
        const N = parseFloat(loanTerm)

        if (!isValidInput(P, R, N) || P <= 0 || R < 0 || N <= 0) {
            setResult(null)
            return
        }

        const monthlyRate   = R / 100 / 12
        const totalMonths   = Math.floor(N * 12)

        let monthlyPayment = 0
        let totalPayment   = 0
        let totalInterest  = 0

        if (loanType === 'flat') {
            // Flat Rate: interest calculated on original principal throughout
            totalInterest  = P * (R / 100) * N
            totalPayment   = P + totalInterest
            monthlyPayment = totalPayment / totalMonths
        } else {
            // Reducing Balance (standard EMI)
            if (monthlyRate === 0) {
                monthlyPayment = P / totalMonths
                totalPayment   = P
                totalInterest  = 0
            } else {
                const factor   = Math.pow(1 + monthlyRate, totalMonths)
                monthlyPayment = (P * monthlyRate * factor) / (factor - 1)
                totalPayment   = monthlyPayment * totalMonths
                totalInterest  = totalPayment - P
            }
        }

        if (!isFiniteResult(monthlyPayment, totalPayment, totalInterest)) {
            setResult(null)
            return
        }

        // Build yearly schedule
        const yearlyData   = []
        const wholeYears   = Math.floor(N)
        let remainingBalance = P

        for (let year = 1; year <= wholeYears; year++) {
            let yearPrincipal = 0
            let yearInterest  = 0

            for (let month = 0; month < 12; month++) {
                if (remainingBalance <= BALANCE_THRESHOLD) break

                let interestPayment  = 0
                let principalPayment = 0

                if (loanType === 'flat') {
                    // Flat: equal principal + fixed interest each month
                    principalPayment = P / totalMonths
                    interestPayment  = (P * (R / 100) * N) / totalMonths
                } else {
                    // Reducing balance
                    interestPayment  = remainingBalance * monthlyRate
                    principalPayment = monthlyPayment - interestPayment
                    if (principalPayment > remainingBalance) {
                        principalPayment = remainingBalance
                    }
                }

                yearInterest  += interestPayment
                yearPrincipal += principalPayment
                remainingBalance = Math.max(0, remainingBalance - principalPayment)

                if (remainingBalance <= BALANCE_THRESHOLD) {
                    remainingBalance = 0
                    break
                }
            }

            yearlyData.push({
                year:      `Year ${year}`,
                principal: Math.max(0, yearPrincipal),
                interest:  Math.max(0, yearInterest),
                balance:   Math.max(0, remainingBalance),
            })

            if (remainingBalance <= BALANCE_THRESHOLD) break
        }

        setResult({
            loanAmount:     P,
            interestRate:   R,
            loanTerm:       N,
            loanType,
            monthlyPayment: Math.max(0, monthlyPayment),
            totalPayment:   Math.max(0, totalPayment),
            totalInterest:  Math.max(0, totalInterest),
            yearlyData,
        })
    }

    function getLoanTypeLabel(type) {
        const labels = {
            'reducing': 'Reducing Balance',
            'flat':     'Flat Rate',
        }
        return labels[type] || 'Reducing Balance'
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
                    step="1000"
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

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Loan Term (Years)</label>
                    <input
                        type="number"
                        className="form-control form-control-lg"
                        value={loanTerm}
                        step="0.5"
                        min="0.5"
                        max="30"
                        onChange={e => setLoanTerm(Number(e.target.value))}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Interest Type</label>
                    <select
                        className="form-select form-select-lg"
                        value={loanType}
                        onChange={e => setLoanType(e.target.value)}
                    >
                        <option value="reducing">Reducing Balance</option>
                        <option value="flat">Flat Rate</option>
                    </select>
                </div>
            </div>

            {result && (
                <div className="mt-4">

                    {/* Result Cards */}
                    <div className="row g-3 text-center mb-4">
                        <div className="col-md-4">
                            <div className="bg-primary text-white rounded p-3 h-100">
                                <div className="small">Monthly Payment</div>
                                <div className="fw-bold fs-5 mt-1">
                                    {formatAmount(result.monthlyPayment)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-success text-white rounded p-3 h-100">
                                <div className="small">Total Interest</div>
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
                    <div className="alert alert-info text-center py-2">
                        💳 A <strong>{getLoanTypeLabel(result.loanType)}</strong> loan of{' '}
                        <strong>{formatAmount(result.loanAmount)}</strong> at{' '}
                        <strong>{formatPercent(result.interestRate)}</strong> over{' '}
                        <strong>{result.loanTerm} year{result.loanTerm > 1 ? 's' : ''}</strong>{' '}
                        costs <strong>{formatAmount(result.monthlyPayment)}</strong> per month.
                    </div>

                    {/* Yearly Schedule */}
                    {result.yearlyData.length > 0 && (
                        <div className="mt-3">
                            <h5 className="fw-bold">Yearly Repayment Schedule</h5>
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
                                        {result.yearlyData.map(row => (
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