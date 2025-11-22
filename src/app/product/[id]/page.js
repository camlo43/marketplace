'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import CommentSection from '../../../components/CommentSection';
import Toast from '../../../components/Toast';
import { useProducts } from '../../../context/ProductContext';
import { useCart } from '../../../context/CartContext';
import { useMessages } from '../../../context/MessageContext';
import { useAuth } from '../../../context/AuthContext';

export default function ProductPage({ params }) {
    const { id } = use(params);
    const { getProduct } = useProducts();
    const { addToCart } = useCart();
    const { openChat } = useMessages();
    const { user } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        const found = getProduct(id);
        setProduct(found);
    }, [id, getProduct]);

    const handleAddToCart = () => {
        console.log('ProductPage: handleAddToCart clicked for product:', product);
        addToCart(product);
        setToastMessage('¡Producto agregado al carrito!');
        setToastType('success');
        setShowToast(true);
    };

    const handleContactSeller = () => {
        if (!user) {
            setToastMessage('Por favor inicia sesión para contactar al vendedor.');
            setToastType('info');
            setShowToast(true);
            setTimeout(() => router.push('/login'), 1500);
            return;
        }

        if (product.seller && product.seller.id) {
            openChat(product.seller.id, product.seller.name);
        } else {
            // Fallback for products without explicit seller
            setToastMessage('Este producto no tiene un vendedor asignado.');
            setToastType('error');
            setShowToast(true);
        }
    };

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <main className="container" style={{ flex: 1, padding: '4rem 0', textAlign: 'center' }}>
                    Cargando...
                </main>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <main className="container" style={{ flex: 1, padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Product Image Gallery */}
                    <div>
                        <div style={{
                            backgroundColor: 'var(--gray-100)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '1rem',
                            width: '500px',
                            height: '500px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--gray-200)'
                        }}>
                            <img
                                src={product.image}
                                alt={product.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    padding: '20px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{
                                    width: '80px',
                                    height: '80px',
                                    backgroundColor: 'var(--gray-100)',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: '1px solid var(--gray-300)'
                                }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div style={{ marginBottom: '1rem', color: 'var(--primary-red)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem' }}>
                            {product.brand} • {product.category}
                        </div>

                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{product.title}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ color: '#FFD700', fontSize: '1.25rem', marginRight: '0.5rem' }}>★</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{product.rating || 'N/A'}</span>
                            <span style={{ color: 'var(--gray-300)', margin: '0 0.5rem' }}>|</span>
                            <span style={{ color: 'var(--gray-800)' }}>{product.reviews || 0} reseñas</span>
                            <span style={{ color: 'var(--gray-300)', margin: '0 0.5rem' }}>|</span>
                            <span style={{
                                backgroundColor: product.condition === 'New' ? '#E6F4EA' : '#FFF8E1',
                                color: product.condition === 'New' ? '#1E8E3E' : '#F9A825',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                fontWeight: 'bold'
                            }}>
                                {product.condition}
                            </span>
                            {product.discount > 0 && (
                                <>
                                    <span style={{ color: 'var(--gray-300)', margin: '0 0.5rem' }}>|</span>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        color: 'white',
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                                    }}>
                                        ¡{product.discount}% DESCUENTO!
                                    </span>
                                </>
                            )}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            {product.discount > 0 && (
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '500',
                                    color: 'var(--gray-500)',
                                    textDecoration: 'line-through',
                                    marginBottom: '0.5rem'
                                }}>
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
                                </div>
                            )}
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: product.discount > 0 ? '#10B981' : 'var(--primary-red)'
                            }}>
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(
                                    product.discount > 0 ? product.discountedPrice : product.price
                                )}
                            </div>
                            {product.discount > 0 && (
                                <div style={{
                                    fontSize: '1rem',
                                    color: '#10B981',
                                    fontWeight: '600',
                                    marginTop: '0.5rem'
                                }}>
                                    ¡Ahorras {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price - product.discountedPrice)}!
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Descripción</h4>
                            <p style={{ lineHeight: '1.6', color: 'var(--gray-800)' }}>
                                {product.description || `Alta calidad ${product.title} compatible con varios modelos. Asegura un rendimiento óptimo y durabilidad.`}
                            </p>
                        </div>

                        {product.compatibleCars && (
                            <div style={{ marginBottom: '1rem' }}>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Autos Compatibles</h4>
                                <p style={{ color: 'var(--gray-700)' }}>{product.compatibleCars}</p>
                            </div>
                        )}

                        {product.usage && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Uso / Aplicación</h4>
                                <p style={{ color: 'var(--gray-700)' }}>{product.usage}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <Button onClick={handleAddToCart} style={{ flex: 1, fontSize: '1rem', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                Agregar al Carrito
                            </Button>
                            <Button onClick={handleContactSeller} variant="outline" style={{ flex: 1, fontSize: '1rem', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Contactar Vendedor
                            </Button>
                        </div>

                        <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1.5rem' }}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Información del Vendedor</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--black)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {product.seller ? product.seller.name.charAt(0) : 'A'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {product.seller && product.seller.id ? (
                                            <a
                                                href={`/seller/${product.seller.id}`}
                                                style={{ color: 'var(--black)', textDecoration: 'none', cursor: 'pointer' }}
                                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                            >
                                                {product.seller.name}
                                            </a>
                                        ) : (
                                            product.seller ? product.seller.name : 'AutoParts Pro'
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)' }}>Miembro desde 2023</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CommentSection
                    initialComments={[
                        { id: 101, user: "John Doe", rating: 5, date: "2 days ago", text: "Excellent product! Fits perfectly on my 2018 Civic." },
                        { id: 102, user: "Jane Smith", rating: 4, date: "1 week ago", text: "Good quality, but shipping took a bit longer than expected." }
                    ]}
                />
            </main>



            {/* Toast Notification */}
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
