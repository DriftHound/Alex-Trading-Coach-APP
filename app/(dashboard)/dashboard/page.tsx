'use client';

import Link from 'next/link';
import { TrendingUp, BookOpen, Target, Award, FileText } from 'lucide-react';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Confluence Checklist Coach</h1>
                <p className="text-gray-400">
                    Turn your confluence rules and set-and-forget plan into a checklist you actually follow.
                </p>
            </div>

            {/* Disclaimer Banner */}
            <DisclaimerBanner />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Win Rate</span>
                        <Award className="w-5 h-5 text-success" />
                    </div>
                    <div className="metric-value text-success">68.5%</div>
                </div>

                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Avg R:R</span>
                        <Target className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="metric-value">1:2.3</div>
                </div>

                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Total Trades</span>
                        <TrendingUp className="w-5 h-5 text-warning" />
                    </div>
                    <div className="metric-value">47</div>
                </div>

                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Total P&L</span>
                        <BookOpen className="w-5 h-5 text-success" />
                    </div>
                    <div className="metric-value text-success">$3,250</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/workflow" className="card-hover group">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">Start New Checklist</h3>
                            <p className="text-gray-400 text-sm">
                                Follow your pre-trade checklist before placing a trade
                            </p>
                        </div>
                    </div>
                </Link>

                <Link href="/journal" className="card-hover group">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">Trade Journal</h3>
                            <p className="text-gray-400 text-sm">
                                Review your completed checklists and trade outcomes
                            </p>
                        </div>
                    </div>
                </Link>

                <Link href="/disclaimer" className="card-hover group">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">Disclaimer & Risk</h3>
                            <p className="text-gray-400 text-sm">
                                Important legal information and risk warnings
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="card">
                    <p className="text-gray-400 text-center py-8">
                        No recent activity. Start a new checklist to get going!
                    </p>
                </div>
            </div>
        </div>
    );
}
