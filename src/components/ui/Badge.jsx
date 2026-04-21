export function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        blue: "bg-primary-100 text-primary-800",
        green: "bg-green-100 text-green-800",
        red: "bg-red-100 text-red-800",
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
