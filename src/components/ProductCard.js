'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, style }) {
    const hasDiscount = Boolean(product.discount && product.discount > 0);
    const displayPrice = hasDiscount ? product.discountedPrice : product.price;

    return (
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', ...style }}>
            <div className="card animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '75%', backgroundColor: 'var(--gray-100)' }}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                        priority={false}
                        loading="lazy"
                        style={{
                            objectFit: 'cover'
                        }}
                    />
                    {product.condition === 'Nuevo' && (
                        <span style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            backgroundColor: 'var(--primary-red)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            zIndex: 1
                        }}>
                            NUEVO
                        </span>
                    )}
                    {hasDiscount && (
                        <span style={{
                            position: 'absolute',
                            top: '0.5rem',
                            left: '0.5rem',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white',
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            borderRadius: '6px',
                            zIndex: 1,
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                        }}>
                            -{product.discount}%
                        </span>
                    )}
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600' }}>
                        {product.brand}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                        {product.title}
                    </h3>
                    <div style={{ marginTop: 'auto' }}>
                        {hasDiscount && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-500)', textDecoration: 'line-through', marginBottom: '0.25rem' }}>
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: hasDiscount ? '#10B981' : 'var(--primary-red)' }}>
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(displayPrice)}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ color: '#FFD700' }}>★</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{product.rating || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
