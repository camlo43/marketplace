'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

// Discount percentages available
const DISCOUNT_OPTIONS = [5, 10, 15];
const DISCOUNT_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);

    // Mark when we're on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Function to apply random discounts to random products
    const applyRandomDiscounts = (productList) => {
        // Determine how many products should have discounts (20-40% of products)
        const discountCount = Math.floor(productList.length * (0.2 + Math.random() * 0.2));

        // Create a copy of products
        const updatedProducts = productList.map(product => ({
            ...product,
            discount: 0,
            originalPrice: product.Precio
        }));

        // Randomly select products for discount
        const shuffled = [...updatedProducts].sort(() => Math.random() - 0.5);

        for (let i = 0; i < discountCount; i++) {
            const randomDiscount = DISCOUNT_OPTIONS[Math.floor(Math.random() * DISCOUNT_OPTIONS.length)];
            shuffled[i].discount = randomDiscount;
            shuffled[i].discountedPrice = Math.round(shuffled[i].Precio * (1 - randomDiscount / 100));
        }

        return shuffled.sort((a, b) => a.ID - b.ID); // Restore original order
    };

    // Check if we need to refresh discounts
    const shouldRefreshDiscounts = () => {
        if (typeof window === 'undefined') return false;

        const lastUpdate = localStorage.getItem('lastDiscountUpdate');
        if (!lastUpdate) return true;

        const timeSinceUpdate = Date.now() - parseInt(lastUpdate);
        return timeSinceUpdate >= DISCOUNT_INTERVAL;
    };

    // Fetch products from MySQL API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/products');
            const data = await response.json();


            // Transform MySQL data to match frontend format
            const transformedProducts = data.map((p, index) => {
                // Extract image from either FotosProducto (Imagenes) or Especificacion (legacy)
                let imagePath = '/products/placeholder.jpg';
                let compatibleCars = p.Especificacion || '';

                if (p.Imagenes) {
                    // New system: images from FotosProducto table
                    const images = p.Imagenes.split(',');
                    if (images.length > 0) {
                        imagePath = images[0];
                    }
                } else if (p.Especificacion && p.Especificacion.includes('|IMG:')) {
                    // Legacy system: image stored in Especificacion field
                    const parts = p.Especificacion.split('|IMG:');
                    compatibleCars = parts[0];
                    imagePath = parts[1] || imagePath;
                }

                const price = parseFloat(p.Precio) || 0;

                return {
                    id: p.ID,
                    title: p.Nombre,
                    price: price,
                    Precio: price, // Keep both for compatibility
                    brand: p.Marca,
                    category: p.Categoria,
                    condition: p.Estado,
                    description: p.Descripcion,
                    usage: p.Uso,
                    compatibleCars: compatibleCars,
                    image: imagePath,
                    rating: 4.5, // Default rating
                    reviews: Math.floor(Math.random() * 500) + 20, // Random reviews
                    ID: p.ID, // Keep for sorting
                    seller: {
                        id: p.Vendedor,
                        name: p.VendedorNombre ? `${p.VendedorNombre} ${p.VendedorApellido || ''}`.trim() : 'AutoParts Pro'
                    }
                };
            });

            // Apply discounts
            const needsDiscountRefresh = shouldRefreshDiscounts();
            let productsWithDiscounts;

            // Helper to check if discount map is valid for current products
            const isMapValid = (map, products) => {
                if (!map) return false;
                // Check if at least one current product exists in the map
                return products.some(p => map[p.id] !== undefined);
            };

            const storedDiscounts = typeof window !== 'undefined' ? localStorage.getItem('productDiscounts') : null;
            let discountMap = storedDiscounts ? JSON.parse(storedDiscounts) : null;

            // If we need refresh OR map is invalid/missing for current products -> Recalculate
            if (needsDiscountRefresh || !isMapValid(discountMap, transformedProducts)) {
                console.log('Refreshing discounts...');
                productsWithDiscounts = applyRandomDiscounts(transformedProducts);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('lastDiscountUpdate', Date.now().toString());
                }
            } else {
                // Restore discounts from localStorage
                productsWithDiscounts = transformedProducts.map(p => ({
                    ...p,
                    discount: discountMap[p.id] || 0,
                    discountedPrice: discountMap[p.id] ? Math.round(p.price * (1 - discountMap[p.id] / 100)) : undefined,
                    originalPrice: p.price
                }));
            }

            // Save discount map
            if (typeof window !== 'undefined') {
                const newMap = {};
                productsWithDiscounts.forEach(p => {
                    if (p.discount) newMap[p.id] = p.discount;
                });
                localStorage.setItem('productDiscounts', JSON.stringify(newMap));
            }

            setProducts(productsWithDiscounts);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load products from MySQL when client is ready
    useEffect(() => {
        if (!isClient) return;
        fetchProducts();
    }, [isClient]);

    // Set up interval to refresh discounts every 12 hours
    useEffect(() => {
        if (!isClient) return;

        const checkAndRefreshDiscounts = () => {
            if (shouldRefreshDiscounts()) {
                fetchProducts();
            }
        };

        // Check every minute if it's time to refresh
        const intervalId = setInterval(checkAndRefreshDiscounts, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [isClient]);

    const addProduct = async (productData) => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Refresh products list
                await fetchProducts();
                return { success: true, productId: data.productId };
            } else {
                return { success: false, error: data.error || 'Error al crear producto' };
            }
        } catch (error) {
            console.error('Error adding product:', error);
            return { success: false, error: 'Error de conexión' };
        }
    };

    const getProduct = (id) => {
        return products.find(p => p.id === parseInt(id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, getProduct, loading, refreshProducts: fetchProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}
