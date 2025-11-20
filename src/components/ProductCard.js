'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, style }) {
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
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: '600' }}>
                        {product.brand}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                        {product.title}
                    </h3>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-red)' }}>
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ color: '#FFD700' }}>★</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{product.rating || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
