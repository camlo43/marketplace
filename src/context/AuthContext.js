'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mark when we're on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load user from local storage on mount (client-side only)
    useEffect(() => {
        if (!isClient) return;

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [isClient]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const userData = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    isVendedor: data.user.isVendedor
                };

                setUser(userData);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(userData));
                }

                return { success: true };
            } else {
                return { success: false, error: data.error || 'Error al iniciar sesión' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        try {
            // Dividir el nombre completo en nombre y apellidos
            const nameParts = userData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || 'N/A';

            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre: firstName,
                    Apellidos: lastName,
                    Pais: userData.country || null,
                    Ciudad: userData.city || null,
                    Celular: userData.phone || null,
                    correo: userData.email,
                    password: userData.password
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const newUser = {
                    id: data.user.ID,
                    name: data.user.Nombre,
                    email: data.user.correo,
                    isVendedor: data.user.vendedor === 1
                };

                setUser(newUser);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(newUser));
                }

                return { success: true };
            } else {
                return { success: false, error: data.error || 'Error al registrarse' };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
