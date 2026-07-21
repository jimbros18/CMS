import { useState } from 'react';
import React from 'react';
import './styles/app.css';
import SignIn from './SignIn';
import Sidebar from './Sidebar.jsx';
import Content from './Content.jsx';
import { SignInAPI } from './API/server_api.js';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeKey, setActiveKey] = React.useState('clients');

    const handleItemClick = (key, func) => {
        setActiveKey(key);
        func();
    };

    const handleSignIn = async ({ email, password }) => {
        const res = await SignInAPI({ email, password });
        if (res.status === 'success') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid email or password');
        }
    };

    return isAuthenticated ? (
        <div className='flex flex-row w-full'>
            <Sidebar 
                activeKey={activeKey} 
                onItemClick={handleItemClick} 
            />
            <Content 
                activeKey={activeKey} 
            />
        </div>
    ):(
         <div className='flex flex-row w-full justify-center items-center h-screen bg-gray-900'>
             <SignIn onSignIn={handleSignIn} />
         </div>
       
    );

}
