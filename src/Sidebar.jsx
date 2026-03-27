import React from 'react';
import './styles/sidebar.css';

// Assuming these are your icon components (from lucide-react, heroicons, etc.)
import { Home, CheckSquare, CreditCard, Settings } from 'lucide-react';
// or whichever icon library you're using

const menuItems = [
    {
        label: 'Clients',
        icon: Home,
        key: 'clients',
        func: () => console.log('Clients'),
    },
    {
        label: 'Tasks',
        icon: CheckSquare,
        key: 'tasks',
        func: () => console.log('Tasks'),
    },
    {
        label: 'Payments',
        icon: CreditCard,
        key: 'payments',
        func: () => console.log('Payments'),
    },
    {
        label: 'Settings',
        icon: Settings,
        key: 'settings',
        func: () => console.log('Settings'),
    },
];

function Sidebar({ activeKey, onItemClick }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>CMS</h2>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeKey === item.key;

                        return (
                            <li key={item.key}>
                                <button
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() =>
                                        onItemClick?.(item.key, item.func)
                                    }
                                    type="button"
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
