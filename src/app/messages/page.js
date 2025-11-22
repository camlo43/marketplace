'use client';

import { useMessages } from '../../context/MessageContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessagesPage() {
    const { conversations, openChat } = useMessages();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Mensajes</h1>

            {conversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--gray-600)' }}>No tienes mensajes aún.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            style={{
                                padding: '1.5rem',
                                border: '1px solid var(--gray-200)',
                                borderRadius: '8px',
                                backgroundColor: conv.unread ? 'var(--white)' : 'var(--gray-50)',
                                borderLeft: conv.unread ? '4px solid var(--primary-red)' : '1px solid var(--gray-200)',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={() => openChat(conv.id, conv.name)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = conv.unread ? 'var(--white)' : 'var(--gray-50)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {conv.name}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                    {new Date(conv.time).toLocaleDateString()} {new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p style={{
                                color: conv.unread ? 'var(--black)' : 'var(--gray-600)',
                                fontWeight: conv.unread ? '600' : '400',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {conv.lastMessage}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
