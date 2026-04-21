export function Card({ children, className = "", ...props }) {
    return (
        <div className={`rounded-xl shadow-sm p-6 border border-gray-200 bg-white ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardHeader({ children, className = "" }) {
    return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }) {
    return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
}

export function CardContent({ children, className = "" }) {
    return <div className={`text-gray-600 flex flex-col gap-3 ${className}`}>{children}</div>
}
