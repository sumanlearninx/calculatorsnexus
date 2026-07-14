/**
 * utils.js
 * Shared utility functions used across ALL calculator widgets.
 * Import from here — never rewrite these in individual calculators.
 *
 * Usage:
 * import { formatAmount, formatDecimal, formatPercent, isValidInput, isFiniteResult } from '../../lib/utils'
 */

// Format number with commas — no currency symbol
// 1435000 → "1,435,000"
export function formatAmount(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0'
    }
    return Math.round(amount).toLocaleString('en-US')
}

// Format decimal number with commas and decimal places
// 1435.678 → "1,435.68"
export function formatDecimal(amount, decimals = 2) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return (0).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        })
    }
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

// Format percentage — ALREADY INCLUDES % SYMBOL
// 12.5 → "12.50%"
// Never add % after this function
export function formatPercent(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(parseFloat(value))) {
        return (0).toFixed(decimals) + '%'
    }
    return parseFloat(value).toFixed(decimals) + '%'
}

// Validate inputs — uses isNaN() internally
// Returns true only if ALL values are valid numbers >= 0
// For fields that must be positive (P, T), add extra check: P <= 0
// For fields that allow zero (R), this passes zero through
export function isValidInput(...values) {
    return values.every(v => {
        const num = parseFloat(v)
        return !isNaN(num) && isFinite(num) && num >= 0
    })
}

// Check calculated results are not Infinity or NaN
// Use AFTER calculation, BEFORE setResult
// Catches extreme input values like 999999999999
export function isFiniteResult(...values) {
    return values.every(v =>
        v !== null &&
        v !== undefined &&
        !isNaN(v) &&
        isFinite(v)
    )
}

// Convert slug to component name
// "emi-calculator" → "EmiCalculator"
export function slugToComponentName(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
}