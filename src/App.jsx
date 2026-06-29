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
        <div className='flex flex-row w-full'>
            <Sidebar 
                activeKey={activeKey} 
                onItemClick={handleItemClick} 
            />
            <Content 
                activeKey={activeKey} 
            />
        </div>
    );
}

export default App;
