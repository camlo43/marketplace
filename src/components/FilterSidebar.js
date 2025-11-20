'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for inputs to avoid excessive URL updates while typing
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    // Sync local state with URL params
    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);

        if (key === 'categories' || key === 'conditions' || key === 'brands') {
            const current = params.getAll(key);
            if (current.includes(value)) {
                params.delete(key);
                current.filter(item => item !== value).forEach(item => params.append(key, item));
            } else {
                params.append(key, value);
            }
        } else {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }

        router.push(`/marketplace?${params.toString()}`);
    };

    const handlePriceChange = (type, value) => {
        if (type === 'min') setMinPrice(value);
        if (type === 'max') setMaxPrice(value);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
        if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
        router.push(`/marketplace?${params.toString()}`);
    };

    const isChecked = (key, value) => {
        return searchParams.getAll(key).includes(value);
    };

    return (
        <aside style={{ width: '250px', flexShrink: 0, paddingRight: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.5rem', display: 'inline-block' }}>
                    Categorías
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Frenos', 'Filtros', 'Llantas', 'Encendido', 'Fluidos', 'Iluminación', 'Audio', 'Motor', 'Suspensión', 'Electrónica', 'Interior', 'Exterior', 'Cuidado del Auto', 'Eléctrico'].map((cat) => (
                        <li key={cat}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--gray-700)' }}>
                                <input
                                    type="checkbox"
                                    style={{ marginRight: '0.5rem', accentColor: 'var(--primary-red)' }}
                                    checked={isChecked('categories', cat)}
                                    onChange={() => updateFilter('categories', cat)}
                                />
                                {cat}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.5rem', display: 'inline-block' }}>
                    Rango de Precio
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        className="input-field"
                        style={{ padding: '0.4rem' }}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        className="input-field"
                        style={{ padding: '0.4rem' }}
                    />
                </div>
                <button
                    onClick={applyPriceFilter}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.4rem', fontSize: '0.9rem' }}
                >
                    Aplicar
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.5rem', display: 'inline-block' }}>
                    Condición
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Nuevo', 'Usado', 'Reacondicionado'].map((cond) => (
                        <li key={cond}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--gray-700)' }}>
                                <input
                                    type="checkbox"
                                    style={{ marginRight: '0.5rem', accentColor: 'var(--primary-red)' }}
                                    checked={isChecked('conditions', cond)}
                                    onChange={() => updateFilter('conditions', cond)}
                                />
                                {cond}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.5rem', display: 'inline-block' }}>
                    Marca
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Brembo', 'Bosch', 'Michelin', 'NGK', 'Castrol', 'Honda', 'Toyota', 'Ford'].map((brand) => (
                        <li key={brand}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--gray-700)' }}>
                                <input
                                    type="checkbox"
                                    style={{ marginRight: '0.5rem', accentColor: 'var(--primary-red)' }}
                                    checked={isChecked('brands', brand)}
                                    onChange={() => updateFilter('brands', brand)}
                                />
                                {brand}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
