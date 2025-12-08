'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ChevronLeft, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
import { cn } from '@/lib/utils/cn';
import type { AOIValidationResponse } from '@/types/api';

const step3Schema = z.object({
    aoiType: z.enum(['Support', 'Resistance', 'Fibonacci', 'Trendline', 'Other'], {
        required_error: 'Please select AOI type',
    }),
    aoiLevel: z.string().min(1, 'Please enter the AOI price level'),
    description: z.string().min(10, 'Please provide a detailed description (minimum 10 characters)'),
    chartContext: z.string().min(5, 'Please provide chart context (minimum 5 characters)'),
});

type Step3FormData = z.infer<typeof step3Schema>;

export default function Step3AOIMapping() {
    const { step1Data, step3Data, setStep3Data, setStep3Validation, nextStep, previousStep } = useWorkflowStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationResult, setValidationResult] = useState<AOIValidationResponse | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Step3FormData>({
        resolver: zodResolver(step3Schema),
        defaultValues: step3Data || undefined,
    });

    const watchedAoiType = watch('aoiType');

    const onSubmit = async (data: Step3FormData) => {
        setIsSubmitting(true);

        try {
            const aoiData = {
                pair: step1Data?.pair || '',
                ...data,
            };

            // Validate AOI with Manus API
            const result = await workflowAPI.validateAOI(aoiData);

            setValidationResult(result);
            setStep3Data(aoiData);
            setStep3Validation(result);

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
            console.error('Failed to validate AOI:', error);
            alert('Failed to validate AOI. Please try again.');
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

    const getAOITypeIcon = (type: string) => {
        switch (type) {
            case 'Support':
                return '📊';
            case 'Resistance':
                return '🚧';
            case 'Fibonacci':
                return '📐';
            case 'Trendline':
                return '📈';
            default:
                return '📍';
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">AOI Mapping</h2>
            <p className="text-gray-400 mb-6">
                Mark your Area of Interest and validate confluence factors
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* AOI Type Selection */}
                <div>
                    <label htmlFor="aoiType" className="label">
                        AOI Type
                    </label>
                    <select
                        id="aoiType"
                        className="input"
                        {...register('aoiType')}
                    >
                        <option value="">-- Select AOI Type --</option>
                        <option value="Support">📊 Support</option>
                        <option value="Resistance">🚧 Resistance</option>
                        <option value="Fibonacci">📐 Fibonacci</option>
                        <option value="Trendline">📈 Trendline</option>
                        <option value="Other">📍 Other</option>
                    </select>
                    {errors.aoiType && (
                        <p className="text-danger text-sm mt-1">{errors.aoiType.message}</p>
                    )}
                </div>

                {/* AOI Level Input */}
                <div>
                    <label htmlFor="aoiLevel" className="label">
                        AOI Price Level
                    </label>
                    <input
                        id="aoiLevel"
                        type="text"
                        className="input font-mono"
                        placeholder={step1Data?.pair?.includes('JPY') ? '110.500' : '1.08500'}
                        {...register('aoiLevel')}
                    />
                    {errors.aoiLevel && (
                        <p className="text-danger text-sm mt-1">{errors.aoiLevel.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Enter the price level for your {watchedAoiType || 'AOI'}
                    </p>
                </div>

                {/* AOI Type Preview */}
                {watchedAoiType && (
                    <div className="p-4 rounded-lg bg-primary-500/10 border-2 border-primary-500">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{getAOITypeIcon(watchedAoiType)}</span>
                            <div>
                                <p className="font-semibold text-primary-400">
                                    {watchedAoiType} Level Selected
                                </p>
                                <p className="text-sm text-gray-400">
                                    {watchedAoiType === 'Support' && 'Price level where buying pressure is expected'}
                                    {watchedAoiType === 'Resistance' && 'Price level where selling pressure is expected'}
                                    {watchedAoiType === 'Fibonacci' && 'Fibonacci retracement or extension level'}
                                    {watchedAoiType === 'Trendline' && 'Dynamic support or resistance trendline'}
                                    {watchedAoiType === 'Other' && 'Custom area of interest'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div>
                    <label htmlFor="description" className="label">
                        AOI Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        className="input"
                        placeholder="Describe why this AOI is significant. Include observations about prior touches, confluence factors, etc."
                        {...register('description')}
                    />
                    {errors.description && (
                        <p className="text-danger text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Chart Context */}
                <div>
                    <label htmlFor="chartContext" className="label">
                        Chart Context & Confluence
                    </label>
                    <input
                        id="chartContext"
                        type="text"
                        className="input"
                        placeholder="e.g., Confluence with 61.8% Fibonacci, previous support, round number"
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

                            {validationResult.confluenceFactors.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">Confluence Factors:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {validationResult.confluenceFactors.map((factor, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium"
                                            >
                                                ✓ {factor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                            The AOI placement does not meet your predefined criteria. Please review the feedback and adjust your AOI.
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
                                Validating AOI...
                            </span>
                        ) : validationResult?.recommendation === 'PROCEED' ? (
                            <span className="flex items-center gap-2">
                                Continue to Pattern Validation
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Validate AOI
                                <MapPin className="w-5 h-5" />
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
