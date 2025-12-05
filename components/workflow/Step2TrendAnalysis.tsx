'use client';

<<<<<<< HEAD
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
import { cn } from '@/lib/utils/cn';

const step2Schema = z.object({
    weekly_trend: z.enum(['bullish', 'bearish', 'ranging'], {
        required_error: 'Weekly trend is required',
    }),
    daily_trend: z.enum(['bullish', 'bearish', 'ranging'], {
        required_error: 'Daily trend is required',
    }),
    four_hour_trend: z.enum(['bullish', 'bearish', 'ranging'], {
        required_error: '4H trend is required',
    }),
});

type Step2FormData = z.infer<typeof step2Schema>;

interface TrendValidationResponse {
    valid: boolean;
    confidence: number;
    feedback: string;
    warnings: string[];
}

export default function Step2TrendAnalysis() {
    const { step1Data, step2Data, setStep2Data, nextStep } = useWorkflowStore();
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

    const watchedTrends = watch();

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'bullish':
                return 'text-long';
            case 'bearish':
                return 'text-short';
            case 'ranging':
                return 'text-warning';
            default:
                return 'text-gray-400';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'bullish':
                return '📈';
            case 'bearish':
                return '📉';
            case 'ranging':
                return '↔️';
            default:
                return '❓';
        }
    };

    const onSubmit = async (data: Step2FormData) => {
        setIsSubmitting(true);

        try {
            const trendData = {
                pair: step1Data?.pair || '',
                weeklyTrend: data.weekly_trend,
                dailyTrend: data.daily_trend,
                fourHourTrend: data.four_hour_trend,
            };

            // Validate trend with Manus API
            const result = await workflowAPI.validateTrend(trendData);

            setValidationResult(result);
            setStep2Data(data);

            // Proceed if valid
            if (result.valid) {
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

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Multi-Timeframe Trend Analysis</h2>
            <p className="text-gray-400 mb-6">
                Analyze trends across Weekly, Daily, and 4-Hour timeframes
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Trend Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Weekly Trend */}
                    <div className="card bg-background-secondary">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            <h3 className="font-semibold">Weekly Trend</h3>
                        </div>

                        <div className="space-y-2">
                            {(['bullish', 'bearish', 'ranging'] as const).map((trend) => (
                                <label
                                    key={trend}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                        watchedTrends.weekly_trend === trend
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        value={trend}
                                        {...register('weekly_trend')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-2xl">{getTrendIcon(trend)}</span>
                                    <span className={cn('font-medium capitalize', getTrendColor(trend))}>
                                        {trend}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.weekly_trend && (
                            <p className="text-danger text-sm mt-2">{errors.weekly_trend.message}</p>
                        )}
                    </div>

                    {/* Daily Trend */}
                    <div className="card bg-background-secondary">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            <h3 className="font-semibold">Daily Trend</h3>
                        </div>

                        <div className="space-y-2">
                            {(['bullish', 'bearish', 'ranging'] as const).map((trend) => (
                                <label
                                    key={trend}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                        watchedTrends.daily_trend === trend
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        value={trend}
                                        {...register('daily_trend')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-2xl">{getTrendIcon(trend)}</span>
                                    <span className={cn('font-medium capitalize', getTrendColor(trend))}>
                                        {trend}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.daily_trend && (
                            <p className="text-danger text-sm mt-2">{errors.daily_trend.message}</p>
                        )}
                    </div>

                    {/* 4-Hour Trend */}
                    <div className="card bg-background-secondary">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            <h3 className="font-semibold">4-Hour Trend</h3>
                        </div>

                        <div className="space-y-2">
                            {(['bullish', 'bearish', 'ranging'] as const).map((trend) => (
                                <label
                                    key={trend}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                                        watchedTrends.four_hour_trend === trend
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        value={trend}
                                        {...register('four_hour_trend')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-2xl">{getTrendIcon(trend)}</span>
                                    <span className={cn('font-medium capitalize', getTrendColor(trend))}>
                                        {trend}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.four_hour_trend && (
                            <p className="text-danger text-sm mt-2">{errors.four_hour_trend.message}</p>
                        )}
                    </div>
                </div>

                {/* Trend Alignment Indicator */}
                {watchedTrends.weekly_trend && watchedTrends.daily_trend && watchedTrends.four_hour_trend && (
                    <div className="card bg-primary-500/5 border-primary-500/20">
                        <h3 className="font-semibold mb-3">Trend Alignment</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-400 mb-2">Weekly → Daily → 4H</p>
                                <div className="flex items-center gap-2">
                                    <span className={cn('text-2xl', getTrendColor(watchedTrends.weekly_trend))}>
                                        {getTrendIcon(watchedTrends.weekly_trend)}
                                    </span>
                                    <span className="text-gray-500">→</span>
                                    <span className={cn('text-2xl', getTrendColor(watchedTrends.daily_trend))}>
                                        {getTrendIcon(watchedTrends.daily_trend)}
                                    </span>
                                    <span className="text-gray-500">→</span>
                                    <span className={cn('text-2xl', getTrendColor(watchedTrends.four_hour_trend))}>
                                        {getTrendIcon(watchedTrends.four_hour_trend)}
                                    </span>
                                </div>
                            </div>
                            {watchedTrends.weekly_trend === watchedTrends.daily_trend &&
                                watchedTrends.daily_trend === watchedTrends.four_hour_trend && (
                                    <div className="alert-success">
                                        <CheckCircle className="w-5 h-5" />
                                        <p className="font-medium">Perfect Alignment!</p>
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* Validation Result */}
                {validationResult && (
                    <div
                        className={cn(
                            'p-6 rounded-lg border-2',
                            validationResult.valid
                                ? 'bg-success/10 border-success'
                                : 'bg-danger/10 border-danger'
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Trend Confidence Score</h3>
                            <div className={cn('text-4xl font-bold', getConfidenceColor(validationResult.confidence))}>
                                {validationResult.confidence}%
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-background-secondary rounded-lg">
                                <p className="text-sm text-gray-400 mb-1">AI Feedback</p>
                                <p className="text-gray-200">{validationResult.feedback}</p>
                            </div>

                            {validationResult.warnings.length > 0 && (
                                <div className="space-y-2">
                                    {validationResult.warnings.map((warning, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-warning">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm">{warning}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TradingView Chart Placeholder */}
                <div className="card bg-background-secondary">
                    <div className="flex items-center justify-center h-96 text-gray-500">
                        <div className="text-center">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">TradingView Chart</p>
                            <p className="text-sm mt-2">Multi-timeframe analysis visualization</p>
                            <p className="text-xs mt-1 text-gray-600">
                                Integration ready for TradingView Lightweight Charts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !watchedTrends.weekly_trend || !watchedTrends.daily_trend || !watchedTrends.four_hour_trend}
                        className={
                            isSubmitting || !watchedTrends.weekly_trend || !watchedTrends.daily_trend || !watchedTrends.four_hour_trend
                                ? 'btn-disabled'
                                : 'btn-primary'
                        }
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Validating trends...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Validate Trends
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </div>
            </form>
=======
export default function Step2TrendAnalysis() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Trend Analysis</h2>
            <p className="text-gray-400 mb-6">
                Analyze trends across multiple timeframes with TradingView charts
            </p>
            <div className="alert-info">
                <p>Step 2 component - To be fully implemented with TradingView Lightweight Charts integration</p>
            </div>
>>>>>>> b412521f98b9358df050d281c89323c7aa594f27
        </div>
    );
}
