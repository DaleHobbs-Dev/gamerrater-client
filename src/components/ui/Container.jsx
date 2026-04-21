export function Container({ children, className = "" }) {
    return (
        <div className={`max-w-5xl mx-auto px-6 py-8 ${className}`}>
            {children}
        </div>
    )
}
