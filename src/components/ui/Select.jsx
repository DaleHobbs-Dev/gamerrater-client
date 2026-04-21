export function Select({ children, className = "", ...props }) {
    return (
        <select
            className={`block w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700 disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </select>
    )
}
