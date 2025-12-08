'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
import { formatCurrency, formatRR, formatLotSize } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';
import type { RiskCalculationResponse } from '@/types/api';

const step5Schema = z.object({
    account_size: z.string().min(1, 'Account size is required'),
    risk_percentage: z.string().min(1, 'Risk percentage is required'),
    stop_pips: z.string().min(1, 'Stop loss pips is required'),
    target_pips: z.string().min(1, 'Take profit pips is required'),
});

type Step5FormData = z.infer<typeof step5Schema>;

export default function Step5RiskCalculation() {
    const { step1Data, step5Data, setStep5Data, setStep5Validation, nextStep } = useWorkflowStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationResult, setValidationResult] = useState<RiskCalculationResponse | null>(
        step5Data ? {
            valid: false,
            rr_valid: false,
            rr_ratio: 0,
            position_size: 0,
            risk_amount: 0,
            potential_profit: 0
        } : null
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Step5FormData>({
        resolver: zodResolver(step5Schema),
        defaultValues: step5Data ? {
            account_size: step5Data.account_size.toString(),
            risk_percentage: step5Data.risk_percentage.toString(),
            stop_pips: step5Data.stop_pips.toString(),
            target_pips: step5Data.target_pips.toString(),
        } : undefined,
    });

    const watchedValues = watch();

    // Calculate live preview
    const calculatePreview = () => {
        const accountSize = parseFloat(watchedValues.account_size || '0');
        const riskPct = parseFloat(watchedValues.risk_percentage || '0');
        const stopPips = parseFloat(watchedValues.stop_pips || '0');
        const targetPips = parseFloat(watchedValues.target_pips || '0');

        if (!accountSize || !riskPct || !stopPips || !targetPips) return null;

        const riskAmount = accountSize * (riskPct / 100);
        const rrRatio = targetPips / stopPips;
        const pipValue = step1Data?.pair.includes('JPY') ? 9.09 : 10;
        const positionSize = riskAmount / (stopPips * pipValue);
        const potentialProfit = positionSize * targetPips * pipValue;

        return {
            riskAmount,
            rrRatio,
            positionSize,
            potentialProfit,
            isValid: rrRatio >= 2,
        };
    };

    const preview = calculatePreview();

    const onSubmit = async (data: Step5FormData) => {
        setIsSubmitting(true);

        try {
            const riskData = {
                account_size: parseFloat(data.account_size),
                risk_percentage: parseFloat(data.risk_percentage),
                stop_pips: parseFloat(data.stop_pips),
                target_pips: parseFloat(data.target_pips),
                pair: step1Data?.pair || '',
            };

            // Calculate risk with Manus API
            const result = await workflowAPI.calculateRisk(riskData);

            setValidationResult(result);
            setStep5Data(riskData);
            setStep5Validation(result);

            // Check if R:R is valid (minimum 1:2)
            if (!result.rr_valid) {
                // Don't proceed automatically - show blocking error
                return;
            }

            if (result.valid) {
                nextStep();
            }
        } catch (error) {
            console.error('Failed to calculate risk:', error);
            alert('Failed to calculate risk. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Risk & R:R Calculation</h2>
            <p className="text-gray-400 mb-6">
                Calculate your position size and verify minimum 1:2 R:R ratio
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="account_size" className="label">
                            Account Size ($)
                        </label>
                        <input
                            id="account_size"
                            type="number"
                            step="0.01"
                            className="input"
                            placeholder="10000"
                            {...register('account_size')}
                        />
                        {errors.account_size && (
                            <p className="text-danger text-sm mt-1">{errors.account_size.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="risk_percentage" className="label">
                            Risk Percentage (%)
                        </label>
                        <input
                            id="risk_percentage"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="5"
                            className="input"
                            placeholder="1"
                            {...register('risk_percentage')}
                        />
                        {errors.risk_percentage && (
                            <p className="text-danger text-sm mt-1">{errors.risk_percentage.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="stop_pips" className="label">
                            Stop Loss (pips)
                        </label>
                        <input
                            id="stop_pips"
                            type="number"
                            step="0.1"
                            className="input"
                            placeholder="20"
                            {...register('stop_pips')}
                        />
                        {errors.stop_pips && (
                            <p className="text-danger text-sm mt-1">{errors.stop_pips.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="target_pips" className="label">
                            Take Profit (pips)
                        </label>
                        <input
                            id="target_pips"
                            type="number"
                            step="0.1"
                            className="input"
                            placeholder="50"
                            {...register('target_pips')}
                        />
                        {errors.target_pips && (
                            <p className="text-danger text-sm mt-1">{errors.target_pips.message}</p>
                        )}
                    </div>
                </div>

                {/* Live Preview */}
                {preview && (
                    <div className={cn(
                        'p-6 rounded-lg border-2',
                        preview.isValid ? 'bg-success/10 border-success' : 'bg-danger/10 border-danger'
                    )}>
                        <h3 className="text-lg font-semibold mb-4">Calculation Preview</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-400">Risk Amount</p>
                                <p className="text-xl font-semibold">{formatCurrency(preview.riskAmount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Position Size</p>
                                <p className="text-xl font-semibold">{formatLotSize(preview.positionSize)} lots</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">R:R Ratio</p>
                                <p className={cn(
                                    'text-xl font-semibold',
                                    preview.isValid ? 'text-success' : 'text-danger'
                                )}>
                                    {formatRR(preview.rrRatio)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Potential Profit</p>
                                <p className="text-xl font-semibold text-success">
                                    {formatCurrency(preview.potentialProfit)}
                                </p>
                            </div>
                        </div>

                        {!preview.isValid && (
                            <div className="alert-danger">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">🛑 R:R is below 1:2 - NOT AN ALEX TRADE</p>
                                    <p className="text-sm mt-1">
                                        Minimum R:R ratio is 1:2. Adjust your stop loss or take profit targets.
                                    </p>
                                </div>
                            </div>
                        )}

                        {preview.isValid && (
                            <div className="alert-success">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <p>R:R ratio meets the minimum 1:2 requirement. This trade is valid!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Validation Result from API */}
                {validationResult && !validationResult.rr_valid && (
                    <div className="alert-danger">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">🛑 R:R Validation Failed</p>
                            <p className="text-sm mt-1">
                                The Manus API has confirmed this trade does not meet the minimum 1:2 R:R requirement.
                                You cannot proceed with this setup.
                            </p>
                        </div>
                    </div>
                )}

                {/* Chart Visualization Placeholder */}
                <div className="card bg-background-secondary">
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>TradingView Chart with Position Visualization</p>
                            <p className="text-sm mt-1">Entry, SL, and TP lines will be displayed here</p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !preview?.isValid}
                        className={isSubmitting || !preview?.isValid ? 'btn-disabled' : 'btn-primary'}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Calculating risk...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Calculate & Continue
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
