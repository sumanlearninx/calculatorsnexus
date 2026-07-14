import Layout from '../components/Layout'
import Link from 'next/link'

export default function PrivacyPolicy() {
    const lastUpdated = 'January 2025'

    return (
        <Layout seo={{
            meta_title:       'Privacy Policy – CalculatorsNexus',
            meta_description: 'Privacy Policy for CalculatorsNexus. Learn how we collect, use and protect your information.',
            robots:           'index, follow',
        }}>
            <section className="py-5">
                <div className="container" style={{ maxWidth: '800px' }}>

                    <h1 className="fw-bold mb-2">Privacy Policy</h1>
                    <p className="text-muted mb-5">Last updated: {lastUpdated}</p>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">1. Introduction</h2>
                        <p className="text-muted">
                            Welcome to CalculatorsNexus ("we", "our", "us"). We are committed to protecting
                            your privacy. This Privacy Policy explains how we handle information when
                            you use our website at calculatorsnexus.com.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">2. Information We Collect</h2>
                        <p className="text-muted">
                            CalculatorsNexus is a free calculator tool. We collect minimal information:
                        </p>
                        <ul className="text-muted">
                            <li><strong>Usage Data:</strong> Pages visited, calculators used, and approximate location via IP address — collected automatically through analytics.</li>
                            <li><strong>Calculator Inputs:</strong> Numbers you enter in calculators are processed entirely in your browser. We do not store or transmit your calculation inputs to our servers.</li>
                            <li><strong>Cookies:</strong> We use cookies for analytics and to remember your preferences.</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">3. How We Use Your Information</h2>
                        <ul className="text-muted">
                            <li>To improve our calculators and user experience</li>
                            <li>To analyze site traffic and popular calculators</li>
                            <li>To serve relevant advertisements (Google AdSense)</li>
                            <li>To fix bugs and technical issues</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">4. Third Party Services</h2>
                        <p className="text-muted">We use these third-party services which have their own privacy policies:</p>
                        <ul className="text-muted">
                            <li><strong>Google Analytics:</strong> Website traffic analysis</li>
                            <li><strong>Google AdSense:</strong> Advertisement serving</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">5. Data Storage</h2>
                        <p className="text-muted">
                            Calculator inputs are never stored on our servers. All calculations happen
                            locally in your browser. We do not sell, trade, or transfer your personal
                            information to third parties.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">6. Cookies</h2>
                        <p className="text-muted">
                            We use cookies to analyze traffic and improve our service. You can disable
                            cookies in your browser settings, though this may affect site functionality.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">7. Children's Privacy</h2>
                        <p className="text-muted">
                            Our service is not directed to children under 13. We do not knowingly
                            collect personal information from children under 13.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">8. Changes to This Policy</h2>
                        <p className="text-muted">
                            We may update this Privacy Policy from time to time. Changes will be
                            posted on this page with an updated date.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="h5 fw-bold">9. Contact Us</h2>
                        <p className="text-muted">
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <strong>privacy@calculatorsnexus.com</strong>
                        </p>
                    </div>

                    <hr />
                    <p className="text-muted">
                        <Link href="/" className="text-decoration-none">← Back to Home</Link>
                        {' | '}
                        <Link href="/terms" className="text-decoration-none">Terms of Service</Link>
                    </p>

                </div>
            </section>
        </Layout>
    )
}
