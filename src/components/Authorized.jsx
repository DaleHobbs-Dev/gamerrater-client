import { Navigate, Outlet } from "react-router-dom"
import { NavBar } from "./Navbar.jsx"

export const Authorized = () => {
  if (localStorage.getItem("gamer_rater_token")) {
    return <>
      <NavBar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  }
  return <Navigate to='/login' replace />
}
