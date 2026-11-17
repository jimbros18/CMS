import { useState, useEffect } from 'react';
import React from 'react';
import './styles/app.css';
import SignIn from './SignIn';
import Sidebar from './Sidebar.jsx';
import Content from './Content.jsx';
import LoadingScreen from './LoadingScreen';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeKey, setActiveKey] = useState('clients');
    const [signingIn, setSigningIn] = useState(false);
    const [loggingOut, setloggingOut] = useState(false);
    const [userData, setUserData] = useState(pb.authStore.record);

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
            // If a token exists in local storage, PocketBase restores it automatically.
            // Validate it against the server (handles expiry / user deletion).
            if (pb.authStore.isValid) {
                await pb.collection('users').authRefresh();
                setUserData(pb.authStore.record);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            pb.authStore.clear();
            setIsAuthenticated(false);
        }
    };

    const OnSignedIn = async (record) => {
        // Called by SignIn after PocketBase sign-in succeeds.
        // Token is already stored in pb.authStore by the SDK.
        setUserData(record);
        setSigningIn(true);
    };

    const OnSignOut = async () => {
        console.log('🚪 OnSignOut called, current isAuthenticated:', isAuthenticated);
        pb.authStore.clear();
        setUserData(null);
        setloggingOut(true);
    };

    const handleItemClick = (key, func) => {
        setActiveKey(key);
        if (func && typeof func === 'function') {
            func();
        }
    };

    if (loading) return (
        <LoadingScreen
            variant="spinner"
            title="Setting things up…"
            subtitle="Wait sa kadali"
            duration={1000}
            onDone={() => setLoading(false)}
        />
    );

    if (signingIn) return (
        <LoadingScreen
            variant="bars"
            title="Setting things up…"
            subtitle="Loading your workspace"
            duration={2000}
            onDone={() => {
                setSigningIn(false);
                setIsAuthenticated(true);
            }}
        />
    );

    if (loggingOut) return (
        <LoadingScreen
            variant="bars"
            title="Wait a bit...."
            subtitle="Logging you out."
            duration={2000}
            onDone={() => {
                setloggingOut(false);
                setIsAuthenticated(false);
                setUserData(null);
            }}
        />
    );

    return isAuthenticated ? (
        <div className='flex flex-row w-full'>
            <Sidebar
                activeKey={activeKey}
                onItemClick={handleItemClick}
                OnSignOut={OnSignOut}
                userData={userData}
            />
            <Content activeKey={activeKey} userData={userData} />
        </div>
    ) : (
        <div className='w-full flex justify-center items-center h-screen bg-gray-900'>
            <SignIn onSignedIn={OnSignedIn} />
        </div>
    );
}