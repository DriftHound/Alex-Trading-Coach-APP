'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { monitoringAPI } from '@/lib/api/workflow';
import { getSessionTimeStatus } from '@/lib/utils/sessionTime';
import { formatDateTime } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

export default function MonitoringSettings() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [activeAOIs, setActiveAOIs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const sessionTime = getSessionTimeStatus();

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const status = await monitoringAPI.getAOIMonitoringStatus();
            setIsEnabled(status.monitoring_enabled);
            setActiveAOIs(status.active_aois);
        } catch (error) {
            console.error('Failed to load monitoring status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async () => {
        setIsSaving(true);
        try {
            await monitoringAPI.updateAOIMonitoring({
                enabled: !isEnabled,
                user_id: 'current_user', // This would come from auth context
            });
            setIsEnabled(!isEnabled);
        } catch (error) {
            console.error('Failed to update monitoring:', error);
            alert('Failed to update monitoring settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="card text-center py-12">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-gray-400">Loading monitoring settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="card">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary-400" />
                            Enable AOI Approach Alerts
                        </h3>
                        <p className="text-sm text-gray-400">
                            Get notified when price approaches your marked Areas of Interest during Optimal Trading Hours
                        </p>
                    </div>
                    <button
                        onClick={handleToggle}
                        disabled={isSaving}
                        className={cn(
                            'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                            isEnabled ? 'bg-success' : 'bg-gray-600',
                            isSaving && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <span
                            className={cn(
                                'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                                isEnabled ? 'translate-x-7' : 'translate-x-1'
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Optimal Trading Hours Warning */}
            {isEnabled && !sessionTime.isOptimalSession && (
                <div className="alert-warning">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Currently Outside Optimal Trading Hours</p>
                        <p className="text-sm mt-1">
                            Alerts will only fire during the London session (1:00-10:30 AM EST).
                            Next session starts in {sessionTime.timeUntilStart}.
                        </p>
                    </div>
                </div>
            )}

            {isEnabled && sessionTime.isOptimalSession && (
                <div className="alert-success">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Monitoring Active</p>
                        <p className="text-sm mt-1">
                            AOI alerts are enabled and Optimal Trading Hours are active. {sessionTime.timeUntilEnd} remaining in session.
                        </p>
                    </div>
                </div>
            )}

            {/* Active AOIs Table */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Active AOIs Being Monitored</h3>

                {activeAOIs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No active AOIs</p>
                        <p className="text-sm mt-1">
                            Complete Step 3 of the workflow to create monitored AOIs
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pair</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Description</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeAOIs.map((aoi) => (
                                    <tr key={aoi.id} className="border-b border-gray-700/50">
                                        <td className="py-3 px-4 font-medium">{aoi.pair}</td>
                                        <td className="py-3 px-4 text-sm text-gray-400">{aoi.aoi_type}</td>
                                        <td className="py-3 px-4 text-sm">{aoi.description}</td>
                                        <td className="py-3 px-4 text-sm text-gray-400">
                                            {formatDateTime(aoi.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="card bg-primary-500/5 border-primary-500/20">
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                        <p className="font-semibold mb-1">How AOI Monitoring Works</p>
                        <ul className="space-y-1 text-gray-400">
                            <li>• Background job checks prices every 5 minutes during Optimal Trading Hours</li>
                            <li>• You'll receive a notification when price is within 10 pips of your AOI</li>
                            <li>• Alerts only fire during London session (1:00-10:30 AM EST)</li>
                            <li>• AOIs are automatically archived after trade conclusion</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
