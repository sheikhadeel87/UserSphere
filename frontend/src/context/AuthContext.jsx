import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(data => setUser(data.user))
                .catch(() => { setToken(null); localStorage.removeItem('token'); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };
    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!user }}>
            {children}
            </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);