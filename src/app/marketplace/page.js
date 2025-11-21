'use client';

import { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { useProducts } from '../../context/ProductContext';

function MarketplaceContent() {
    const searchParams = useSearchParams();
    const { products } = useProducts();
    const [sortBy, setSortBy] = useState('popularity');

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        let categories = searchParams.getAll('categories');
        const singleCategory = searchParams.get('category');

        // Check if we're filtering for offers (discounts)
        const showOnlyOffers = singleCategory === 'ofertas';

        // Support both single category and multiple categories (but not for ofertas)
        if (singleCategory && !categories.includes(singleCategory) && !showOnlyOffers) {
            categories = [...categories, singleCategory];
        }

        const conditions = searchParams.getAll('conditions');
        const brands = searchParams.getAll('brands');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const searchQuery = searchParams.get('q')?.toLowerCase();

        const normalizeText = (text) => {
            return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        };

        let result = products.filter(product => {
            // Filter by Offers (products with discount)
            if (showOnlyOffers && (!product.discount || product.discount === 0)) {
                return false;
            }

            // Filter by Search Query
            if (searchQuery) {
                const normalizedQuery = normalizeText(searchQuery);
                const matchesTitle = normalizeText(product.title).includes(normalizedQuery);
                const matchesBrand = normalizeText(product.brand).includes(normalizedQuery);
                const matchesCategory = normalizeText(product.category).includes(normalizedQuery);
                if (!matchesTitle && !matchesBrand && !matchesCategory) {
                    return false;
                }
            }

            // Filter by Category (skip if showing offers)
            if (!showOnlyOffers && categories.length > 0 && !categories.includes(product.category)) {
                return false;
            }
            // Filter by Condition
            if (conditions.length > 0 && !conditions.includes(product.condition)) {
                return false;
            }
            // Filter by Brand
            if (brands.length > 0 && !brands.includes(product.brand)) {
                return false;
            }
            // Filter by Price
            if (minPrice && product.price < parseFloat(minPrice)) {
                return false;
            }
            if (maxPrice && product.price > parseFloat(maxPrice)) {
                return false;
            }
            return true;
        });

        // Sorting Logic
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Assuming higher ID is newer for mock data, or use dateListed if available
                result.sort((a, b) => b.id - a.id);
                break;
            case 'oldest':
                result.sort((a, b) => a.id - b.id);
                break;
            case 'alphabetical-asc':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'alphabetical-desc':
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating-desc':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'popularity':
            default:
                // Default to popularity (reviews count)
                result.sort((a, b) => b.reviews - a.reviews);
                break;
        }

        return result;
    }, [searchParams, products, sortBy]);

    // Check if we're showing offers
    const showingOffers = searchParams.get('category') === 'ofertas';

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Sidebar */}
                <div className="sidebar-container">
                    <FilterSidebar />
                </div>

                {/* Product Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {showingOffers ? (
                                <>
                                    🔥 Ofertas Especiales ({filteredProducts.length})
                                </>
                            ) : (
                                <>
                                    Catálogo de Productos ({filteredProducts.length})
                                </>
                            )}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--gray-800)', fontWeight: '500' }}>Ordenar por:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--gray-300)',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                <option value="popularity">Popularidad</option>
                                <option value="price-asc">Precio: Menor a Mayor</option>
                                <option value="price-desc">Precio: Mayor a Menor</option>
                                <option value="newest">Más Nuevos</option>
                                <option value="rating-desc">Mejor Calificados</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '2rem'
                        }}>
                            {filteredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-800)' }}>
                            No se encontraron productos con estos filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Marketplace() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '2rem' }}>Cargando catálogo...</div>}>
            <MarketplaceContent />
        </Suspense>
    );
}
