import React from 'react';
import { ConversationList, Conversation } from '@chatscope/chat-ui-kit-react';
import '../styles/Sidebar.css'; // Importar o arquivo de estilos

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ConversationList>
                <Conversation name="Chat 1" lastSenderName="User1" info="Last message" />
                <Conversation name="Chat 2" lastSenderName="User2" info="Last message" />
                {/* Adicione mais conversas conforme necessário */}
            </ConversationList>
        </div>
    );
};

export default Sidebar;