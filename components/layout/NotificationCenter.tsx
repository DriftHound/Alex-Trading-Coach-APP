'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { monitoringAPI } from '@/lib/api/workflow';
import type { Notification } from '@/types/api';
import { formatDateTime } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

interface NotificationCenterProps {
    onClose: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await monitoringAPI.getNotifications(20);
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await monitoringAPI.markNotificationRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await monitoringAPI.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'aoi_approach':
                return <TrendingUp className="w-5 h-5 text-warning" />;
            case 'discipline_violation':
                return <AlertTriangle className="w-5 h-5 text-danger" />;
            case 'weekly_report':
                return <FileText className="w-5 h-5 text-primary-400" />;
            default:
                return <CheckCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-96 bg-surface border border-gray-700 rounded-lg shadow-card max-h-[600px] flex flex-col z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                {notifications?.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary-400 hover:text-primary-300"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-400">
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No notifications</p>
                        <p className="text-sm mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    'p-4 hover:bg-surface-hover transition-colors cursor-pointer',
                                    !notification.read && 'bg-primary-500/5'
                                )}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className={cn(
                                                'text-sm font-medium',
                                                !notification.read && 'text-white'
                                            )}>
                                                {notification.title}
                                            </h4>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatDateTime(notification.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
