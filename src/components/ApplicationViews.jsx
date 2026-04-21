import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from "../pages/Register.jsx"
import Home from "../pages/Home"
import { GameList } from "./games/GameList"
import { GameForm } from "./games/GameForm"
import { GameDetail } from "./games/GameDetail"


export const ApplicationViews = () => {

    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Authorized />}>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GameList />} />
                <Route path="/games/new" element={<GameForm />} />
                <Route path="/games/:id" element={<GameDetail />} />
                <Route path="/games/:id/edit" element={<GameForm />} />
            </Route>
        </Routes>
    </BrowserRouter>
}