import React, { useEffect, useState, useRef } from 'react';
import socket from '../utils/socket';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    ConversationHeader,
    Avatar,
    MessageList,
    Message,
    MessageInput
} from '@chatscope/chat-ui-kit-react';
import { conversations } from '../mockData';
import Sidebar from './Sidebar';

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const messageInputRef = useRef(null);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('_chat_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, { text: data.message, type: 'received' }]);
        });

        return () => {
            socket.off('connect');
            socket.off('_chat_message');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedConversation && messageInputRef.current) {
            messageInputRef.current.focus();
        }
    }, [selectedConversation]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            socket.emit('send_message', { message: messageInput });
            setMessages((prevMessages) => [...prevMessages, { text: messageInput, type: 'sent' }]);
            setMessageInput('');
        }
    };

    const handleUserClick = (plate) => {
        const conversation = conversations.find(conv => conv.plate === plate);
        setSelectedConversation(conversation);
        setMessages([]);
    };

    return (
        <MainContainer>
            <Sidebar handleUserClick={handleUserClick} />
            {selectedConversation && (
                <ChatContainer>
                    <ConversationHeader>
                        <Avatar src={selectedConversation.avatar} />
                        <ConversationHeader.Content userName={selectedConversation.plate} />
                    </ConversationHeader>
                    <MessageList>
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                model={{
                                    message: message.text,
                                    direction: message.type === 'sent' ? 'outgoing' : 'incoming',
                                }}
                            />
                        ))}
                    </MessageList>
                    <MessageInput
                        placeholder="Digite aqui"
                        value={messageInput}
                        onChange={(val) => setMessageInput(val)}
                        onSend={sendMessage}
                        attachButton={false}
                        ref={messageInputRef}
                    />
                </ChatContainer>
            )}
        </MainContainer>
    );
};

export default ChatApp;