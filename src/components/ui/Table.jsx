export function Table({ children, className = "" }) {
    return (
        <div className={`w-full overflow-x-auto ${className}`}>
            <table className="w-full text-sm text-left text-gray-700">
                {children}
            </table>
        </div>
    )
}

export function TableHead({ children }) {
    return (
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            {children}
        </thead>
    )
}

export function TableBody({ children }) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>
}

export function TableRow({ children, className = "", ...props }) {
    return (
        <tr className={`hover:bg-gray-50 transition-colors ${className}`} {...props}>
            {children}
        </tr>
    )
}

export function TableHeader({ children, className = "" }) {
    return <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>
}

export function TableCell({ children, className = "" }) {
    return <td className={`px-4 py-3 ${className}`}>{children}</td>
}
