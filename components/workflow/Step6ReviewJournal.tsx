'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
<<<<<<< HEAD
import { formatCurrency, formatRR, formatLotSize } from '@/lib/utils/formatters';
import ChecklistComponent from './ChecklistComponent';
=======
import { formatCurrency, formatRR, formatPrice, formatLotSize } from '@/lib/utils/formatters';
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27

export default function Step6ReviewJournal() {
    const router = useRouter();
    const {
        step1Data,
        step2Data,
        step3Data,
        step4Data,
        step5Data,
        step5Validation,
        step4Validation,
        resetWorkflow,
    } = useWorkflowStore();

<<<<<<< HEAD
    const [showChecklist, setShowChecklist] = useState(true);
=======
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiThesis, setAiThesis] = useState<string | null>(null);
    const [tradeId, setTradeId] = useState<string | null>(null);

<<<<<<< HEAD
    const handleChecklistComplete = () => {
        setShowChecklist(false);
    };

=======
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
    const handleLogTrade = async () => {
        if (!step1Data || !step5Data || !step5Validation) {
            alert('Missing required data. Please complete all previous steps.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Compile all workflow data
            const journalData = {
                pair: step1Data.pair,
                entry: 0, // This would come from actual chart analysis
<<<<<<< HEAD
                stopLoss: 0, // Calculated from stop_pips
                takeProfit: 0, // Calculated from target_pips
                positionSize: step5Validation.positionSize,
                confluenceScore: step4Validation?.confluenceScore || 0,
                direction: 'long' as const, // This would be determined from pattern analysis
                sessionData: step1Data,
                trendData: step2Data!,
                aoiData: step3Data!,
                patternData: step4Data!,
                riskData: step5Data,
=======
                stop_loss: 0, // Calculated from stop_pips
                take_profit: 0, // Calculated from target_pips
                position_size: step5Validation.position_size,
                confluence_score: step4Validation?.confluence_score || 0,
                direction: 'long' as const, // This would be determined from pattern analysis
                session_data: step1Data,
                trend_data: step2Data!,
                aoi_data: step3Data!,
                pattern_data: step4Data!,
                risk_data: step5Data,
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
            };

            // Create journal entry
            const result = await workflowAPI.createJournalEntry(journalData);

<<<<<<< HEAD
            setAiThesis(result.aiThesis);
            setTradeId(result.tradeId);
=======
            setAiThesis(result.ai_thesis);
            setTradeId(result.trade_id);
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
        } catch (error) {
            console.error('Failed to log trade:', error);
            alert('Failed to log trade. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartNewTrade = () => {
        resetWorkflow();
        router.push('/workflow');
    };

    const handleGoToJournal = () => {
        resetWorkflow();
        router.push('/journal');
    };

<<<<<<< HEAD
    // Show success screen after trade is logged
=======
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
    if (aiThesis && tradeId) {
        return (
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-semibold mb-2">Trade Logged Successfully!</h2>
                <p className="text-gray-400 mb-6">
                    Your trade has been recorded and analyzed by the AI coach
                </p>

                {/* AI Thesis */}
                <div className="card text-left mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary-400" />
                        AI-Generated Trade Thesis
                    </h3>
                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {aiThesis}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleStartNewTrade}
                        className="btn-primary flex items-center gap-2"
                    >
                        <TrendingUp className="w-5 h-5" />
                        Start New Trade
                    </button>
                    <button
                        onClick={handleGoToJournal}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <BookOpen className="w-5 h-5" />
                        View Journal
                    </button>
                </div>
            </div>
        );
    }

<<<<<<< HEAD
    // Show checklist first (Gate 3)
    if (showChecklist) {
        return <ChecklistComponent onComplete={handleChecklistComplete} />;
    }

    // Show trade review after checklist is complete
=======
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Review & Journal Entry</h2>
            <p className="text-gray-400 mb-6">
                Review your complete trade setup before logging to your journal
            </p>

            {/* Trade Ticket */}
            <div className="card bg-gradient-to-br from-primary-600/10 to-primary-800/10 border-2 border-primary-600/30 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Trade Ticket</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Currency Pair</p>
                        <p className="text-lg font-semibold">{step1Data?.pair || 'N/A'}</p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Direction</p>
                        <p className="text-lg font-semibold text-long">LONG</p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Position Size</p>
                        <p className="text-lg font-semibold">
<<<<<<< HEAD
                            {step5Validation ? formatLotSize(step5Validation.positionSize) : 'N/A'} lots
=======
                            {step5Validation ? formatLotSize(step5Validation.position_size) : 'N/A'} lots
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
                        </p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Risk Amount</p>
                        <p className="text-lg font-semibold text-danger">
<<<<<<< HEAD
                            {step5Validation ? formatCurrency(step5Validation.riskAmount) : 'N/A'}
=======
                            {step5Validation ? formatCurrency(step5Validation.risk_amount) : 'N/A'}
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
                        </p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">R:R Ratio</p>
                        <p className="text-lg font-semibold text-success">
<<<<<<< HEAD
                            {step5Validation ? formatRR(step5Validation.rrRatio) : 'N/A'}
=======
                            {step5Validation ? formatRR(step5Validation.rr_ratio) : 'N/A'}
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
                        </p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Potential Profit</p>
                        <p className="text-lg font-semibold text-success">
<<<<<<< HEAD
                            {step5Validation ? formatCurrency(step5Validation.potentialProfit) : 'N/A'}
=======
                            {step5Validation ? formatCurrency(step5Validation.potential_profit) : 'N/A'}
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
                        </p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Confluence Score</p>
<<<<<<< HEAD
                        <p className={`text-lg font-semibold ${step4Validation && step4Validation.confluenceScore >= 80 ? 'text-success' :
                                step4Validation && step4Validation.confluenceScore >= 60 ? 'text-warning' :
                                    'text-danger'
                            }`}>
                            {step4Validation?.confluenceScore || 'N/A'}
=======
                        <p className={`text-lg font-semibold ${step4Validation && step4Validation.confluence_score >= 80 ? 'text-success' :
                                step4Validation && step4Validation.confluence_score >= 60 ? 'text-warning' :
                                    'text-danger'
                            }`}>
                            {step4Validation?.confluence_score || 'N/A'}
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
                        </p>
                    </div>

                    <div className="bg-background-secondary p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Session</p>
                        <p className="text-lg font-semibold">
<<<<<<< HEAD
                            {step1Data?.isAlexTime ? '✓ Alex Time' : '⚠️ Off Hours'}
=======
                            {step1Data?.is_alex_time ? '✓ Alex Time' : '⚠️ Off Hours'}
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
                        </p>
                    </div>
                </div>
            </div>

            {/* Setup Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="card">
                    <h4 className="font-semibold mb-2">Trend Analysis</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>Weekly: {step2Data?.weekly_trend || 'N/A'}</p>
                        <p>Daily: {step2Data?.daily_trend || 'N/A'}</p>
                        <p>4H: {step2Data?.four_hour_trend || 'N/A'}</p>
                    </div>
                </div>

                <div className="card">
<<<<<<< HEAD
                    <h4 className="font-semibold mb-2">AOI Details</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>Type: {step3Data?.aoi_type || 'N/A'}</p>
                        <p>Level: {step3Data?.price_level || 'N/A'}</p>
                        <p className="truncate">Description: {step3Data?.description || 'N/A'}</p>
                    </div>
                </div>

                <div className="card">
                    <h4 className="font-semibold mb-2">Pattern Details</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>Type: {step4Data?.pattern_type || 'N/A'}</p>
                        <p>Confluence: {step4Validation?.confluenceScore || 'N/A'}/100</p>
                        <p>Screenshot: {step4Data?.screenshot_url ? '✓ Uploaded' : '✗ None'}</p>
                    </div>
                </div>

                <div className="card">
                    <h4 className="font-semibold mb-2">Risk Management</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>Stop: {step5Data?.stop_pips || 'N/A'} pips</p>
                        <p>Target: {step5Data?.target_pips || 'N/A'} pips</p>
                        <p>Risk: {step5Data?.risk_percentage || 'N/A'}%</p>
                    </div>
                </div>
=======
                    <h4 className="font-semibold mb-2">Pattern Details</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p>Type: {step4Data?.pattern_type || 'N/A'}</p>
                        <p>Confluence: {step4Validation?.confluence_score || 'N/A'}/100</p>
                        <p>Screenshot: {step4Data?.screenshot_url ? '✓ Uploaded' : '✗ None'}</p>
                    </div>
                </div>
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
            </div>

            {/* Log Trade Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleLogTrade}
                    disabled={isSubmitting}
                    className={isSubmitting ? 'btn-disabled' : 'btn-success'}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Logging trade...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Log This Trade
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
