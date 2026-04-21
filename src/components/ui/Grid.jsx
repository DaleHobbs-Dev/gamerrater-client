export function Grid({ children, cols = 3, className = "" }) {
    const colMap = {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    }
    return (
        <div className={`grid gap-6 ${colMap[cols] ?? colMap[3]} ${className}`}>
            {children}
        </div>
    )
}
