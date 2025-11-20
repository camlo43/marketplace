'use client';

import { useMessages } from '../../context/MessageContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessagesPage() {
    const { getMessages, markAsRead } = useMessages();
    const { user } = useAuth();
    const router = useRouter();
    const messages = getMessages();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Messages</h1>

            {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--gray-600)' }}>No messages yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                padding: '1.5rem',
                                border: '1px solid var(--gray-200)',
                                borderRadius: '8px',
                                backgroundColor: msg.read ? 'var(--white)' : 'var(--gray-50)',
                                borderLeft: msg.read ? '1px solid var(--gray-200)' : '4px solid var(--primary-red)'
                            }}
                            onClick={() => markAsRead(msg.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>
                                    {msg.from.id === user.email ? `To: ${msg.to}` : `From: ${msg.from.name}`}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                    {new Date(msg.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                                Product ID: {msg.productId}
                            </div>
                            <p style={{ lineHeight: '1.5' }}>{msg.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
