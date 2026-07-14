import Link from 'next/link'
import CalcIcon from './CalcIcon'

export default function CategoryCard({ category }) {
    return (
        // ← Direct to /finance/ not /category/finance/
        <Link href={`/${category.slug}`} className="text-decoration-none">
            <div className="card text-center h-100 border-0 shadow-sm category-card">
                <div className="card-body py-4">
                    <div className="d-flex justify-content-center mb-2">
                        <CalcIcon
                            icon={category.icon}
                            iconImage={category.icon_image}
                            size={48}
                        />
                    </div>
                    <p className="fw-semibold mb-0 text-dark small">
                        {category.name}
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                        {category.calculator_count} calculators
                    </p>
                </div>
            </div>
        </Link>
    )
}