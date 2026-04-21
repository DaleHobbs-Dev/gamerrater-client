import { NavLink, Link, useNavigate } from "react-router-dom"
import { TOKEN_KEY } from "../services"

export const NavBar = () => {
    const navigate = useNavigate()

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors ${
            isActive
                ? "text-accent-500"
                : "text-primary-100 hover:text-accent-500"
        }`

    return (
        <nav className="bg-primary-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
            <Link
                to="/"
                className="text-xl font-bold tracking-wide text-accent-500 hover:text-accent-600 transition-colors"
            >
                Gamer Rater
            </Link>

            <div className="flex items-center gap-8">
                {localStorage.getItem(TOKEN_KEY) !== null ? (
                    <>
                        <NavLink to="/games" className={navLinkClass}>
                            Games
                        </NavLink>
                        <button
                            onClick={() => {
                                localStorage.removeItem(TOKEN_KEY)
                                navigate("/login")
                            }}
                            className="text-sm font-medium text-primary-100 hover:text-accent-500 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={navLinkClass}>
                            Login
                        </NavLink>
                        <NavLink to="/register" className={navLinkClass}>
                            Register
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}
