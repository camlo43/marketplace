'use client';

import { useState, useEffect, useRef } from 'react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function ChatWindow() {
    const { activeChat, isChatOpen, closeChat, sendMessage } = useMessages();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const success = await sendMessage(activeChat.userId, null, newMessage);
        if (success) {
            setNewMessage('');
        }
    };

    if (!isChatOpen || !activeChat || !user) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '450px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            border: '1px solid var(--gray-200)',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                backgroundColor: 'var(--primary-red)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem'
                    }}>
                        {activeChat.userName.charAt(0)}
                    </div>
                    <span>{activeChat.userName}</span>
                </div>
                <button
                    onClick={closeChat}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1.25rem'
                    }}
                >
                    ×
                </button>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: '#f9fafb'
            }}>
                {activeChat.messages && activeChat.messages.length > 0 ? (
                    activeChat.messages.map((msg) => {
                        const isMe = msg.senderId === user.id;
                        return (
                            <div key={msg.ID || msg.id} style={{
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMe ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    borderBottomRightRadius: isMe ? '2px' : '12px',
                                    borderBottomLeftRadius: isMe ? '12px' : '2px',
                                    backgroundColor: isMe ? 'var(--primary-red)' : 'white',
                                    color: isMe ? 'white' : 'var(--black)',
                                    boxShadow: isMe ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                                    border: isMe ? 'none' : '1px solid var(--gray-200)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4'
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--gray-500)',
                                    marginTop: '0.25rem',
                                    marginRight: isMe ? '0.25rem' : 0,
                                    marginLeft: isMe ? 0 : '0.25rem'
                                }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', color: 'var(--gray-500)', marginTop: '2rem', fontSize: '0.9rem' }}>
                        Inicia la conversación...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{
                padding: '1rem',
                borderTop: '1px solid var(--gray-200)',
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: 'white'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '20px',
                        border: '1px solid var(--gray-300)',
                        fontSize: '0.9rem',
                        outline: 'none'
                    }}
                />
                <Button type="submit" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </Button>
            </form>
        </div>
    );
}
