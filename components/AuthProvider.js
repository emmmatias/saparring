import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState();
    const [userType, setUserType] = useState();

    const login = (user_data, type) => {
        setIsAuthenticated(true);
        setUser(user_data)
        setUserType(type)
    }

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null)
        setUserType(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, userType }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}