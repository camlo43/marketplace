'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);

    // Mark when we're on the client
    useEffect(() => {
        setIsClient(true);
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push('/marketplace');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header style={{ borderBottom: '1px solid var(--gray-200)', padding: '1rem 0', backgroundColor: 'var(--white)', position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    {/* Simple Logo Text for now, replacing AutoPartsMarket */}
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '900',
                        fontStyle: 'italic',
                        color: 'var(--primary-red)',
                        letterSpacing: '-1px',
                        textTransform: 'uppercase'
                    }}>
                        TUNEALO
                        <span style={{ fontSize: '0.8rem', color: 'var(--black)', display: 'block', lineHeight: '0.8', fontWeight: '600', letterSpacing: '2px' }}>
                            TU VEHÍCULO A TU MANERA
                        </span>
                    </div>
                </Link>

                {/* Search Bar */}
                <div style={{ flex: 1, maxWidth: '500px', margin: '0 2rem', display: 'flex' }}>
                    <input
                        type="text"
                        placeholder="Buscar repuestos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--gray-300)',
                            borderRadius: '4px 0 0 4px',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        className="btn btn-primary"
                        style={{
                            padding: '0 1.5rem',
                            borderRadius: '0 4px 4px 0'
                        }}
                    >
                        Buscar
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="/marketplace" style={{ fontWeight: '600', color: 'var(--black)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                        Catálogo
                    </Link>
                    <Link href="/sell" style={{ fontWeight: '600', color: 'var(--black)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                        Vender
                    </Link>

                    <Link href="/cart" style={{ fontWeight: '500', color: 'var(--black)', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                            src="/cart-icon.png"
                            alt="Carrito"
                            style={{ width: '70px', height: '50px' }}
                        />
                        {isClient && cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'var(--primary-red)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--gray-300)' }}></div>

                    {isClient && user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/messages" style={{ fontWeight: '600', color: 'var(--black)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem' }}>MENSAJES</Link>
                            <Link href={`/seller/${user.id}`} style={{ fontWeight: '600', color: 'var(--black)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem' }}>MI PERFIL</Link>
                            <span style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--black)' }}>HOLA, {user.name.toUpperCase()}</span>
                            <button
                                onClick={logout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--black)',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    fontSize: '0.9rem'
                                }}
                            >
                                CERRAR SESIÓN
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" style={{ fontWeight: '600', color: 'var(--black)', textDecoration: 'none', textTransform: 'uppercase', fontSize: '0.9rem' }}>INICIAR SESIÓN</Link>
                            <Link
                                href="/signup"
                                className="btn btn-secondary"
                                style={{
                                    textDecoration: 'none',
                                    textTransform: 'uppercase'
                                }}
                            >
                                REGISTRARSE
                            </Link>
                        </>
                    )}
                </nav>
            </div >
        </header >
    );
}
