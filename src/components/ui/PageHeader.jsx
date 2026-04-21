export function PageHeader({ title, subtitle, action, className = "" }) {
    return (
        <div className={`flex items-start justify-between mb-6 ${className}`}>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="mt-1 text-gray-500 text-sm">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}
