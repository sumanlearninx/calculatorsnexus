/**
 * api.js — Central place for ALL Django API calls
 *
 * Every time Next.js needs data, it calls one of these functions.
 * They all talk to Django REST Framework running on port 8000.
 *
 * Usage in any page:
 *   import { getHomepageData, getCalculator } from '../lib/api'
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

// ── Helper: fetch with error handling ───────────────────────────
async function fetchAPI(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        // next: { revalidate: 60 }  // cache for 60s (enable in production)
    })
    if (!res.ok) throw new Error(`API error: ${res.status} on ${endpoint}`)
    return res.json()
}

// ── Homepage ─────────────────────────────────────────────────────
export async function getHomepageData() {
    return fetchAPI('/')
}

// ── Categories ───────────────────────────────────────────────────
export async function getCategories() {
    return fetchAPI('/categories/')
}

export async function getCategoryDetail(slug) {
    return fetchAPI(`/categories/${slug}/`)
}

// ── Calculators ──────────────────────────────────────────────────
export async function getCalculators() {
    return fetchAPI('/calculators/')
}

export async function getCalculatorDetail(slug) {
    return fetchAPI(`/calculators/${slug}/`)
}

export async function getRelatedCalculators(slug) {
    return fetchAPI(`/calculators/${slug}/related/`)
}

// ── Search ───────────────────────────────────────────────────────
export async function searchCalculators(query) {
    return fetchAPI(`/search/?q=${encodeURIComponent(query)}`)
}
