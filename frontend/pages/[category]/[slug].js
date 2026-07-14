/**
 * pages/[category]/[slug].js
 * Handles ALL calculator URLs:
 * /finance/emi-calculator/
 * /health/bmi-calculator/
 * etc.
 */
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import Link from 'next/link'
import CalculatorCard from '../../components/CalculatorCard'
import { getCalculatorDetail, getRelatedCalculators } from '../../lib/api'
import { slugToComponentName } from '../../lib/utils'

// ── FAQ Section ───────────────────────────────────────────────────
function FAQSection({ faqs }) {
    if (!faqs || faqs.length === 0) return null
    return (
        <div className="mt-5">
            <h2 className="fw-bold mb-4">❓ Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
                {faqs.map((item, i) => (
                    <div key={i} className="accordion-item border-0 shadow-sm mb-2">
                        <h3 className="accordion-header">
                            <button
                                className="accordion-button collapsed fw-semibold"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#faq${i}`}
                            >
                                {item.question}
                            </button>
                        </h3>
                        <div id={`faq${i}`} className="accordion-collapse collapse">
                            <div className="accordion-body text-muted">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Related Section ───────────────────────────────────────────────
function RelatedSection({ related }) {
    if (!related || related.length === 0) return null
    return (
        <div className="mt-5">
            <h2 className="fw-bold mb-4">🔗 Related Calculators</h2>
            <div className="row g-3">
                {related.map(calc => (
                    <div key={calc.slug} className="col-md-6">
                        <CalculatorCard calculator={calc} />
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function CalculatorPage({ calculator, related }) {

    const widgetName = slugToComponentName(calculator.slug)

    const CalcWidget = dynamic(
        () => import(`../../components/calculators/${widgetName}`)
            .catch(() => () => (
                <div className="alert alert-warning">
                    Calculator widget coming soon!
                </div>
            )),
        {
            ssr: false,
            loading: () => (
                <div className="text-center text-muted py-4">
                    Loading calculator...
                </div>
            )
        }
    )

    return (
        <Layout seo={calculator.seo}>

            {/* Breadcrumb */}
            <section className="bg-light py-3 border-bottom">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href={`/${calculator.category_slug}`}>
                                    {calculator.category_name}
                                </Link>
                            </li>
                            <li className="breadcrumb-item active">
                                {calculator.name}
                            </li>
                        </ol>
                    </nav>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-5">

                        {/* LEFT: Calculator Widget */}
                        <div className="col-lg-7">
                            <div className="card border-0 shadow">
                                <div className="card-body p-4">
                                    <h1 className="h3 fw-bold mb-1">
                                        {calculator.icon} {calculator.name}
                                    </h1>
                                    <p className="text-muted mb-4">
                                        {calculator.short_description}
                                    </p>
                                    <CalcWidget />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: SEO Content */}
                        <div className="col-lg-5">
                            {calculator.how_to_use && (
                                <div className="mb-4">
                                    <h2 className="h5 fw-bold">📋 How to Use</h2>
                                    <div className="text-muted"
                                         style={{ whiteSpace: 'pre-line' }}>
                                        {calculator.how_to_use}
                                    </div>
                                </div>
                            )}
                            {calculator.formula && (
                                <div className="mb-4">
                                    <h2 className="h5 fw-bold">🔢 Formula</h2>
                                    <div className="bg-light p-3 rounded">
                                        <code style={{ whiteSpace: 'pre-line' }}>
                                            {calculator.formula}
                                        </code>
                                    </div>
                                </div>
                            )}
                            {calculator.example && (
                                <div className="mb-4">
                                    <h2 className="h5 fw-bold">📝 Example</h2>
                                    <div className="bg-light p-3 rounded text-muted"
                                         style={{ whiteSpace: 'pre-line' }}>
                                        {calculator.example}
                                    </div>
                                </div>
                            )}
                            {calculator.description && (
                                <div className="mb-4">
                                    <h2 className="h5 fw-bold">
                                        ℹ️ About {calculator.name}
                                    </h2>
                                    <p className="text-muted">
                                        {calculator.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FAQ */}
                    <FAQSection faqs={calculator.faqs} />

                    {/* Related */}
                    <RelatedSection related={related} />

                </div>
            </section>
        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    try {
        const [calculator, related] = await Promise.all([
            getCalculatorDetail(params.slug),
            getRelatedCalculators(params.slug),
        ])

        // Security check — URL category must match actual category
        if (calculator.category_slug !== params.category) {
            return { notFound: true }
        }

        return { props: { calculator, related } }
    } catch {
        return { notFound: true }
    }
}