'use client';

import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import TradeTable from '@/components/journal/TradeTable';
import CoachingDashboard from '@/components/journal/CoachingDashboard';
import { journalAPI } from '@/lib/api/workflow';
import type { Trade, JournalAnalysisResponse } from '@/types/api';

export default function JournalPage() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [analysis, setAnalysis] = useState<JournalAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'trades' | 'analytics'>('trades');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [tradesData, analysisData] = await Promise.all([
                journalAPI.getTrades(),
                journalAPI.getAnalysis(),
            ]);
            setTrades(tradesData.trades);
            setAnalysis(analysisData);
        } catch (error) {
            console.error('Failed to load journal data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Trade Journal & Analytics</h1>
                <p className="text-gray-400">
                    Track your performance and get AI-powered coaching insights
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('trades')}
                    className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'trades'
                            ? 'text-primary-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Trade History
                    </span>
                    {activeTab === 'trades' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'analytics'
                            ? 'text-primary-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Coaching Analytics
                    </span>
                    {activeTab === 'analytics' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />
                    )}
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="card text-center py-12">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-400">Loading journal data...</p>
                </div>
            ) : (
                <>
                    {activeTab === 'trades' && (
                        <TradeTable trades={trades} onTradeUpdated={loadData} />
                    )}

                    {activeTab === 'analytics' && analysis && (
                        <CoachingDashboard analysis={analysis} />
                    )}
                </>
            )}
        </div>
    );
}
