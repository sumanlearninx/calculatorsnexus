import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Layout({ children, seo = {} }) {
    const [menuOpen,     setMenuOpen]     = useState(false)
    const [searchQuery,  setSearchQuery]  = useState('')
    const router = useRouter()

    const title       = seo.meta_title       || 'CalculatorsNexus – Free Online Calculators'
    const description = seo.meta_description || 'Free online calculators for finance, health, math and more.'
    const keywords    = seo.meta_keywords    || 'free calculator, online calculator'
    const robots      = seo.robots           || 'index, follow'
    const ogTitle     = seo.og_title         || title
    const ogDesc      = seo.og_description   || description
    const ogImage     = seo.og_image         || null
    const canonical   = seo.canonical_url    || `https://calculatorsnexus.com${router.asPath}`
    const schemaType  = seo.schema_type      || 'WebPage'

    // JSON-LD structured data for Google rich results
    const jsonLd = {
        '@context':    'https://schema.org',
        '@type':       schemaType,
        'name':        title,
        'description': description,
        'url':         canonical,
    }

    function handleSearch(e) {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <>
            <Head>
                {/* ── Basic SEO ── */}
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords"    content={keywords} />
                <meta name="robots"      content={robots} />
                <meta name="viewport"    content="width=device-width, initial-scale=1" />
                <link rel="icon"         href="/favicon.ico" />

                {/* ── Canonical URL ── */}
                <link rel="canonical" href={canonical} />

                {/* ── Open Graph — Facebook, LinkedIn, WhatsApp etc. ── */}
                <meta property="og:type"        content="website" />
                <meta property="og:url"         content={canonical} />
                <meta property="og:title"       content={ogTitle} />
                <meta property="og:description" content={ogDesc} />
                <meta property="og:site_name"   content="CalculatorsNexus" />
                {ogImage && (
                    <meta property="og:image" content={ogImage} />
                )}

                {/* ── Twitter Card — Twitter only ── */}
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content={ogTitle} />
                <meta name="twitter:description" content={ogDesc} />
                {ogImage && (
                    <meta name="twitter:image" content={ogImage} />
                )}

                {/* ── JSON-LD Structured Data — Google rich results ── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Bootstrap */}
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
                    rel="stylesheet"
                />
            </Head>

            <div className="d-flex flex-column min-vh-100">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-light sticky-top shadow-sm">
                    <div className="container">
                        <Link href="/" className="navbar-brand fw-bold fs-4">
                            CalculatorsNexus
                        </Link>
                        <button
                            className="navbar-toggler"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link href="/" className="nav-link">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/search" className="nav-link">All Calculators</Link>
                                </li>
                            </ul>
                            <form className="d-flex" onSubmit={handleSearch}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search calculators..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-light" type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </nav>

                <main className="flex-grow-1">{children}</main>

                <footer className="bg-dark text-light py-5 mt-5">
                    
                    <p className="text-center text-light mb-0">
                        © {new Date().getFullYear()} CalculatorsNexus. All rights reserved.
                    </p>
                
                </footer>
            </div>
            <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
                strategy="lazyOnload"
            />
        </>
    )
}