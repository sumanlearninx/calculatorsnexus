/**
 * pages/search.js — Search Page
 * Searches calculators via Django API.
 */
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import CalculatorCard from '../components/CalculatorCard'
import { searchCalculators } from '../lib/api'

export default function SearchPage({ initialResults, initialQuery }) {
    const router = useRouter()
    const [query,   setQuery]   = useState(initialQuery || '')
    const [results, setResults] = useState(initialResults || [])
    const [loading, setLoading] = useState(false)

    // Listen to URL parameter changes (e.g., from the top navbar search)
    useEffect(() => {
        const urlQuery = router.query.q || ''
        
        // Sync inputs and query data if the URL differs from state
        if (urlQuery !== query) {
            setQuery(urlQuery)
            fetchResults(urlQuery)
        }
    }, [router.query.q])

    // Isolated data fetching utility
    async function fetchResults(searchTerm) {
        if (!searchTerm.trim()) {
            setResults([])
            return
        }
        setLoading(true)
        try {
            const data = await searchCalculators(searchTerm)
            setResults(data.results || [])
        } catch {
            setResults([])
        }
        setLoading(false)
    }

    async function handleSearch(e) {
        e.preventDefault()
        if (!query.trim()) return
        
        // Update URL path synchronously so the navbar search matches
        router.push(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true })
        await fetchResults(query)
    }

    return (
        <Layout seo={{
            meta_title:       'Search Calculators – CalculatorsNexus',
            meta_description: 'Search from 500+ free online calculators.',
            robots:           'noindex, follow',
        }}>
            <section className="bg-light py-4 border-bottom">
                <div className="container">
                    <h1 className="fw-bold">Search Calculators</h1>
                    <form onSubmit={handleSearch} className="d-flex mt-3">
                        <input
                            className="form-control form-control-lg me-2"
                            type="search"
                            placeholder="Search any calculator..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <button className="btn btn-primary btn-lg" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {loading && <p className="text-muted">Searching...</p>}

                    {!loading && results.length > 0 && (
                        <>
                            <p className="text-muted mb-4">
                                {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
                                <strong>"{query}"</strong>
                            </p>
                            <div className="row g-4">
                                {results.map(calc => (
                                    <div key={calc.slug} className="col-md-6 col-lg-4">
                                        <CalculatorCard calculator={calc} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {!loading && query && results.length === 0 && (
                        <p className="text-muted">
                            No calculators found for "<strong>{query}</strong>".
                            Try a different search term.
                        </p>
                    )}

                    {!query && (
                        <p className="text-muted">Enter a search term to find calculators.</p>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export async function getServerSideProps({ query: qs }) {
    const q = qs.q || ''
    if (!q) return { props: { initialResults: [], initialQuery: '' } }
    try {
        const data = await searchCalculators(q)
        return { props: { initialResults: data.results || [], initialQuery: q } }
    } catch {
        return { props: { initialResults: [], initialQuery: q } }
    }
}
