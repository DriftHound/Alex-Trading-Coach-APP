'use client';

import { useState } from 'react';
import MonitoringSettings from '@/components/settings/MonitoringSettings';
import ReportSettings from '@/components/settings/ReportSettings';
import { Settings as SettingsIcon, Bell, FileText } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'monitoring' | 'reports'>('monitoring');

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8" />
                    Settings
                </h1>
                <p className="text-gray-400">
                    Configure monitoring alerts and automated reports
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('monitoring')}
                    className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'monitoring'
                            ? 'text-primary-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        AOI Monitoring
                    </span>
                    {activeTab === 'monitoring' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'reports'
                            ? 'text-primary-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Weekly Reports
                    </span>
                    {activeTab === 'reports' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
                    )}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'monitoring' && <MonitoringSettings />}
            {activeTab === 'reports' && <ReportSettings />}
        </div>
    );
}
