'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Calendar } from 'lucide-react';
import { monitoringAPI } from '@/lib/api/workflow';
import { formatDate } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

export default function ReportSettings() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [lastReportDate, setLastReportDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const status = await monitoringAPI.getWeeklyReportStatus();
            setIsEnabled(status.subscription_enabled);
            setLastReportDate(status.last_report_date || null);
        } catch (error) {
            console.error('Failed to load report status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async () => {
        setIsSaving(true);
        try {
            await monitoringAPI.updateWeeklyReport({
                enabled: !isEnabled,
                user_id: 'current_user', // This would come from auth context
            });
            setIsEnabled(!isEnabled);
        } catch (error) {
            console.error('Failed to update report settings:', error);
            alert('Failed to update report settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="card text-center py-12">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-gray-400">Loading report settings...</p>
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
                            <FileText className="w-5 h-5 text-primary-400" />
                            Receive Weekly Performance Report
                        </h3>
                        <p className="text-sm text-gray-400">
                            Get automated weekly summaries of your trading performance and AI coaching insights
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

            {/* Status Card */}
            {isEnabled && (
                <div className="alert-success">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Weekly Reports Enabled</p>
                        <p className="text-sm mt-1">
                            You'll receive a comprehensive performance report every Sunday at 8:00 PM EST
                        </p>
                    </div>
                </div>
            )}

            {/* Last Report Card */}
            {lastReportDate && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        Last Report Generated
                    </h3>
                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-2xl font-semibold text-primary-400">
                            {formatDate(lastReportDate)}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Your most recent weekly performance summary
                        </p>
                    </div>
                </div>
            )}

            {/* Report Contents Info */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-3">What's Included in Your Report</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">1</span>
                        </div>
                        <div>
                            <p className="font-medium">Performance Metrics</p>
                            <p className="text-sm text-gray-400">
                                Win rate, average R:R, total P&L, and trade count for the week
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">2</span>
                        </div>
                        <div>
                            <p className="font-medium">Best Performing Patterns</p>
                            <p className="text-sm text-gray-400">
                                Which setups (H&S, Engulfing, etc.) gave you the highest win rate
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">3</span>
                        </div>
                        <div>
                            <p className="font-medium">Session Analysis</p>
                            <p className="text-sm text-gray-400">
                                Performance breakdown by trading session (London vs. other times)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">4</span>
                        </div>
                        <div>
                            <p className="font-medium">Personalized Coaching Recommendations</p>
                            <p className="text-sm text-gray-400">
                                AI-generated insights based on your trading patterns and adherence to Alex's rules
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">5</span>
                        </div>
                        <div>
                            <p className="font-medium">Discipline Tracking</p>
                            <p className="text-sm text-gray-400">
                                Alerts if you violated the "Set & Forget" rule or minimum R:R requirements
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Info */}
            <div className="card bg-primary-500/5 border-primary-500/20">
                <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                        <p className="font-semibold mb-1">Report Schedule</p>
                        <p className="text-gray-400">
                            Reports are automatically generated every <strong>Sunday at 8:00 PM EST</strong> and
                            delivered via in-app notification. The report covers all trades from the previous 7 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
