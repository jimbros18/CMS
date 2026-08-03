import { React, useState, useEffect }  from 'react';
import { Menu, Home, CheckSquare, CreditCard, Settings, LogOut, UserCircle,  X, ChevronDown } from 'lucide-react';

export default function Sidebar({ activeKey, onItemClick, OnSignOut, userData }) {
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
        label: 'Dashboard',
        icon: CreditCard,
        key: 'dashboard',
        func: () => console.log('Dashboard'),
    },
    {
        label: 'Settings',
        icon: Settings,
        key: 'settings',
        func: () => console.log('Settings'),
    },
     {
        label:'',
        icon: UserCircle,
        key: 'user',
        func: OnSignOut,
    }
];

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (!mobile) setIsOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
        <button
            className={`fixed top-4 left-4 z-50 p-3 bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300 md:hidden ${
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
            }`}
            onClick={() => setIsOpen(true)}
        >
            <Menu size={24} />
      </button>

        {isMobile && isOpen && (
            <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            />
        )}
            <aside 
                className={`
                    fixed md:relative z-50 text-slate-200 bg-gray-800 transition-all duration-300 ease-in-out
                    ${isMobile ? (
                        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    ) : 'translate-x-0'}
                        w-[280px] md:w-[15%] md:min-w-[200px] h-full
                    `}
                >
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
                                            {item.key === 'user' ? (
                                                <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800">
                                                    <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-medium">
                                                        {userData?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-white text-left">{userData?.username}</span>
                                                        <span className="text-xs text-slate-400">{userData?.role}</span>
                                                    </div>
                                                    <button className='px-2 py-2 '
                                                            // onClick={}
                                                    >
                                                    <ChevronDown size={25} className="ml-10 transition-transform duration-200 hover:bg-blue-500 hover: rounded-full hover:scale-110" />
                                                    </button>
                                                    
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => onItemClick?.(item.key, item.func)}
                                                    className={`relative flex w-full items-center gap-4 px-5 py-4 text-sm transition ${
                                                        isActive
                                                            ? 'bg-sky-600 text-white'
                                                            : 'text-slate-300 hover:bg-slate-800'
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-sky-400" />
                                                    )}
                                                    <Icon size={30} />
                                                    <span className="font-medium">{item.label}</span>
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                </div> 
            </aside>
        </>
    );
}

