import { useState } from 'react';
import React from 'react';
import './styles/app.css';
import Sidebar from './Sidebar.jsx';
import Content from './Content.jsx';

function App() {
    const [activeKey, setActiveKey] = React.useState('clients');

    const handleItemClick = (key, func) => {
        setActiveKey(key);
        func();
    };

    return (
        <>
            <Sidebar activeKey={activeKey} onItemClick={handleItemClick} />
            <main className="main-content">
                <Content activeKey={activeKey} />
            </main>
        </>
    );
}

export default App;
