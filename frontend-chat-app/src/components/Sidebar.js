import React, { useState } from 'react';
import { ConversationList, Conversation, Avatar, Search } from '@chatscope/chat-ui-kit-react';
import '../styles/Sidebar.css';
import { loggedUser, conversations } from '../mockData';

const Sidebar = ({ handleUserClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);

    const filteredConversations = conversations.filter(conversation =>
        conversation.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onUserClick = (plate) => {
        const conversation = conversations.find(conv => conv.plate === plate);
        setSelectedConversation(conversation);
        handleUserClick(plate);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-search">
                <Search
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value)}
                    onClearClick={() => setSearchTerm('')}
                />
            </div>
            <div className="sidebar-spacer"></div>
            <ConversationList>
                {filteredConversations.map((conversation, index) => (
                    <Conversation
                        key={index}
                        name={conversation.plate}
                        lastSenderName={conversation.prefix}
                        info={conversation.info}
                        active={conversation.plate === (selectedConversation && selectedConversation.plate)}
                        onClick={() => onUserClick(conversation.plate)}
                    >
                        <Avatar src={conversation.avatar} name={conversation.plate} />
                        <div className="conversation-details">
                            <span className="conversation-name">{conversation.plate}</span>
                            <span className="conversation-prefix">{conversation.prefix}</span>
                            {conversation.unreadCount > 0 && (
                                <div className="unread-count">
                                    {conversation.unreadCount}
                                </div>
                            )}
                        </div>
                    </Conversation>
                ))}
            </ConversationList>
        </div>
    );
};

export default Sidebar;