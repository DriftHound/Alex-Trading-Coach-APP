'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Target, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
import { cn } from '@/lib/utils/cn';

const step3Schema = z.object({
    aoi_type: z.enum(['support', 'resistance', 'supply', 'demand'], {
        required_error: 'AOI type is required',
    }),
    price_level: z.string().min(1, 'Price level is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

type Step3FormData = z.infer<typeof step3Schema>;

interface AOIValidationResponse {
    valid: boolean;
    rrPotential: number;
    feedback: string;
    warnings: string[];
}

export default function Step3AOIMapping() {
    const { step1Data, step3Data, setStep3Data, nextStep } = useWorkflowStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationResult, setValidationResult] = useState<AOIValidationResponse | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Step3FormData>({
        resolver: zodResolver(step3Schema),
        defaultValues: step3Data ? {
            aoi_type: step3Data.aoi_type,
            price_level: step3Data.price_level.toString(),
            description: step3Data.description,
        } : undefined,
    });

    const watchedType = watch('aoi_type');

    const getAOIColor = (type: string) => {
        switch (type) {
            case 'support':
            case 'demand':
                return 'text-long border-long';
            case 'resistance':
            case 'supply':
                return 'text-short border-short';
            default:
                return 'text-gray-400 border-gray-600';
        }
    };

    const getAOIIcon = (type: string) => {
        switch (type) {
            case 'support':
                return '📊';
            case 'resistance':
                return '📈';
            case 'supply':
                return '🔴';
            case 'demand':
                return '🟢';
            default:
                return '🎯';
        }
    };

    const getAOIDescription = (type: string) => {
        switch (type) {
            case 'support':
                return 'Price level where buying interest is strong enough to prevent further decline';
            case 'resistance':
                return 'Price level where selling interest is strong enough to prevent further advance';
            case 'supply':
                return 'Zone where sellers are likely to enter, creating downward pressure';
            case 'demand':
                return 'Zone where buyers are likely to enter, creating upward pressure';
            default:
                return '';
        }
    };

    const onSubmit = async (data: Step3FormData) => {
        setIsSubmitting(true);

        try {
            const aoiData = {
                pair: step1Data?.pair || '',
                aoiType: data.aoi_type,
                priceLevel: parseFloat(data.price_level),
                description: data.description,
            };

            // Validate AOI with Manus API
            const result = await workflowAPI.validateAOI(aoiData);

            setValidationResult(result);
            setStep3Data({
                aoi_type: data.aoi_type,
                price_level: parseFloat(data.price_level),
                description: data.description,
            });

            // Proceed if valid
            if (result.valid) {
                nextStep();
            }
        } catch (error) {
            console.error('Failed to validate AOI:', error);
            alert('Failed to validate AOI. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRRColor = (rr: number) => {
        if (rr >= 3) return 'text-success';
        if (rr >= 2) return 'text-warning';
        return 'text-danger';
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Area of Interest (AOI) Mapping</h2>
            <p className="text-gray-400 mb-6">
                Mark your key price levels and zones for trade entry
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* AOI Type Selection */}
                <div>
                    <label className="label mb-3">AOI Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(['support', 'resistance', 'supply', 'demand'] as const).map((type) => (
                            <label
                                key={type}
                                className={cn(
                                    'flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                                    watchedType === type
                                        ? 'border-primary-500 bg-primary-500/10'
                                        : 'border-gray-700 hover:border-gray-600'
                                )}
                            >
                                <input
                                    type="radio"
                                    value={type}
                                    {...register('aoi_type')}
                                    className="sr-only"
                                />
                                <span className="text-4xl">{getAOIIcon(type)}</span>
                                <span className={cn('font-semibold capitalize', getAOIColor(type))}>
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.aoi_type && (
                        <p className="text-danger text-sm mt-2">{errors.aoi_type.message}</p>
                    )}

                    {/* AOI Type Description */}
                    {watchedType && (
                        <div className="mt-4 p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg flex items-start gap-3">
                            <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300">{getAOIDescription(watchedType)}</p>
                        </div>
                    )}
                </div>

                {/* Price Level Input */}
                <div>
                    <label htmlFor="price_level" className="label">
                        Price Level
                    </label>
                    <input
                        id="price_level"
                        type="number"
                        step="0.00001"
                        className="input"
                        placeholder="1.08500"
                        {...register('price_level')}
                    />
                    {errors.price_level && (
                        <p className="text-danger text-sm mt-1">{errors.price_level.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Enter the exact price level for your {watchedType || 'AOI'}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="label">
                        AOI Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        className="input"
                        placeholder="Describe why this level is significant (e.g., previous swing high, Fibonacci 61.8%, institutional order block, etc.)"
                        {...register('description')}
                    />
                    {errors.description && (
                        <p className="text-danger text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

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
                            <h3 className="text-lg font-semibold">R:R Potential</h3>
                            <div className={cn('text-4xl font-bold', getRRColor(validationResult.rrPotential))}>
                                1:{validationResult.rrPotential.toFixed(1)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 bg-background-secondary rounded-lg">
                                <p className="text-sm text-gray-400 mb-1">AI Feedback</p>
                                <p className="text-gray-200">{validationResult.feedback}</p>
                            </div>

                            {validationResult.rrPotential < 2 && (
                                <div className="alert-warning">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Low R:R Potential</p>
                                        <p className="text-sm mt-1">
                                            This AOI may not provide sufficient reward-to-risk ratio. Consider adjusting your level.
                                        </p>
                                    </div>
                                </div>
                            )}

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

                            {validationResult.valid && validationResult.rrPotential >= 2 && (
                                <div className="alert-success">
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>AOI validated! Good R:R potential for this level.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TradingView Chart Placeholder */}
                <div className="card bg-background-secondary">
                    <div className="flex items-center justify-center h-96 text-gray-500">
                        <div className="text-center">
                            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">TradingView Chart with Drawing Tools</p>
                            <p className="text-sm mt-2">Mark your AOI with rectangles or horizontal rays</p>
                            <p className="text-xs mt-1 text-gray-600">
                                Integration ready for TradingView Advanced Charts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !watchedType}
                        className={isSubmitting || !watchedType ? 'btn-disabled' : 'btn-primary'}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Validating AOI...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Validate AOI
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
