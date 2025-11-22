'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';

export default function SellerProfilePage({ params: paramsPromise }) {
    // Handle both Next.js 15 (Promise) and 14 (Object) params
    const [id, setId] = useState(null);

    useEffect(() => {
        if (paramsPromise instanceof Promise) {
            paramsPromise.then(p => setId(p.id));
        } else {
            setId(paramsPromise.id);
        }
    }, [paramsPromise]);

    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch seller info
                const userRes = await fetch(`/api/users/${id}`);
                const userData = await userRes.json();

                if (!userRes.ok) {
                    throw new Error(userData.error || 'Vendedor no encontrado');
                }

                setSeller(userData.user);

                // 2. Fetch seller's products
                const productsRes = await fetch(`/api/products?seller_id=${id}`);
                const productsData = await productsRes.json();

                // Transform products to match component format
                const transformedProducts = productsData.map(p => {
                    // Extract image logic (same as ProductContext)
                    let imagePath = '/products/placeholder.jpg';
                    if (p.Imagenes) {
                        const images = p.Imagenes.split(',');
                        if (images.length > 0) imagePath = images[0];
                    } else if (p.Especificacion && p.Especificacion.includes('|IMG:')) {
                        const parts = p.Especificacion.split('|IMG:');
                        imagePath = parts[1] || imagePath;
                    }

                    return {
                        id: p.ID,
                        title: p.Nombre,
                        price: p.Precio,
                        brand: p.Marca,
                        category: p.Categoria,
                        image: imagePath,
                        rating: 4.5,
                        reviews: 0
                    };
                });

                setProducts(transformedProducts);

            } catch (err) {
                console.error('Error loading profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Cargando perfil...</p>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary-red)' }}>Error</h2>
                <p>{error || 'Perfil no encontrado'}</p>
                <Button onClick={() => router.push('/marketplace')} style={{ marginTop: '1rem' }}>
                    Volver al Marketplace
                </Button>
            </div>
        );
    }

    // Get initials for avatar
    const initials = seller.name
        ? `${seller.name[0]}${seller.lastName ? seller.lastName[0] : ''}`.toUpperCase()
        : '?';

    // Format date
    const joinDate = new Date(seller.joinedAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            {/* Header del Perfil */}
            <div style={{
                backgroundColor: 'var(--white)',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-red)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                }}>
                    {initials}
                </div>

                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {seller.name} {seller.lastName}
                    </h1>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                        Miembro desde {joinDate}
                    </p>
                    {seller.isSeller && (
                        <span style={{
                            backgroundColor: '#e6f4ea',
                            color: '#1e8e3e',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '16px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            Vendedor Verificado
                        </span>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-800)' }}>
                        {products.length}
                    </div>
                    <div style={{ color: 'var(--gray-500)' }}>Productos Publicados</div>
                </div>
            </div>

            {/* Grid de Productos */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-300)', paddingBottom: '0.5rem' }}>
                Catálogo de Productos
            </h2>

            {products.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
                    <p>Este vendedor aún no ha publicado productos.</p>
                </div>
            )}
        </div>
    );
}
