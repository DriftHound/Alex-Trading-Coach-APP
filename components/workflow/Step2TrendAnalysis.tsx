'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ChevronLeft, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
import { cn } from '@/lib/utils/cn';
import type { TrendValidationResponse } from '@/types/api';

const step2Schema = z.object({
    weeklyTrend: z.enum(['bullish', 'bearish', 'ranging'], {
        required_error: 'Please select weekly trend',
    }),
    dailyTrend: z.enum(['bullish', 'bearish', 'ranging'], {
        required_error: 'Please select daily trend',
    }),
    fourhTrend: z.enum(['bullish', 'bearish', 'ranging'], {
        required_error: 'Please select 4H trend',
    }),
    description: z.string().min(10, 'Please provide a detailed description (minimum 10 characters)'),
    chartContext: z.string().min(5, 'Please provide chart context (minimum 5 characters)'),
});

type Step2FormData = z.infer<typeof step2Schema>;

export default function Step2TrendAnalysis() {
    const { step1Data, step2Data, setStep2Data, setStep2Validation, nextStep, previousStep } = useWorkflowStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationResult, setValidationResult] = useState<TrendValidationResponse | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Step2FormData>({
        resolver: zodResolver(step2Schema),
        defaultValues: step2Data || undefined,
    });

    const watchedValues = watch();

    const onSubmit = async (data: Step2FormData) => {
        setIsSubmitting(true);

        try {
            const trendData = {
                pair: step1Data?.pair || '',
                ...data,
            };

            // Validate trend with Manus API
            const result = await workflowAPI.validateTrend(trendData);

            setValidationResult(result);
            setStep2Data(trendData);
            setStep2Validation(result);

            // Check validation gate
            if (result.recommendation === 'STAND_DOWN') {
                // Block progression - user must review feedback
                return;
            }

            // Auto-proceed if PROCEED, or allow manual proceed if CAUTION
            if (result.recommendation === 'PROCEED') {
                nextStep();
            }
        } catch (error) {
            console.error('Failed to validate trend:', error);
            alert('Failed to validate trend. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-success';
        if (confidence >= 60) return 'text-warning';
        return 'text-danger';
    };

    const getConfidenceBgColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-success/10 border-success';
        if (confidence >= 60) return 'bg-warning/10 border-warning';
        return 'bg-danger/10 border-danger';
    };

    const getRecommendationColor = (recommendation: string) => {
        if (recommendation === 'PROCEED') return 'text-success';
        if (recommendation === 'CAUTION') return 'text-warning';
        return 'text-danger';
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Trend Analysis</h2>
            <p className="text-gray-400 mb-6">
                Analyze trends across multiple timeframes to ensure alignment
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Trend Selection Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Weekly Trend */}
                    <div>
                        <label htmlFor="weeklyTrend" className="label">
                            Weekly Trend
                        </label>
                        <select
                            id="weeklyTrend"
                            className="input"
                            {...register('weeklyTrend')}
                        >
                            <option value="">-- Select --</option>
                            <option value="bullish">📈 Bullish</option>
                            <option value="bearish">📉 Bearish</option>
                            <option value="ranging">↔️ Ranging</option>
                        </select>
                        {errors.weeklyTrend && (
                            <p className="text-danger text-sm mt-1">{errors.weeklyTrend.message}</p>
                        )}
                    </div>

                    {/* Daily Trend */}
                    <div>
                        <label htmlFor="dailyTrend" className="label">
                            Daily Trend
                        </label>
                        <select
                            id="dailyTrend"
                            className="input"
                            {...register('dailyTrend')}
                        >
                            <option value="">-- Select --</option>
                            <option value="bullish">📈 Bullish</option>
                            <option value="bearish">📉 Bearish</option>
                            <option value="ranging">↔️ Ranging</option>
                        </select>
                        {errors.dailyTrend && (
                            <p className="text-danger text-sm mt-1">{errors.dailyTrend.message}</p>
                        )}
                    </div>

                    {/* 4H Trend */}
                    <div>
                        <label htmlFor="fourhTrend" className="label">
                            4H Trend
                        </label>
                        <select
                            id="fourhTrend"
                            className="input"
                            {...register('fourhTrend')}
                        >
                            <option value="">-- Select --</option>
                            <option value="bullish">📈 Bullish</option>
                            <option value="bearish">📉 Bearish</option>
                            <option value="ranging">↔️ Ranging</option>
                        </select>
                        {errors.fourhTrend && (
                            <p className="text-danger text-sm mt-1">{errors.fourhTrend.message}</p>
                        )}
                    </div>
                </div>

                {/* Trend Alignment Preview */}
                {watchedValues.weeklyTrend && watchedValues.dailyTrend && watchedValues.fourhTrend && (
                    <div className={cn(
                        'p-4 rounded-lg border-2',
                        watchedValues.weeklyTrend === watchedValues.dailyTrend &&
                            watchedValues.dailyTrend === watchedValues.fourhTrend
                            ? 'bg-success/10 border-success'
                            : 'bg-warning/10 border-warning'
                    )}>
                        <div className="flex items-center gap-2">
                            {watchedValues.weeklyTrend === watchedValues.dailyTrend &&
                                watchedValues.dailyTrend === watchedValues.fourhTrend ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-success" />
                                    <p className="text-success font-medium">
                                        ✓ Perfect trend alignment across all timeframes
                                    </p>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-5 h-5 text-warning" />
                                    <p className="text-warning font-medium">
                                        ⚠️ Mixed trend signals - proceed with caution
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div>
                    <label htmlFor="description" className="label">
                        Trend Analysis Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        className="input"
                        placeholder="Describe the trend alignment across timeframes. Include observations about higher highs/lows, trend strength, etc."
                        {...register('description')}
                    />
                    {errors.description && (
                        <p className="text-danger text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Chart Context */}
                <div>
                    <label htmlFor="chartContext" className="label">
                        Chart Context
                    </label>
                    <input
                        id="chartContext"
                        type="text"
                        className="input"
                        placeholder="e.g., Price above 20/50/200 EMAs on all timeframes"
                        {...register('chartContext')}
                    />
                    {errors.chartContext && (
                        <p className="text-danger text-sm mt-1">{errors.chartContext.message}</p>
                    )}
                </div>

                {/* Validation Result Display */}
                {validationResult && (
                    <div className={cn(
                        'p-6 rounded-lg border-2',
                        getConfidenceBgColor(validationResult.confidence)
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">AI Validation Result</h3>
                            <div className={cn(
                                'text-3xl font-bold',
                                getConfidenceColor(validationResult.confidence)
                            )}>
                                {validationResult.confidence}%
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Feedback:</p>
                                <p className="text-gray-200">{validationResult.feedback}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-1">Recommendation:</p>
                                <p className={cn(
                                    'text-lg font-semibold',
                                    getRecommendationColor(validationResult.recommendation)
                                )}>
                                    {validationResult.recommendation}
                                </p>
                            </div>

                            {validationResult.warnings.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <p className="text-sm text-gray-400">Warnings:</p>
                                    {validationResult.warnings.map((warning, idx) => (
                                        <p key={idx} className="text-sm text-warning flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            {warning}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {validationResult.recommendation === 'STAND_DOWN' && (
                                <div className="alert-danger mt-4">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">🛑 STAND DOWN - Cannot Proceed</p>
                                        <p className="text-sm mt-1">
                                            The trend analysis does not meet Alex's criteria. Please review the feedback and adjust your analysis.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={previousStep}
                        className="btn-secondary"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || validationResult?.recommendation === 'STAND_DOWN'}
                        className={
                            isSubmitting || validationResult?.recommendation === 'STAND_DOWN'
                                ? 'btn-disabled'
                                : 'btn-primary'
                        }
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Validating trend...
                            </span>
                        ) : validationResult?.recommendation === 'PROCEED' ? (
                            <span className="flex items-center gap-2">
                                Continue to AOI Mapping
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Validate Trend
                                <TrendingUp className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </div>

                {validationResult?.recommendation === 'CAUTION' && (
                    <div className="alert-warning">
                        <AlertTriangle className="w-5 h-5" />
                        <p>You may proceed with caution. Review the warnings before continuing.</p>
                    </div>
                )}
            </form>
        </div>
    );
}
