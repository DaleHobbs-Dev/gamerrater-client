import { Navigate, Outlet } from "react-router-dom"
import { NavBar } from "./Navbar.jsx"
import { Footer } from "./Footer.jsx"
import { LoadingPage } from "./ui"
import { useUser } from "../contexts/UserContext"

export const Authorized = () => {
    const { user, loading } = useUser()

    if (loading) return <LoadingPage />
    if (!user) return <Navigate to="/login" replace />

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
