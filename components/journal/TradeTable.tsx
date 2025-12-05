import { useState } from 'react';
import { Eye, Edit, BookOpen } from 'lucide-react';
import type { Trade } from '@/types/api';
import { formatDateTime, formatCurrency, formatRR, getPnLColor } from '@/lib/utils/formatters';
import OutcomeModal from './OutcomeModal';

interface TradeTableProps {
    trades: Trade[];
    onTradeUpdated: () => void;
}

export default function TradeTable({ trades, onTradeUpdated }: TradeTableProps) {
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [showOutcomeModal, setShowOutcomeModal] = useState(false);

    const handleEditOutcome = (trade: Trade) => {
        setSelectedTrade(trade);
        setShowOutcomeModal(true);
    };

    const handleModalClose = () => {
        setShowOutcomeModal(false);
        setSelectedTrade(null);
        onTradeUpdated();
    };

    if (trades.length === 0) {
        return (
            <div className="card text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold mb-2">No Trades Yet</h3>
                <p className="text-gray-400">
                    Start your first trade to begin building your journal
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pair</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Direction</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Entry</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Confluence</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">R:R</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">P&L</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade) => (
                                <tr
                                    key={trade.id}
                                    className="border-b border-gray-700/50 hover:bg-surface-hover transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm">
                                        {formatDateTime(trade.created_at)}
                                    </td>
                                    <td className="py-3 px-4 font-medium">{trade.pair}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${trade.direction === 'long'
                                            ? 'bg-long/10 text-long'
                                            : 'bg-short/10 text-short'
                                            }`}>
                                            {trade.direction.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono text-sm">
                                        {trade.entry.toFixed(5)}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className={`font-semibold ${trade.confluence_score >= 80 ? 'text-success' :
                                            trade.confluence_score >= 60 ? 'text-warning' :
                                                'text-danger'
                                            }`}>
                                            {trade.confluence_score}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right font-semibold text-success">
                                        {formatRR(trade.rr_ratio)}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${trade.status === 'open'
                                            ? 'bg-primary-500/10 text-primary-400'
                                            : trade.outcome === 'TP-hit'
                                                ? 'bg-success/10 text-success'
                                                : trade.outcome === 'SL-hit'
                                                    ? 'bg-danger/10 text-danger'
                                                    : 'bg-gray-700 text-gray-400'
                                            }`}>
                                            {trade.status === 'open' ? 'OPEN' : trade.outcome || 'CLOSED'}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-4 text-right font-semibold ${getPnLColor(trade.pnl || 0)}`}>
                                        {trade.pnl ? formatCurrency(trade.pnl) : '-'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {trade.status === 'open' && (
                                                <button
                                                    onClick={() => handleEditOutcome(trade)}
                                                    className="p-1 hover:bg-surface-active rounded transition-colors"
                                                    title="Log Outcome"
                                                >
                                                    <Edit className="w-4 h-4 text-primary-400" />
                                                </button>
                                            )}
                                            <button
                                                className="p-1 hover:bg-surface-active rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Outcome Modal */}
            {showOutcomeModal && selectedTrade && (
                <OutcomeModal
                    trade={selectedTrade}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
}
