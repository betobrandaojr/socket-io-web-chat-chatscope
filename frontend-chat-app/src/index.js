import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/ChatApp.css';
import ChatApp from "./components/ChatApp";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChatApp />
    </React.StrictMode>
);