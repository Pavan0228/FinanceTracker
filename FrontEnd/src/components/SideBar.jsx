import React, { useEffect, useState, memo } from "react";
import {Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    LayoutDashboard,
    CreditCard,
    PieChart,
    Download,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    X,
    Menu,
    PlusCircle,
} from 'lucide-react';

import image from "../assets/CroppedImage.png";
import { getUser } from "../store/authSlice";

// Profile Avatar Component
// Profile Avatar Component
const ProfileAvatar = memo(({ name, profile }) => {
    const initials = name
        ?.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    return (
        <div className="relative">
            <div className="w-9 h-9 rounded-full ring-2 ring-gray-700 ring-offset-2 ring-offset-gray-800 overflow-hidden bg-blue-500">
                {profile ? (
                    <img
                        src={profile}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.initials-fallback').style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="initials-fallback w-full h-full flex items-center justify-center text-white font-medium">
                        {initials}
                    </div>
                )}
            </div>
        </div>
    );
});


// Logo Component
const Logo = memo(({ isCollapsed }) => (
    <div className={`flex items-center transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-full justify-center' : 'gap-3'}`}>
        <div className="min-w-[32px] h-8 flex items-center justify-center">
            <img
                src={image}
                alt="Logo"
                className={`transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'} 
                        object-contain hover:scale-105`}
            />
        </div>
        <h1
            className={`text-xl font-bold text-white
                    bg-clip-text transition-all duration-300 ease-in-out 
                    overflow-hidden whitespace-nowrap
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
        >
            PennyWise
        </h1>
    </div>
));

// Memoized SidebarItem component
const SidebarItem = memo(({ icon: Icon, text, path, isActive, onClick, isCollapsed }) => (
    <li
        className={`flex items-center p-3 rounded-lg cursor-pointer
                transition-all duration-300 ease-in-out transform
                ${isActive
                ? "bg-gray-700 text-white shadow-lg translate-x-2"
                : "text-gray-400 hover:bg-gray-700/50 hover:text-white hover:translate-x-2"
            }
                ${isCollapsed ? 'justify-center' : ''}`}
        onClick={onClick}
    >
        <Icon className={`w-6 h-6 transition-all duration-300 ease-in-out
                ${!isCollapsed ? 'mr-3' : 'transform hover:scale-110'}`}
        />
        <span
            className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
        >
            {text}
        </span>
    </li>
));

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const navigationItems = [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
        { icon: CreditCard, text: 'Daily', path: '/daily' },
        { icon: PieChart, text: 'Yearly', path: '/yearly' },
        { icon: PlusCircle, text: 'Input Finance', path: '/input' },
        { icon: Download, text: 'Download Data', path: '/download' },
        { icon: HelpCircle, text: 'Help', path: '/help' },
    ];

    useEffect(() => {
        const userId = localStorage.getItem("uid");
        if (userId) {
            dispatch(getUser({ userId }))
                .then(user => setUserData(user))
                .catch(console.error);
        }
    }, []);

    // Close mobile sidebar on navigation
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    const MobileToggleButton = () => (
        <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden fixed top-1 left-4 z-20 p-2 rounded-lg bg-gray-800-80 
                    hover:bg-gray-700 transition-all duration-300 ease-in-out transform 
                    hover:scale-105 active:scale-95 shadow-lg border border-white-10"
        >
            <Menu className="w-4 h-4  text-white" />
        </button>
    );

    return (
        <>
            <MobileToggleButton />

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static bg-gradient-to-b from-gray-900 to-gray-800 
                        text-white h-screen transition-all duration-300 ease-in-out 
                        border-r border-gray-700/50 z-40
                        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-[280px]`}
            >
                {/* Mobile close button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute right-4 top-4 p-2 rounded-lg 
                            hover:bg-gray-700 transition-all duration-300"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>

                {/* Desktop collapse button */}
                <button
                    onClick={() => setIsCollapsed(prev => !prev)}
                    className="hidden lg:block absolute -right-3 top-6 p-1.5 rounded-full 
                            bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out 
                            transform hover:scale-105 active:scale-95 shadow-lg border border-gray-700"
                >
                    <ChevronLeft
                        className={`w-4 h-4 text-gray-400 transition-all duration-300 
                                ease-in-out transform ${isCollapsed ? 'rotate-180' : ''}`}
                    />
                </button>

                <div className="flex items-center p-4 border-b border-gray-700/50">
                    <Logo isCollapsed={isCollapsed} />
                </div>

                <nav className="flex-grow pt-4 overflow-hidden">
                    <ul className="space-y-2 px-3">
                        {navigationItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                text={item.text}
                                path={item.path}
                                isActive={location.pathname === item.path}
                                onClick={() => handleNavigate(item.path)}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </ul>
                </nav>
                    <div className="p-4 border-t border-gray-700/50" >
                <Link to="/user">
                        <div className={`flex items-center transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                            <ProfileAvatar name={userData?.payload?.name || "User"} profile={userData?.payload?.profile} />
                            <div className={`flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                <span className="text-lg capitalize font-medium text-gray-200 whitespace-nowrap">
                                    {userData?.payload?.name || "User"}
                                </span>
                            </div>
                        </div>
                </Link>
                    </div>
            </div>
        </>
    );
};

export default memo(Sidebar);