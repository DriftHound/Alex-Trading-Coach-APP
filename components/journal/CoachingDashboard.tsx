'use client';

import { Award, Target, TrendingUp, DollarSign, Lightbulb, BarChart3 } from 'lucide-react';
import type { JournalAnalysisResponse } from '@/types/api';
import { formatPercentage, formatRR, formatCurrency } from '@/lib/utils/formatters';

interface CoachingDashboardProps {
    analysis: JournalAnalysisResponse;
}

export default function CoachingDashboard({ analysis }: CoachingDashboardProps) {
    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Win Rate</span>
                        <Award className="w-5 h-5 text-success" />
                    </div>
                    <div className="metric-value text-success">
                        {formatPercentage(analysis.win_rate)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {analysis.total_trades} total trades
                    </p>
                </div>

                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Average R:R</span>
                        <Target className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="metric-value">
                        {formatRR(analysis.avg_rr)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Risk-to-reward ratio
                    </p>
                </div>

                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Total P&L</span>
                        <DollarSign className={`w-5 h-5 ${analysis.total_pnl >= 0 ? 'text-success' : 'text-danger'}`} />
                    </div>
                    <div className={`metric-value ${analysis.total_pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(analysis.total_pnl)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Net profit/loss
                    </p>
                </div>

                <div className="metric-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Total Trades</span>
                        <TrendingUp className="w-5 h-5 text-warning" />
                    </div>
                    <div className="metric-value">
                        {analysis.total_trades}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Logged trades
                    </p>
                </div>
            </div>

            {/* Phase 2: R:R Achievement Metrics */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-400" />
                    R:R Achievement Analysis
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Achieved 1:2 Minimum</span>
                            <span className="text-2xl font-bold text-success">
                                {formatPercentage(analysis.rr_achievement.min_1_2)}
                            </span>
                        </div>
                        <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-success"
                                style={{ width: `${analysis.rr_achievement.min_1_2}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Achieved 1:4 Target</span>
                            <span className="text-2xl font-bold text-primary-400">
                                {formatPercentage(analysis.rr_achievement.target_1_4)}
                            </span>
                        </div>
                        <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-400"
                                style={{ width: `${analysis.rr_achievement.target_1_4}%` }}
                            />
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                    Tracking how often you achieve the minimum 1:2 R:R vs. the ideal 1:4 target
                </p>
            </div>

            {/* Phase 2: Pattern Efficacy */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-400" />
                    Pattern Efficacy
                </h3>
                <div className="space-y-3">
                    {analysis.pattern_efficacy.map((pattern, idx) => (
                        <div key={idx} className="p-4 bg-background-secondary rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{pattern.pattern}</span>
                                <span className="text-sm text-gray-400">{pattern.count} trades</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Win Rate: </span>
                                    <span className={`font-semibold ${pattern.win_rate >= 70 ? 'text-success' :
                                            pattern.win_rate >= 50 ? 'text-warning' :
                                                'text-danger'
                                        }`}>
                                        {formatPercentage(pattern.win_rate)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Avg R:R: </span>
                                    <span className="font-semibold text-primary-400">
                                        {formatRR(pattern.avg_rr)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Phase 2: Session Efficacy */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-400" />
                    Session Performance
                </h3>
                <div className="space-y-3">
                    {analysis.session_efficacy.map((session, idx) => (
                        <div key={idx} className="p-4 bg-background-secondary rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{session.session}</span>
                                <span className="text-sm text-gray-400">{session.count} trades</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Win Rate: </span>
                                    <span className={`font-semibold ${session.win_rate >= 70 ? 'text-success' :
                                            session.win_rate >= 50 ? 'text-warning' :
                                                'text-danger'
                                        }`}>
                                        {formatPercentage(session.win_rate)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Avg R:R: </span>
                                    <span className="font-semibold text-primary-400">
                                        {formatRR(session.avg_rr)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Coaching Recommendations */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    AI Coaching Recommendations
                </h3>
                <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg flex items-start gap-3"
                        >
                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-white">{idx + 1}</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{recommendation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
