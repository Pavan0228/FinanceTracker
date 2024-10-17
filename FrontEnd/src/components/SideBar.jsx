import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard,
    CreditCard,
    PieChart,
    Wallet,
    HelpCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import image from "../assets/CroppedImage.png";

const SidebarItem = ({ icon: Icon, text, path, isActive, onClick }) => (
    <li
        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        onClick={onClick}
    >
        <Icon className="w-6 h-6 mr-3" />
        <span className="text-sm font-medium">{text}</span>
    </li>
);

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth); // Access user from Redux state

    const navigationItems = [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
        { icon: CreditCard, text: 'Daily', path: '/daily' },
        { icon: PieChart, text: 'Yearly', path: '/yearly' },
        { icon: Wallet, text: 'Download Data', path: '/download' },
        { icon: HelpCircle, text: 'Help', path: '/help' },
    ];

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div
            className={`bg-gray-800 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-28' : 'w-64'
                } flex flex-col`}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-700 gap-x-3">
                <img src={image} alt="" className='w-7' />
                {!isCollapsed && <h1 className="text-xl font-bold">PennyWise</h1>}
                <button
                    onClick={toggleSidebar}
                    className=" rounded-full hover:bg-gray-700 transition-colors duration-500"
                >
                    {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2 p-4">
                    {navigationItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            text={isCollapsed ? '' : item.text}
                            path={item.path}
                            isActive={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700">
                {!isCollapsed && (
                    <div className="flex items-center">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtXVyIMR7o6upYXFIPCqIv8KkxyUJs0q3WzQ&s"
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="text-sm font-medium">
                            {user?.name || 'Pavan'} 
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
