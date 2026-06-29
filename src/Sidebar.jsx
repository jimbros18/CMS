import React from 'react';

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
        label: 'Reports',
        icon: CheckSquare,
        key: 'reports',
        func: () => console.log('reports'),
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
        <aside className="w-[15%] text-slate-200 bg-gray-800">
            <div className='mx-5 my-5 rounded bg-gray-900'>
                    <div className="border-b border-slate-800 px-6 py-6">   
                        <h2 className="text-2xl font-semibold text-sky-300">CMS</h2>
                    </div>

                    <nav className="flex h-full flex-col overflow-y-auto py-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeKey === item.key;

                                return (
                                    <li key={item.key}>
                                        <button
                                            onClick={() => onItemClick?.(item.key, item.func)}
                                            className={`relative flex w-full items-center gap-4 px-5 py-4 text-sm transition
                                            ${
                                                isActive
                                                    ? 'bg-sky-600 text-white'
                                                    : 'text-slate-300 hover:bg-slate-800'
                                            }`}
                                        >
                                            {isActive && (
                                                <span className="absolute left-0 top-0 h-full w-1 bg-sky-400" />
                                            )}
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
            </div>  
        </aside>
    );
}
export default Sidebar;
