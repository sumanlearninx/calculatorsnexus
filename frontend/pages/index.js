import Layout from '../components/Layout'
import CalculatorCard from '../components/CalculatorCard'
import CategoryCard from '../components/CategoryCard'
import { getHomepageData } from '../lib/api'
import Link from 'next/link'

export default function HomePage({ data }) {
    const { categories, featured_calculators, new_calculators, popular_calculators } = data

    return (
        <Layout seo={{
            meta_title:       'CalculatorsNexus – Free Online Calculators',
            meta_description: 'Free online calculators for finance, health, math, business and more. 500+ calculators available.',
            meta_keywords:    'free calculator, online calculator, EMI calculator, BMI calculator',
        }}>

            {/* Hero */}
            <section className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="display-5 fw-bold">Free Online Calculators</h1>
                    <p className="lead mt-3">
                        Finance, Health, Math, Business and 500+ more calculators — free forever
                    </p>
                    <Link href="/search" className="btn btn-light btn-lg mt-3">
                        Search All & Any Calculators
                    </Link>
                </div>
            </section>

            {/* Categories */}
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="fw-bold mb-4">Browse by Category</h2>
                    <div className="row g-3">
                        {categories.map(cat => (
                            <div key={cat.slug} className="col-6 col-md-3 col-lg-2">
                                <CategoryCard category={cat} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured */}
            {featured_calculators.length > 0 && (
                <section className="py-5">
                    <div className="container">
                        <h2 className="fw-bold mb-4">⭐ Featured Calculators</h2>
                        <div className="row g-4">
                            {featured_calculators.map(calc => (
                                <div key={calc.slug} className="col-md-6 col-lg-4">
                                    <CalculatorCard calculator={calc} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Popular */}
            {popular_calculators.length > 0 && (
                <section className="py-5 bg-light">
                    <div className="container">
                        <h2 className="fw-bold mb-4">🔥 Most Popular</h2>
                        <div className="row g-4">
                            {popular_calculators.map(calc => (
                                <div key={calc.slug} className="col-md-6 col-lg-4">
                                    <CalculatorCard calculator={calc} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </Layout>
    )
}

// ── This runs on the SERVER (not in browser) ─────────────────────
// Fetches data from Django before page is sent to user
export async function getServerSideProps() {
    try {
        const data = await getHomepageData()
        return { props: { data } }
    } catch (error) {
        return { props: { data: {
            categories: [], featured_calculators: [],
            new_calculators: [], popular_calculators: []
        }}}
    }
}
