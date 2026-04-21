export function FormField({ label, htmlFor, children, error, className = "" }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    )
}
