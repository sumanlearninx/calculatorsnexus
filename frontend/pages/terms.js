import Layout from '../components/Layout'
import Link from 'next/link'

export default function Terms() {
    const lastUpdated = 'January 2025'

    return (
        <Layout seo={{
            meta_title:       'Terms of Service – CalculatorsNexus',
            meta_description: 'Terms of Service for CalculatorsNexus. Read our terms before using our free calculator tools.',
            robots:           'index, follow',
        }}>
            <section className="py-5">
                <div className="container" style={{ maxWidth: '800px' }}>

                    <h1 className="fw-bold mb-2">Terms of Service</h1>
                    <p className="text-muted mb-5">Last updated: {lastUpdated}</p>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">1. Acceptance of Terms</h2>
                        <p className="text-muted">
                            By accessing and using CalculatorsNexus ("the Site"), you accept and agree to
                            be bound by these Terms of Service. If you do not agree, please do not
                            use the Site.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">2. Use of Calculators</h2>
                        <p className="text-muted">
                            All calculators on CalculatorsNexus are provided for informational and
                            educational purposes only. Results are estimates based on the inputs
                            you provide and standard mathematical formulas.
                        </p>
                        <p className="text-muted">
                            <strong>Do not use calculator results as a substitute for professional
                            financial, legal, medical, or other professional advice.</strong> Always
                            consult a qualified professional before making important decisions.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">3. Accuracy Disclaimer</h2>
                        <p className="text-muted">
                            While we strive for accuracy, we make no warranties about the completeness,
                            reliability, or accuracy of calculator results. Actual figures from banks,
                            financial institutions, or other providers may vary. CalculatorsNexus is not
                            responsible for any decisions made based on calculator results.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">4. Intellectual Property</h2>
                        <p className="text-muted">
                            All content on CalculatorsNexus including calculators, text, design, and code
                            is owned by CalculatorsNexus and protected by copyright laws. You may not
                            reproduce, distribute, or create derivative works without our permission.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">5. Prohibited Uses</h2>
                        <p className="text-muted">You agree not to:</p>
                        <ul className="text-muted">
                            <li>Use the Site for any unlawful purpose</li>
                            <li>Attempt to scrape or harvest data in bulk</li>
                            <li>Overload our servers with excessive automated requests</li>
                            <li>Attempt to bypass rate limiting or security measures</li>
                            <li>Embed our calculators in other sites without permission</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">6. Limitation of Liability</h2>
                        <p className="text-muted">
                            CalculatorsNexus shall not be liable for any direct, indirect, incidental,
                            special, or consequential damages resulting from your use of or inability
                            to use the Site or its calculators.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">7. Third Party Links</h2>
                        <p className="text-muted">
                            Our Site may contain links to third party websites. We are not responsible
                            for the content or privacy practices of those sites.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">8. Changes to Terms</h2>
                        <p className="text-muted">
                            We reserve the right to modify these Terms at any time. Continued use of
                            the Site after changes constitutes acceptance of the new Terms.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">9. Governing Law</h2>
                        <p className="text-muted">
                            These Terms shall be governed by and construed in accordance with
                            applicable laws. Any disputes shall be resolved through good faith
                            negotiation before pursuing legal action.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">10. Contact</h2>
                        <p className="text-muted">
                            Questions about these Terms? Contact us at{' '}
                            <strong>legal@calculatorsnexus.com</strong>
                        </p>
                    </div>

                    <hr />
                    <p className="text-muted">
                        <Link href="/" className="text-decoration-none">← Back to Home</Link>
                        {' | '}
                        <Link href="/privacy" className="text-decoration-none">Privacy Policy</Link>
                    </p>

                </div>
            </section>
        </Layout>
    )
}
