'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    // Load user and users list from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedUsers = localStorage.getItem('users');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
    }, []);

    const login = (email, password) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const signup = (userData) => {
        // Check if user exists
        if (users.some(u => u.email === userData.email)) {
            return false;
        }

        const newUser = { ...userData, id: Date.now() }; // Simple ID
        const updatedUsers = [...users, newUser];

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Auto login after signup
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
