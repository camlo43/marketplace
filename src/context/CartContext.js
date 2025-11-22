'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const { user } = useAuth();



    // Mark when we're on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load cart logic
    useEffect(() => {
        if (!isClient) return;

        const loadCart = async () => {
            if (user) {
                // User logged in: Check for guest items to merge
                const guestCart = localStorage.getItem('cart');
                const hasMerged = sessionStorage.getItem('cart_merged');

                if (guestCart && !hasMerged) {
                    try {
                        const items = JSON.parse(guestCart);
                        if (items.length > 0) {
                            sessionStorage.setItem('cart_merged', 'true'); // Lock immediately
                            localStorage.removeItem('cart'); // NUCLEAR OPTION: Clear immediately

                            await fetch('/api/cart/merge', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: user.id, items })
                            });
                        } else {
                            localStorage.removeItem('cart');
                        }
                    } catch (error) {
                        console.error('Error merging cart:', error);
                    }
                }

                // Fetch user cart from DB (Always run this to get latest state)
                try {
                    const res = await fetch(`/api/cart?userId=${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        // Transform DB data to frontend format and deduplicate items
                        const rawCart = data.map(item => {
                            let imagePath = '/products/placeholder.jpg';
                            if (item.Imagenes) {
                                const firstImage = item.Imagenes.split(',')[0];
                                if (firstImage.startsWith('http')) {
                                    imagePath = firstImage;
                                } else {
                                    imagePath = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
                                }
                            } else if (item.Especificacion && item.Especificacion.includes('|IMG:')) {
                                // Legacy system: image stored in Especificacion field
                                const parts = item.Especificacion.split('|IMG:');
                                imagePath = parts[1] || imagePath;
                            }
                            return {
                                id: `${item.ProductoID}`,
                                title: item.Nombre,
                                price: parseFloat(item.Precio),
                                quantity: item.Cantidad,
                                image: imagePath,
                                seller: item.Vendedor
                            };
                        });
                        const deduped = {};
                        rawCart.forEach(item => {
                            if (deduped[item.id]) {
                                deduped[item.id].quantity += item.quantity;
                            } else {
                                deduped[item.id] = { ...item };
                            }
                        });
                        setCart(Object.values(deduped));
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            } else {
                // Guest: Load from localStorage
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                } else {
                    setCart([]);
                }
            }
        };

        loadCart();
    }, [isClient, user]);

    // Save cart to localStorage ONLY if guest
    useEffect(() => {
        if (!isClient || user) return;
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart, isClient, user]);

    const addToCart = async (product) => {
        if (user) {
            try {
                console.log('addToCart: Adding product', product.id);
                // 1. Send request to API
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1 })
                });

                if (!res.ok) {
                    console.error('addToCart: API Error', await res.text());
                    return;
                }

                // 2. Refresh cart from DB to ensure consistency
                const refreshRes = await fetch(`/api/cart?userId=${user.id}`);
                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    console.log('addToCart: Refreshed data', data);

                    // Transform and Deduplicate (Safety net)
                    const rawCart = data.map(item => {
                        let imagePath = '/products/placeholder.jpg';
                        if (item.Imagenes) {
                            const firstImage = item.Imagenes.split(',')[0];
                            if (firstImage.startsWith('http')) {
                                imagePath = firstImage;
                            } else {
                                imagePath = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
                            }
                        } else if (item.Especificacion && item.Especificacion.includes('|IMG:')) {
                            const parts = item.Especificacion.split('|IMG:');
                            imagePath = parts[1] || imagePath;
                        }
                        return {
                            id: `${item.ProductoID}`,
                            title: item.Nombre,
                            price: parseFloat(item.Precio),
                            quantity: item.Cantidad,
                            image: imagePath,
                            seller: item.Vendedor
                        };
                    });

                    const deduped = {};
                    rawCart.forEach(i => {
                        if (deduped[i.id]) {
                            deduped[i.id].quantity += i.quantity;
                        } else {
                            deduped[i.id] = i;
                        }
                    });
                    setCart(Object.values(deduped));
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        } else {
            // Guest logic (Local State)
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...product, quantity: 1 }];
            });
        }
    };

    const removeFromCart = async (productId) => {
        console.log('removeFromCart called with productId:', productId, 'type:', typeof productId);

        if (!productId) {
            console.error('Attempted to remove item with invalid productId');
            return;
        }

        if (user) {
            try {
                console.log(`Sending DELETE request for userId: ${user.id}, productId: ${productId}`);
                const res = await fetch(`/api/cart?userId=${user.id}&productId=${productId}`, {
                    method: 'DELETE'
                });

                console.log('DELETE response status:', res.status);

                if (res.ok) {
                    // After successful deletion, refresh cart from backend to stay in sync
                    const refreshed = await fetch(`/api/cart?userId=${user.id}`);
                    if (refreshed.ok) {
                        const data = await refreshed.json();
                        // ... (transformation logic same as loadCart)
                        const rawCart = data.map(item => {
                            let imagePath = '/products/placeholder.jpg';
                            if (item.Imagenes) {
                                const firstImage = item.Imagenes.split(',')[0];
                                if (firstImage.startsWith('http')) {
                                    imagePath = firstImage;
                                } else {
                                    imagePath = firstImage.startsWith('/') ? firstImage : `/${firstImage}`;
                                }
                            } else if (item.Especificacion && item.Especificacion.includes('|IMG:')) {
                                // Legacy system: image stored in Especificacion field
                                const parts = item.Especificacion.split('|IMG:');
                                imagePath = parts[1] || imagePath;
                            }
                            return {
                                id: `${item.ProductoID}`,
                                title: item.Nombre,
                                price: parseFloat(item.Precio),
                                quantity: item.Cantidad,
                                image: imagePath,
                                seller: item.Vendedor
                            };
                        });
                        const deduped = {};
                        rawCart.forEach(i => {
                            if (deduped[i.id]) {
                                deduped[i.id].quantity += i.quantity;
                            } else {
                                deduped[i.id] = i;
                            }
                        });
                        setCart(Object.values(deduped));
                    } else {
                        console.error('Failed to refresh cart after deletion', await refreshed.text());
                    }
                } else {
                    const errText = await res.text();
                    console.error(`Failed to delete item. Status: ${res.status}. Body: ${errText}`);
                    // Fallback: try to remove locally anyway if it was a 404 or similar? 
                    // No, better to know why it failed.
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        } else {
            setCart(prev => prev.filter(item => item.id !== productId));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        if (user) {
            try {
                // Calculate difference or just set absolute? API handles add/update. 
                // My API implementation adds to existing. I need an update endpoint or modify logic.
                // Actually my POST adds to existing. I should modify POST to accept absolute quantity or add PUT.
                // For now, let's just update state locally and sync? No, that's bad.
                // Let's assume I modify the API to handle absolute update or I just use what I have.
                // Wait, my POST implementation: `const newQuantity = existing[0].Cantidad + (quantity || 1);`
                // It ADDS. That's not what updateQuantity does (it sets absolute).
                // I need to fix the API to support setting quantity.
                // Or I can delete and re-add? No.

                // I will modify the API in a separate step if needed, but for now I'll use a hack:
                // I'll implement a PUT endpoint or modify POST. 
                // Let's modify POST in the API to handle a 'mode' or just create a PUT.
                // Since I can't modify API in this tool call, I'll assume I'll fix it.
                // I'll implement the frontend assuming a PUT endpoint exists or POST handles it.
                // Let's use POST with a flag? Or just create PUT.

                // I'll use a PUT request here and implement it in the next step.
                await fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId, quantity })
                });

                setCart(prev => prev.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                ));
            } catch (error) {
                console.error('Error updating cart:', error);
            }
        } else {
            setCart(prev => prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            ));
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                await fetch(`/api/cart?userId=${user.id}&clearAll=true`, {
                    method: 'DELETE'
                });
                setCart([]);
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        } else {
            setCart([]);
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
