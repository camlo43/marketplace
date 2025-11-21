'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const { user } = useAuth();

    // Mark when we're on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load messages from localStorage (client-side only)
    useEffect(() => {
        if (!isClient) return;

        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, [isClient]);

    const sendMessage = (toUserId, productId, content) => {
        if (!user) return false;

        const newMessage = {
            id: Date.now(),
            from: { id: user.email, name: user.name }, // Using email as ID for simplicity in this mock
            to: toUserId,
            productId,
            content,
            timestamp: new Date().toISOString(),
            read: false
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        if (typeof window !== 'undefined') {
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
        }

        return true;
    };

    const getMessages = () => {
        if (!user) return [];
        // Get messages where current user is sender or receiver
        return messages.filter(m => m.to === user.email || m.from.id === user.email)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const markAsRead = (messageId) => {
        const updatedMessages = messages.map(m =>
            m.id === messageId ? { ...m, read: true } : m
        );
        setMessages(updatedMessages);

        if (typeof window !== 'undefined') {
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
        }
    };

    return (
        <MessageContext.Provider value={{ messages, sendMessage, getMessages, markAsRead }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessages() {
    return useContext(MessageContext);
}
