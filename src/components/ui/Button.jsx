export function Button({ children, variant = "primary", size = "md", className = "", as: Component = "button", ...props }) {
    const variants = {
        primary: "bg-primary-800 text-white hover:bg-primary-700",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        danger: "bg-red-600 text-white hover:bg-red-500",
        ghost: "text-primary-800 hover:bg-primary-100",
    }
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    }
    return (
        <Component
            className={`inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </Component>
    )
}
