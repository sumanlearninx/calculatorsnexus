import Link from 'next/link'
import CalcIcon from './CalcIcon'

export default function CalculatorCard({ calculator }) {
    return (
        // ← Use category_slug in URL
        <Link href={`/${calculator.category_slug}/${calculator.slug}`}
              className="text-decoration-none">
            <div className="card h-100 border-0 shadow-sm calc-card">
                <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                        <CalcIcon
                            icon={calculator.icon}
                            iconImage={calculator.icon_image}
                            size={40}
                        />
                        <h5 className="card-title mb-0 text-dark ms-2">
                            {calculator.name}
                        </h5>
                    </div>
                    <p className="card-text text-muted small">
                        {calculator.short_description}
                    </p>
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="badge bg-secondary">
                            {calculator.category_name}
                        </span>
                        <div>
                            {calculator.is_new && (
                                <span className="badge bg-success ms-1">New</span>
                            )}
                            {calculator.is_featured && (
                                <span className="badge bg-warning text-dark ms-1">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}