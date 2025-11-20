'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockProducts';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);

    // Initialize products from localStorage or mock data
    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            const parsedProducts = JSON.parse(storedProducts);
            // Filter out old mock products (assuming IDs < 10000 are mock) and keep user-created ones
            const userCreatedProducts = parsedProducts.filter(p => p.id > 10000);

            // Combine new mock products with user-created products
            const allProducts = [...mockProducts, ...userCreatedProducts];

            setProducts(allProducts);
            localStorage.setItem('products', JSON.stringify(allProducts));
        } else {
            setProducts(mockProducts);
            localStorage.setItem('products', JSON.stringify(mockProducts));
        }
    }, []);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now(), // Simple ID generation
            rating: 0,
            reviews: 0,
            dateListed: new Date().toISOString()
        };

        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
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
