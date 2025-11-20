'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function SellPage() {
    const { addProduct } = useProducts();
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        brand: '',
        category: '',
        condition: 'New',
        compatibleCars: '',
        usage: '',
        description: '',
        images: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        // Mock image upload
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to sell items.');
            router.push('/login');
            return;
        }

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            seller: {
                id: user.email,
                name: user.name
            },
            image: formData.images.length > 0 ? formData.images[0] : 'https://placehold.co/400x300?text=No+Image'
        };

        addProduct(productData);
        alert('Product listed successfully!');
        router.push('/');
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                Sell Your Auto Parts
            </h1>

            <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--gray-100)', padding: '2rem', borderRadius: '8px' }}>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--gray-300)', paddingBottom: '0.5rem' }}>
                        Basic Information
                    </h3>
                    <Input
                        label="Product Title"
                        name="title"
                        placeholder="e.g. Brembo Brake Pads Front Set"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Price ($)"
                            name="price"
                            type="number"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-800)' }}>Condition</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '4px', fontSize: '1rem' }}
                            >
                                <option>New</option>
                                <option>Used</option>
                                <option>Refurbished</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--gray-300)', paddingBottom: '0.5rem' }}>
                        Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Brand"
                            name="brand"
                            placeholder="e.g. Bosch"
                            value={formData.brand}
                            onChange={handleChange}
                        />
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-800)' }}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '4px', fontSize: '1rem' }}
                            >
                                <option value="">Select Category</option>
                                <option>Brakes</option>
                                <option>Filters</option>
                                <option>Tires</option>
                                <option>Ignition</option>
                                <option>Fluids</option>
                                <option>Lighting</option>
                                <option>Audio</option>
                                <option>Engine</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Compatible Cars"
                        name="compatibleCars"
                        placeholder="e.g. Honda Civic 2016-2021, Toyota Corolla 2018"
                        value={formData.compatibleCars}
                        onChange={handleChange}
                    />

                    <Input
                        label="Usage / Application"
                        name="usage"
                        placeholder="e.g. Front wheel braking system"
                        value={formData.usage}
                        onChange={handleChange}
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-800)' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--gray-300)', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }}
                            placeholder="Describe your product in detail..."
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--gray-300)', paddingBottom: '0.5rem' }}>
                        Images
                    </h3>
                    <div style={{ border: '2px dashed var(--gray-300)', padding: '2rem', textAlign: 'center', borderRadius: '8px', backgroundColor: 'var(--white)' }}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" style={{ cursor: 'pointer', color: 'var(--primary-red)', fontWeight: 'bold' }}>
                            Click to Upload Images
                        </label>
                        <p style={{ color: 'var(--gray-800)', marginTop: '0.5rem' }}>or drag and drop here</p>
                    </div>

                    {formData.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto' }}>
                            {formData.images.map((src, index) => (
                                <div key={index} style={{ width: '100px', height: '100px', flexShrink: 0, border: '1px solid var(--gray-300)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <img src={src} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" style={{ width: '100%', fontSize: '1.1rem' }}>List Item</Button>

            </form>
        </div>
    );
}
