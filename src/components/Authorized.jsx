import { Navigate, Outlet } from "react-router-dom"
import { NavBar } from "./Navbar.jsx"
import { Footer } from "./Footer.jsx"
import { TOKEN_KEY } from "../services"

export const Authorized = () => {
    if (localStorage.getItem(TOKEN_KEY)) {
        return (
            <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        )
    }
    return <Navigate to='/login' replace />
}
