/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: 'http://127.0.0.1:8000/api',
    },

    // ← Proxy sitemap and robots.txt to Django
    async rewrites() {
        return [
            {
                source:      '/sitemap.xml',
                destination: 'http://127.0.0.1:8000/sitemap.xml',
            },
            {
                source:      '/robots.txt',
                destination: 'http://127.0.0.1:8000/robots.txt',
            },
        ]
    },
}

module.exports = nextConfig