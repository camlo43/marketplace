import { useState } from 'react';
import Button from './Button';

export default function CheckoutForm({ onComplete, onCancel, total }) {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        phone: '',
        paymentMethod: 'credit', // 'credit' or 'debit'
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        installments: '1'
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.zipCode) newErrors.zipCode = 'Zip Code is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';

        if (!formData.cardNumber) newErrors.cardNumber = 'Card Number is required';
        else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid Card Number';

        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry Date is required';
        if (!formData.cvv) newErrors.cvv = 'CVV is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            onComplete(formData);
        }, 2000);
    };

    return (
        <div className="animate-fade-in" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '1rem' }}>
                Checkout Details
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Shipping Information */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--gray-800)' }}>Shipping Information</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.fullName ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                placeholder="John Doe"
                            />
                            {errors.fullName && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.fullName}</span>}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.address ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                placeholder="123 Main St"
                            />
                            {errors.address && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.address}</span>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.city ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                    placeholder="New York"
                                />
                                {errors.city && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.city}</span>}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Zip Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.zipCode ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                    placeholder="10001"
                                />
                                {errors.zipCode && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.zipCode}</span>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.phone ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                placeholder="(555) 123-4567"
                            />
                            {errors.phone && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.phone}</span>}
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--gray-800)' }}>Payment Details</h3>

                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="credit"
                                checked={formData.paymentMethod === 'credit'}
                                onChange={handleChange}
                            />
                            Credit Card
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="debit"
                                checked={formData.paymentMethod === 'debit'}
                                onChange={handleChange}
                            />
                            Debit Card
                        </label>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem', padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '4px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                maxLength="19"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.cardNumber ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                placeholder="0000 0000 0000 0000"
                            />
                            {errors.cardNumber && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.cardNumber}</span>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    maxLength="5"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.expiryDate ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                    placeholder="MM/YY"
                                />
                                {errors.expiryDate && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.expiryDate}</span>}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    maxLength="4"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${errors.cvv ? 'var(--primary-red)' : 'var(--gray-300)'}` }}
                                    placeholder="123"
                                />
                                {errors.cvv && <span style={{ color: 'var(--primary-red)', fontSize: '0.875rem' }}>{errors.cvv}</span>}
                            </div>
                        </div>

                        {formData.paymentMethod === 'credit' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Installments (Cuotas)</label>
                                <select
                                    name="installments"
                                    value={formData.installments}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--gray-300)' }}
                                >
                                    <option value="1">1 Payment - ${total.toFixed(2)}</option>
                                    <option value="3">3 Payments - ${(total / 3).toFixed(2)} / month</option>
                                    <option value="6">6 Payments - ${(total / 6).toFixed(2)} / month</option>
                                    <option value="12">12 Payments - ${(total / 12).toFixed(2)} / month</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
                    <Button
                        type="button"
                        onClick={onCancel}
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--gray-800)',
                            border: '1px solid var(--gray-300)',
                            flex: 1,
                            padding: '1rem',
                            fontSize: '1rem'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        style={{
                            flex: 2,
                            padding: '1rem',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)'
                        }}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </Button>
                </div>
            </form>
        </div>
    );
}
