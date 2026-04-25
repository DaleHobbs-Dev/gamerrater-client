import { createContext, useContext, useEffect, useState } from "react"
import { TOKEN_KEY } from "../services"
import { getUserProfile } from "../services/userService"

const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setLoading(false)
            return
        }
        getUserProfile()
            .then(setUser)
            .catch(() => localStorage.removeItem(TOKEN_KEY))
            .finally(() => setLoading(false))
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    )
}
