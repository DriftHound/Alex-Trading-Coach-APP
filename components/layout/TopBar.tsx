'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, Clock } from 'lucide-react';
import { getAlexTimeStatus, formatAlexTime } from '@/lib/utils/alexTime';
import { logout, getCurrentUser } from '@/lib/api/client';
import NotificationCenter from './NotificationCenter';

export default function TopBar() {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [alexTime, setAlexTime] = useState(getAlexTimeStatus());
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Update Alex Time every minute
        const interval = setInterval(() => {
            setAlexTime(getAlexTimeStatus());
        }, 60000);

        // Get current user
        setCurrentUser(getCurrentUser());

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="h-16 bg-surface border-b border-gray-700 px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left: Alex Time Widget */}
            <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-400" />
                <div>
                    <p className="text-sm font-medium">
                        {alexTime.isAlexTime ? (
                            <span className="text-success">✓ Alex Time Active</span>
                        ) : (
                            <span className="text-danger">⚠️ Outside Alex Time</span>
                        )}
                    </p>
                    <p className="text-xs text-gray-400">{formatAlexTime()}</p>
                </div>
            </div>

            {/* Right: Notifications & User Menu */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-background-secondary rounded-lg transition-colors relative"
                    >
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                    </button>

                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 mt-2 z-50">
                                <NotificationCenter onClose={() => setShowNotifications(false)} />
                            </div>
                        </>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-2 hover:bg-background-secondary rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium hidden md:block">
                            {currentUser?.name || currentUser?.email || 'User'}
                        </span>
                    </button>

                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-surface border border-gray-700 rounded-lg shadow-xl z-50">
                                <div className="p-3 border-b border-gray-700">
                                    <p className="text-sm font-medium">
                                        {currentUser?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {currentUser?.email || ''}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary transition-colors flex items-center gap-2 text-danger"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
