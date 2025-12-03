'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User, Clock } from 'lucide-react';
import { getAlexTimeStatus } from '@/lib/utils/alexTime';
import { cn } from '@/lib/utils/cn';
import NotificationCenter from '@/components/layout/NotificationCenter';

export default function TopBar() {
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [alexTimeStatus, setAlexTimeStatus] = useState(getAlexTimeStatus());

    // Update Alex Time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setAlexTimeStatus(getAlexTimeStatus());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="h-16 bg-surface border-b border-gray-700 px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left side - Alex Time */}
            <div className="flex items-center gap-4">
                <div className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg',
                    alexTimeStatus.isAlexTime ? 'bg-success/10 border border-success' : 'bg-danger/10 border border-danger'
                )}>
                    <Clock className={cn(
                        'w-5 h-5',
                        alexTimeStatus.isAlexTime ? 'text-success' : 'text-danger'
                    )} />
                    <div>
                        <p className="text-xs text-gray-400">Alex Time</p>
                        <p className={cn(
                            'text-sm font-mono font-semibold',
                            alexTimeStatus.isAlexTime ? 'text-success' : 'text-danger'
                        )}>
                            {alexTimeStatus.currentTimeEST}
                        </p>
                    </div>
                    {alexTimeStatus.isAlexTime ? (
                        <span className="ml-2 text-xs text-success">
                            {alexTimeStatus.timeUntilEnd} left
                        </span>
                    ) : (
                        <span className="ml-2 text-xs text-danger">
                            {alexTimeStatus.timeUntilStart} until start
                        </span>
                    )}
                </div>
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-surface-hover rounded-lg transition-colors relative"
                    >
                        <Bell className="w-5 h-5" />
                        {/* Notification badge - will be dynamic */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                    </button>

                    {showNotifications && (
                        <NotificationCenter onClose={() => setShowNotifications(false)} />
                    )}
                </div>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-2 hover:bg-surface-hover rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface border border-gray-700 rounded-lg shadow-card overflow-hidden">
                            <div className="p-3 border-b border-gray-700">
                                <p className="text-sm font-medium">Trader</p>
                                <p className="text-xs text-gray-400">trader@example.com</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-surface-hover transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close menus */}
            {(showUserMenu || showNotifications) && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => {
                        setShowUserMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}
        </header>
    );
}
