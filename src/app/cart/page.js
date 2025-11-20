'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button';
import Link from 'next/link';
import CheckoutForm from '../../components/CheckoutForm';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    const handleCheckoutStart = () => {
        setIsCheckingOut(true);
    };

    const handleCheckoutComplete = (formData) => {
        // Here you would typically send the data to a backend
        console.log('Order processed:', formData);
        clearCart();
        setOrderComplete(true);
        setIsCheckingOut(false);
    };

    const handleCheckoutCancel = () => {
        setIsCheckingOut(false);
    };

    if (orderComplete) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--green-500)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    color: 'white',
                    fontSize: '3rem'
                }}>
                    ✓
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>¡Gracias por tu Orden!</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
                    Tu pago ha sido procesado exitosamente. Te enviaremos un correo de confirmación pronto.
                </p>
                <Link href="/marketplace" className="btn btn-primary">
                    Continuar Comprando
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tu Carrito está Vacío</h1>
                <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Parece que no has agregado ningún repuesto aún.</p>
                <Link href="/marketplace" className="btn btn-primary">
                    Empezar a Comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                {isCheckingOut ? 'Finalizar Compra' : 'Carrito de Compras'}
            </h1>

            {isCheckingOut ? (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <CheckoutForm
                        total={cartTotal}
                        onComplete={handleCheckoutComplete}
                        onCancel={handleCheckoutCancel}
                    />
                </div>
            ) : (
                <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div>
                        {cart.map((item) => (
                            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
                                <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.title}</h3>
                                        <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price * item.quantity)}</span>
                                    </div>
                                    <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.brand} • {item.condition}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-300)', borderRadius: '4px' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{ padding: '0.25rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer' }}
                                            >-</button>
                                            <span style={{ padding: '0.25rem 0.5rem', fontWeight: '500' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{ padding: '0.25rem 0.75rem', border: 'none', background: 'none', cursor: 'pointer' }}
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ color: 'var(--primary-red)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={{ backgroundColor: 'var(--gray-50)', padding: '2rem', borderRadius: '8px', height: 'fit-content' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Resumen de la Orden</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
                            <span style={{ fontWeight: '500' }}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cartTotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--gray-600)' }}>Envío</span>
                            <span style={{ fontWeight: '500' }}>Gratis</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--gray-300)', margin: '1rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cartTotal)}</span>
                        </div>
                        <Button
                            onClick={handleCheckoutStart}
                            style={{
                                width: '100%',
                                fontSize: '1.1rem',
                                padding: '1rem',
                                boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)'
                            }}
                        >
                            Proceder al Pago
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
