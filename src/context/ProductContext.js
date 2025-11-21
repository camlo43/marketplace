'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';

const ProductContext = createContext();

// Discount percentages available
const DISCOUNT_OPTIONS = [5, 10, 15];
const DISCOUNT_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export function ProductProvider({ children }) {
    const [products, setProducts] = useState(mockProducts); // Initialize with mockProducts without discounts
    const [isClient, setIsClient] = useState(false);

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
            originalPrice: product.price
        }));

        // Randomly select products for discount
        const shuffled = [...updatedProducts].sort(() => Math.random() - 0.5);

        for (let i = 0; i < discountCount; i++) {
            const randomDiscount = DISCOUNT_OPTIONS[Math.floor(Math.random() * DISCOUNT_OPTIONS.length)];
            shuffled[i].discount = randomDiscount;
            shuffled[i].discountedPrice = Math.round(shuffled[i].price * (1 - randomDiscount / 100));
        }

        return shuffled.sort((a, b) => a.id - b.id); // Restore original order
    };

    // Check if we need to refresh discounts
    const shouldRefreshDiscounts = () => {
        if (typeof window === 'undefined') return false;

        const lastUpdate = localStorage.getItem('lastDiscountUpdate');
        if (!lastUpdate) return true;

        const timeSinceUpdate = Date.now() - parseInt(lastUpdate);
        return timeSinceUpdate >= DISCOUNT_INTERVAL;
    };

    // Initialize products from localStorage or mock data (client-side only)
    useEffect(() => {
        if (!isClient) return;

        const storedProducts = localStorage.getItem('products');
        const needsDiscountRefresh = shouldRefreshDiscounts();

        if (storedProducts && !needsDiscountRefresh) {
            // Use stored products with existing discounts
            const parsedProducts = JSON.parse(storedProducts);
            const userCreatedProducts = parsedProducts.filter(p => p.id > 10000);
            const allProducts = [...mockProducts, ...userCreatedProducts];

            // Restore discounts from stored data
            const productsWithDiscounts = allProducts.map(product => {
                const stored = parsedProducts.find(p => p.id === product.id);
                if (stored && stored.discount) {
                    return {
                        ...product,
                        discount: stored.discount,
                        discountedPrice: stored.discountedPrice,
                        originalPrice: stored.originalPrice || product.price
                    };
                }
                return product;
            });

            setProducts(productsWithDiscounts);
        } else {
            // Apply new random discounts
            const userCreatedProducts = storedProducts
                ? JSON.parse(storedProducts).filter(p => p.id > 10000)
                : [];
            const allProducts = [...mockProducts, ...userCreatedProducts];
            const productsWithDiscounts = applyRandomDiscounts(allProducts);

            setProducts(productsWithDiscounts);
            localStorage.setItem('products', JSON.stringify(productsWithDiscounts));
            localStorage.setItem('lastDiscountUpdate', Date.now().toString());
        }
    }, [isClient]);

    // Set up interval to refresh discounts every 12 hours
    useEffect(() => {
        if (!isClient) return;

        const checkAndRefreshDiscounts = () => {
            if (shouldRefreshDiscounts()) {
                const productsWithNewDiscounts = applyRandomDiscounts(products);
                setProducts(productsWithNewDiscounts);
                localStorage.setItem('products', JSON.stringify(productsWithNewDiscounts));
                localStorage.setItem('lastDiscountUpdate', Date.now().toString());
            }
        };

        // Check every minute if it's time to refresh
        const intervalId = setInterval(checkAndRefreshDiscounts, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [products, isClient]);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(), // Simple ID generation
            rating: 0,
            reviews: 0,
            dateListed: new Date().toISOString(),
            discount: 0,
            originalPrice: product.price
        };

        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);

        if (typeof window !== 'undefined') {
            localStorage.setItem('products', JSON.stringify(updatedProducts));
        }

        return newProduct;
    };

    const getProduct = (id) => {
        return products.find(p => p.id === parseInt(id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, getProduct }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}
