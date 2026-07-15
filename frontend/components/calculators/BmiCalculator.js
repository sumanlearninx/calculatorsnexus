import { useState, useEffect } from 'react'
import { formatAmount, formatPercent, isValidInput, isFiniteResult, formatDecimal } from '../../lib/utils'

export default function BmiCalculator() {
    const [unitSystem, setUnitSystem] = useState(1) // 1 = Metric, 2 = Imperial
    const [weightKg, setWeightKg] = useState(70)
    const [heightCm, setHeightCm] = useState(175)
    const [weightLbs, setWeightLbs] = useState(154)
    const [heightFt, setHeightFt] = useState(5)
    const [heightIn, setHeightIn] = useState(9)
    const [result, setResult] = useState(null)

    useEffect(() => {
        calculate()
    }, [unitSystem, weightKg, heightCm, weightLbs, heightFt, heightIn])

    function calculate() {
        let weight = 0
        let bmi = 0
        let minHealthyWeight = 0
        let maxHealthyWeight = 0
        let category = ''
        let alertColor = ''
        let weightDiffText = ''

        if (unitSystem === 1) {
            const wKg = parseFloat(weightKg)
            const hCm = parseFloat(heightCm)

            if (!isValidInput(wKg, hCm) || wKg <= 0 || hCm <= 0) {
                setResult(null)
                return
            }

            const hM = hCm / 100
            bmi = wKg / (hM * hM)
            weight = wKg

            minHealthyWeight = 18.5 * (hM * hM)
            maxHealthyWeight = 24.9 * (hM * hM)
        } else {
            const wLbs = parseFloat(weightLbs)
            const hFt = parseFloat(heightFt)
            const hIn = parseFloat(heightIn)

            if (!isValidInput(wLbs, hFt, hIn) || wLbs <= 0 || (hFt === 0 && hIn === 0)) {
                setResult(null)
                return
            }

            const totalInches = (hFt * 12) + hIn
            bmi = (wLbs / (totalInches * totalInches)) * 703
            weight = wLbs

            minHealthyWeight = (18.5 / 703) * (totalInches * totalInches)
            maxHealthyWeight = (24.9 / 703) * (totalInches * totalInches)
        }

        if (!isFiniteResult(bmi, minHealthyWeight, maxHealthyWeight)) {
            setResult(null)
            return
        }

        if (bmi < 18.5) {
            category = 'Underweight'
            alertColor = 'alert-warning'
            const diff = minHealthyWeight - weight
            weightDiffText = `You need to gain ${formatDecimal(diff)} ${unitSystem === 1 ? 'kg' : 'lbs'} to reach a healthy weight range.`
        } else if (bmi >= 18.5 && bmi <= 24.99) {
            category = 'Healthy Weight'
            alertColor = 'alert-success'
            weightDiffText = 'You are currently within the healthy weight range.'
        } else if (bmi >= 25 && bmi <= 29.99) {
            category = 'Overweight'
            alertColor = 'alert-warning'
            const diff = weight - maxHealthyWeight
            weightDiffText = `You need to lose ${formatDecimal(diff)} ${unitSystem === 1 ? 'kg' : 'lbs'} to reach a healthy weight range.`
        } else {
            category = 'Obese'
            alertColor = 'alert-danger'
            const diff = weight - maxHealthyWeight
            weightDiffText = `You need to lose ${formatDecimal(diff)} ${unitSystem === 1 ? 'kg' : 'lbs'} to reach a healthy weight range.`
        }

        setResult({
            bmi: Math.max(0, bmi),
            weight: Math.max(0, weight),
            minHealthyWeight: Math.max(0, minHealthyWeight),
            maxHealthyWeight: Math.max(0, maxHealthyWeight),
            category,
            alertColor,
            weightDiffText,
            unitSystem,
        })
    }

    return (
        <div>
            <div className="mb-4 btn-group w-100" role="group">
                <button
                    type="button"
                    className={`btn ${unitSystem === 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setUnitSystem(1)}
                >
                    Metric Units (kg/cm)
                </button>
                <button
                    type="button"
                    className={`btn ${unitSystem === 2 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setUnitSystem(2)}
                >
                    Imperial Units (lbs/ft-in)
                </button>
            </div>

            {unitSystem === 1 ? (
                <div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Weight (kg)</label>
                        <input
                            type="number"
                            className="form-control form-control-lg"
                            value={weightKg}
                            min="1"
                            onChange={e => setWeightKg(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Height (cm)</label>
                        <input
                            type="number"
                            className="form-control form-control-lg"
                            value={heightCm}
                            min="1"
                            onChange={e => setHeightCm(Number(e.target.value))}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Weight (pounds)</label>
                        <input
                            type="number"
                            className="form-control form-control-lg"
                            value={weightLbs}
                            min="1"
                            onChange={e => setWeightLbs(Number(e.target.value))}
                        />
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label className="form-label fw-semibold">Height (feet)</label>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                value={heightFt}
                                min="0"
                                onChange={e => setHeightFt(Number(e.target.value))}
                            />
                        </div>
                        <div className="col-6">
                            <label className="form-label fw-semibold">Height (inches)</label>
                            <input
                                type="number"
                                className="form-control form-control-lg"
                                value={heightIn}
                                min="0"
                                max="11"
                                onChange={e => setHeightIn(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-4">
                    <div className="row g-3 text-center mb-4">
                        <div className="col-md-6">
                            <div className="bg-primary text-white rounded p-3 h-100">
                                <div className="small">Your BMI</div>
                                <div className="fw-bold fs-4 my-1">
                                    {formatDecimal(result.bmi)}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-dark text-white rounded p-3 h-100">
                                <div className="small">Weight Status</div>
                                <div className="fw-bold fs-4 my-1">
                                    {result.category}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`alert ${result.alertColor} text-center py-3 mb-4`}>
                        📊 A healthy weight range for your height is between{' '}
                        <strong>{formatDecimal(result.minHealthyWeight)}</strong> and{' '}
                        <strong>{formatDecimal(result.maxHealthyWeight)}</strong>{' '}
                        {result.unitSystem === 1 ? 'kg' : 'lbs'}. {result.weightDiffText}
                    </div>

                    <div className="mt-4">
                        <h5 className="fw-bold mb-3">BMI Categories Reference</h5>
                        <div className="table-responsive">
                            <table className="table table-sm table-striped table-bordered align-middle text-center">
                                <thead className="table-dark">
                                    <tr>
                                        <th>BMI Range</th>
                                        <th>Weight Classification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={result.bmi < 18.5 ? 'table-warning fw-bold' : ''}>
                                        <td>Less than 18.5</td>
                                        <td>Underweight</td>
                                    </tr>
                                    <tr className={result.bmi >= 18.5 && result.bmi <= 24.99 ? 'table-success fw-bold' : ''}>
                                        <td>18.5 – 24.9</td>
                                        <td>Healthy Weight</td>
                                    </tr>
                                    <tr className={result.bmi >= 25 && result.bmi <= 29.99 ? 'table-warning fw-bold' : ''}>
                                        <td>25.0 – 29.9</td>
                                        <td>Overweight</td>
                                    </tr>
                                    <tr className={result.bmi >= 30 ? 'table-danger fw-bold' : ''}>
                                        <td>30.0 or Higher</td>
                                        <td>Obese</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}