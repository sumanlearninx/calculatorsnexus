import Layout from '../components/Layout'
import Link from 'next/link'

export default function NotFound() {
    return (
        <Layout seo={{ meta_title: '404 – Page Not Found | CalculatorsNexus' }}>
            <div className="container text-center py-5">
                <div className="display-1">🧮</div>
                <h1 className="fw-bold mt-3">404 – Page Not Found</h1>
                <p className="text-muted">The calculator you are looking for does not exist.</p>
                <Link href="/" className="btn btn-primary btn-lg mt-3">
                    Go Home
                </Link>
            </div>
        </Layout>
    )
}
