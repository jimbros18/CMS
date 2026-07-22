import { useState, useEffect } from 'react';
import React from 'react';
import './styles/app.css';
import SignIn from './SignIn';
import Sidebar from './Sidebar.jsx';
import Content from './Content.jsx';
import { SignInAPI, SignOutAPI, AuthCheck } from './API/server_api.js';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeKey, setActiveKey] = useState('clients');

    useEffect(() => {
        console.log('🔄 isAuthenticated changed to:', isAuthenticated);
        if (isAuthenticated) {
            console.log('✅ User authenticated');
        } else {
            console.log('❌ User not authenticated');
            setActiveKey('clients');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await AuthCheck();
            if (response && response.ok) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const OnSignIn = async ({ email, password }) => {
        try {
            const res = await SignInAPI({ email, password });
            if (res && res.status === 'success') {
                setIsAuthenticated(true);
            } else {
                alert(res?.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            alert(error.message || 'An error occurred during sign in');
        }
    };

    const OnSignOut = async () => {
        console.log('🚪 OnSignOut called, current isAuthenticated:', isAuthenticated);
        
        try {
            const response = await SignOutAPI();
            console.log('SignOut response:', response);
            
            if (response && response.ok) {
                setIsAuthenticated(false);
                setActiveKey('clients');
            } else {
                alert('Sign out failed');
            }
        } catch (error) {
            console.error('Sign out error:', error);
            alert('An error occurred during sign out');
        }
    };

     const handleItemClick = (key, func) => {
        setActiveKey(key); 
        if (func && typeof func === 'function') {
            func(); 
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? (
        <div className='flex flex-row w-full'>
            <Sidebar 
                activeKey={activeKey} 
                onItemClick={handleItemClick}
                OnSignOut={OnSignOut}
            />
            <Content activeKey={activeKey} />
        </div>
    ) : (
        <div className='flex justify-center items-center h-screen bg-gray-900'>
            <SignIn OnSignIn={OnSignIn} />
        </div>
    );
}