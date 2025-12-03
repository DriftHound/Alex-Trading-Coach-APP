'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, AlertTriangle } from 'lucide-react';
import type { Trade } from '@/types/api';
import { journalAPI } from '@/lib/api/workflow';

const outcomeSchema = z.object({
    actual_entry: z.string().optional(),
    actual_exit: z.string().min(1, 'Exit price is required'),
    outcome: z.enum(['SL-hit', 'TP-hit', 'manual-close']),
    notes: z.string().optional(),
});

type OutcomeFormData = z.infer<typeof outcomeSchema>;

interface OutcomeModalProps {
    trade: Trade;
    onClose: () => void;
}

export default function OutcomeModal({ trade, onClose }: OutcomeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [disciplineViolation, setDisciplineViolation] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OutcomeFormData>({
        resolver: zodResolver(outcomeSchema),
        defaultValues: {
            actual_entry: trade.entry.toString(),
        },
    });

    const onSubmit = async (data: OutcomeFormData) => {
        setIsSubmitting(true);
        setDisciplineViolation(null);

        try {
            const result = await journalAPI.logOutcome({
                trade_id: trade.id,
                actual_entry: data.actual_entry ? parseFloat(data.actual_entry) : undefined,
                actual_exit: parseFloat(data.actual_exit),
                outcome: data.outcome,
                notes: data.notes,
            });

            // Check for discipline violation (Phase 2 feature)
            if (result.discipline_violation && result.violation_message) {
                setDisciplineViolation(result.violation_message);
                // Still close after showing violation
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                onClose();
            }
        } catch (error) {
            console.error('Failed to log outcome:', error);
            alert('Failed to log outcome. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Log Trade Outcome</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Trade Info */}
                <div className="p-6 border-b border-gray-700 bg-background-secondary">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-gray-400">Pair</p>
                            <p className="font-semibold">{trade.pair}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Direction</p>
                            <p className="font-semibold">{trade.direction.toUpperCase()}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Entry</p>
                            <p className="font-mono">{trade.entry.toFixed(5)}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Position Size</p>
                            <p className="font-mono">{trade.position_size} lots</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="actual_entry" className="label">
                            Actual Entry Price (optional)
                        </label>
                        <input
                            id="actual_entry"
                            type="number"
                            step="0.00001"
                            className="input"
                            placeholder={trade.entry.toString()}
                            {...register('actual_entry')}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave blank if entry was as planned
                        </p>
                    </div>

                    <div>
                        <label htmlFor="actual_exit" className="label">
                            Actual Exit Price *
                        </label>
                        <input
                            id="actual_exit"
                            type="number"
                            step="0.00001"
                            className="input"
                            placeholder="1.08500"
                            {...register('actual_exit')}
                        />
                        {errors.actual_exit && (
                            <p className="text-danger text-sm mt-1">{errors.actual_exit.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="outcome" className="label">
                            Outcome *
                        </label>
                        <select
                            id="outcome"
                            className="input"
                            {...register('outcome')}
                        >
                            <option value="">-- Select outcome --</option>
                            <option value="TP-hit">TP Hit (Take Profit)</option>
                            <option value="SL-hit">SL Hit (Stop Loss)</option>
                            <option value="manual-close">Manual Close</option>
                        </select>
                        {errors.outcome && (
                            <p className="text-danger text-sm mt-1">{errors.outcome.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="notes" className="label">
                            Notes (optional)
                        </label>
                        <textarea
                            id="notes"
                            rows={3}
                            className="input"
                            placeholder="Any observations or lessons learned..."
                            {...register('notes')}
                        />
                    </div>

                    {/* Discipline Violation Alert */}
                    {disciplineViolation && (
                        <div className="alert-danger">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Discipline Violation Detected</p>
                                <p className="text-sm mt-1">{disciplineViolation}</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={isSubmitting ? 'btn-disabled flex-1' : 'btn-primary flex-1'}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Outcome'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
