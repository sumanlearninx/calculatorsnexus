/**
 * pages/[category]/index.js
 * Handles ALL category URLs:
 * /finance/   /health/   /math/   etc.
 */
import Layout from '../../components/Layout'
import CalculatorCard from '../../components/CalculatorCard'
import { getCategoryDetail } from '../../lib/api'
import Link from 'next/link'

export default function CategoryPage({ category }) {
    return (
        <Layout seo={category.seo}>

            {/* Breadcrumb */}
            <section className="bg-light py-4 border-bottom">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active">
                                {category.name}
                            </li>
                        </ol>
                    </nav>
                    <h1 className="fw-bold mt-2">
                        {category.icon} {category.name} Calculators
                    </h1>
                    {category.description && (
                        <p className="text-muted">{category.description}</p>
                    )}
                    <small className="text-muted">
                        {category.calculators.length} calculators available
                    </small>
                </div>
            </section>

            {/* Calculators Grid */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        {category.calculators.map(calc => (
                            <div key={calc.slug} className="col-md-6 col-lg-4">
                                <CalculatorCard calculator={calc} />
                            </div>
                        ))}
                        {category.calculators.length === 0 && (
                            <p className="text-muted">
                                No calculators in this category yet.
                            </p>
                        )}
                    </div>
                </div>
            </section>

        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    try {
        const category = await getCategoryDetail(params.category)
        return { props: { category } }
    } catch {
        return { notFound: true }
    }
}