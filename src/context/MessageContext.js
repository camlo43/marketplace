'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null); // { userId, userName, messages }
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { user } = useAuth();

    // Poll for conversations list
    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            try {
                const res = await fetch(`/api/messages?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [user]);

    // Poll for active chat messages
    useEffect(() => {
        if (!user || !activeChat) return;

        const fetchChatHistory = async () => {
            try {
                const res = await fetch(`/api/messages/${activeChat.userId}?currentUserId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setActiveChat(prev => ({ ...prev, messages: data }));
                }
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
        const interval = setInterval(fetchChatHistory, 3000); // Poll every 3 seconds for active chat

        return () => clearInterval(interval);
    }, [user, activeChat?.userId]);

    const openChat = (userId, userName) => {
        setActiveChat({ userId, userName, messages: [] });
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setActiveChat(null);
    };

    const sendMessage = async (toUserId, productId, content) => {
        if (!user) return false;

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: user.id,
                    receiverId: toUserId,
                    productId,
                    message: content
                })
            });

            if (res.ok) {
                // Optimistic update if chat is open
                if (activeChat && activeChat.userId === toUserId) {
                    const newMessage = {
                        id: Date.now(), // Temp ID
                        senderId: user.id,
                        receiverId: toUserId,
                        text: content,
                        timestamp: new Date().toISOString(),
                        ProductoID: productId
                    };
                    setActiveChat(prev => ({
                        ...prev,
                        messages: [...prev.messages, newMessage]
                    }));
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    };

    return (
        <MessageContext.Provider value={{
            conversations,
            activeChat,
            isChatOpen,
            openChat,
            closeChat,
            sendMessage
        }}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessages() {
    return useContext(MessageContext);
}
