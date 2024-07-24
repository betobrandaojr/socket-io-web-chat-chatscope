import React, { useEffect, useState } from 'react';
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

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

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

    const sendMessage = () => {
        if (messageInput.trim()) {
            socket.emit('send_message', { message: messageInput });
            setMessages((prevMessages) => [...prevMessages, { text: messageInput, type: 'sent' }]);
            setMessageInput('');
        }
    };

    return (
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <Avatar src="https://via.placeholder.com/150" name="Beto" />
                    <ConversationHeader.Content userName="Beto" />
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
                />
            </ChatContainer>
        </MainContainer>
    );
};

export default ChatApp;