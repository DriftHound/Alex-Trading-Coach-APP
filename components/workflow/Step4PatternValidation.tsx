'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { ChevronRight, Upload, AlertTriangle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI, fileAPI } from '@/lib/api/workflow';
import { cn } from '@/lib/utils/cn';
import type { PatternValidationResponse } from '@/types/api';

const step4Schema = z.object({
    pattern_type: z.enum(['head_and_shoulders', 'engulfing', 'other']),
    left_shoulder: z.string().optional(),
    head: z.string().optional(),
    right_shoulder: z.string().optional(),
    body_size: z.string().optional(),
    wick_ratio: z.string().optional(),
    confluence_factors: z.array(z.string()).default([]),
});

type Step4FormData = z.infer<typeof step4Schema>;

export default function Step4PatternValidation() {
    const { step1Data, step4Data, setStep4Data, setStep4Validation, nextStep } = useWorkflowStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [screenshotUrl, setScreenshotUrl] = useState<string | null>(step4Data?.screenshot_url || null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [validationResult, setValidationResult] = useState<PatternValidationResponse | null>(
        step4Data ? {
            confluence_score: 0,
            valid: false,
            final_approval: false,
            warnings: []
        } : null
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Step4FormData>({
        resolver: zodResolver(step4Schema),
        defaultValues: step4Data || { confluence_factors: [] },
    });

    const patternType = watch('pattern_type');

    // File upload with react-dropzone
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploadedFile(file);
        setIsUploading(true);

        try {
            // Upload to Manus API
            const result = await fileAPI.uploadScreenshot(file, step1Data?.pair || '');
            setScreenshotUrl(result.screenshot_url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload screenshot. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [step1Data]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        multiple: false,
    });

    const onSubmit = async (data: Step4FormData) => {
        setIsSubmitting(true);

        try {
            const patternData = {
                pair: step1Data?.pair || '',
                pattern_type: data.pattern_type,
                pattern_details: {
                    ...(data.pattern_type === 'head_and_shoulders' && {
                        left_shoulder: parseFloat(data.left_shoulder || '0'),
                        head: parseFloat(data.head || '0'),
                        right_shoulder: parseFloat(data.right_shoulder || '0'),
                    }),
                    ...(data.pattern_type === 'engulfing' && {
                        body_size: parseFloat(data.body_size || '0'),
                        wick_ratio: parseFloat(data.wick_ratio || '0'),
                    }),
                },
                screenshot_url: screenshotUrl || undefined,
                confluence_factors: data.confluence_factors,
            };

            // Validate pattern with Manus API
            const result = await workflowAPI.validatePattern(patternData);

            setValidationResult(result);
            setStep4Data(patternData);
            setStep4Validation(result);

            // Check if confluence score is acceptable
            if (result.confluence_score < 60) {
                // Don't proceed automatically - show warning
                return;
            }

            if (result.final_approval) {
                nextStep();
            }
        } catch (error) {
            console.error('Failed to validate pattern:', error);
            alert('Failed to validate pattern. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getConfluenceColor = (score: number) => {
        if (score >= 80) return 'text-success';
        if (score >= 60) return 'text-warning';
        return 'text-danger';
    };

    const getConfluenceBgColor = (score: number) => {
        if (score >= 80) return 'bg-success/10 border-success';
        if (score >= 60) return 'bg-warning/10 border-warning';
        return 'bg-danger/10 border-danger';
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Pattern & Signal Validation</h2>
            <p className="text-gray-400 mb-6">
                Define your pattern and upload chart evidence for confluence validation
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Pattern Type Selection */}
                <div>
                    <label htmlFor="pattern_type" className="label">
                        Pattern Type
                    </label>
                    <select
                        id="pattern_type"
                        className="input"
                        {...register('pattern_type')}
                    >
                        <option value="">-- Select pattern --</option>
                        <option value="head_and_shoulders">Head & Shoulders</option>
                        <option value="engulfing">Engulfing Candle</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.pattern_type && (
                        <p className="text-danger text-sm mt-1">{errors.pattern_type.message}</p>
                    )}
                </div>

                {/* Conditional Pattern Details */}
                {patternType === 'head_and_shoulders' && (
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="left_shoulder" className="label">
                                Left Shoulder Price
                            </label>
                            <input
                                id="left_shoulder"
                                type="number"
                                step="0.00001"
                                className="input"
                                placeholder="1.08500"
                                {...register('left_shoulder')}
                            />
                        </div>
                        <div>
                            <label htmlFor="head" className="label">
                                Head Price
                            </label>
                            <input
                                id="head"
                                type="number"
                                step="0.00001"
                                className="input"
                                placeholder="1.09000"
                                {...register('head')}
                            />
                        </div>
                        <div>
                            <label htmlFor="right_shoulder" className="label">
                                Right Shoulder Price
                            </label>
                            <input
                                id="right_shoulder"
                                type="number"
                                step="0.00001"
                                className="input"
                                placeholder="1.08600"
                                {...register('right_shoulder')}
                            />
                        </div>
                    </div>
                )}

                {patternType === 'engulfing' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="body_size" className="label">
                                Body Size (pips)
                            </label>
                            <input
                                id="body_size"
                                type="number"
                                step="0.1"
                                className="input"
                                placeholder="25.5"
                                {...register('body_size')}
                            />
                        </div>
                        <div>
                            <label htmlFor="wick_ratio" className="label">
                                Wick Ratio
                            </label>
                            <input
                                id="wick_ratio"
                                type="number"
                                step="0.1"
                                className="input"
                                placeholder="0.3"
                                {...register('wick_ratio')}
                            />
                        </div>
                    </div>
                )}

                {/* Screenshot Upload - Phase 2 Feature */}
                <div>
                    <label className="label mb-3">
                        TradingView Screenshot Evidence
                    </label>

                    <div
                        {...getRootProps()}
                        className={cn(
                            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                            isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-gray-600 hover:border-gray-500',
                            screenshotUrl && 'border-success bg-success/5'
                        )}
                    >
                        <input {...getInputProps()} />

                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin text-4xl">⏳</div>
                                <p className="text-gray-400">Uploading screenshot...</p>
                            </div>
                        ) : screenshotUrl ? (
                            <div className="flex flex-col items-center gap-3">
                                <CheckCircle className="w-12 h-12 text-success" />
                                <p className="text-success font-medium">Screenshot uploaded successfully!</p>
                                {uploadedFile && (
                                    <p className="text-sm text-gray-400">{uploadedFile.name}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Click or drag to replace
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Upload className="w-12 h-12 text-gray-400" />
                                <div>
                                    <p className="text-gray-300 font-medium">
                                        {isDragActive ? 'Drop screenshot here' : 'Drag & drop screenshot here'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        or click to browse (PNG, JPG, WEBP)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Confluence Factors Checklist */}
                <div>
                    <label className="label mb-3">Confluence Factors (Optional)</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'fibonacci_618', label: 'Fibonacci 61.8%' },
                            { value: 'fibonacci_786', label: 'Fibonacci 78.6%' },
                            { value: 'round_number', label: 'Round Number' },
                            { value: 'trendline', label: 'Trendline Touch' },
                            { value: 'volume_spike', label: 'Volume Spike' },
                            { value: 'prior_structure', label: 'Prior Structure' },
                        ].map((factor) => (
                            <label key={factor.value} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={factor.value}
                                    {...register('confluence_factors')}
                                    className="w-4 h-4 rounded border-gray-600 bg-background-secondary text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                                />
                                <span className="text-sm text-gray-300">{factor.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Validation Result Display */}
                {validationResult && (
                    <div className={cn(
                        'p-6 rounded-lg border-2',
                        getConfluenceBgColor(validationResult.confluence_score)
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Confluence Score</h3>
                            <div className={cn(
                                'text-4xl font-bold',
                                getConfluenceColor(validationResult.confluence_score)
                            )}>
                                {validationResult.confluence_score}
                            </div>
                        </div>

                        {validationResult.confluence_score < 60 && (
                            <div className="alert-danger">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">⚠️ STAND DOWN - Not an Alex Trade</p>
                                    <p className="text-sm mt-1">
                                        Confluence score below 60. This setup does not meet Alex's criteria.
                                    </p>
                                </div>
                            </div>
                        )}

                        {validationResult.warnings.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {validationResult.warnings.map((warning, idx) => (
                                    <p key={idx} className="text-sm text-warning flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        {warning}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !patternType}
                        className={isSubmitting || !patternType ? 'btn-disabled' : 'btn-primary'}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Validating pattern...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Validate Pattern
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </div>

                {validationResult && validationResult.confluence_score >= 60 && validationResult.final_approval && (
                    <div className="alert-success">
                        <CheckCircle className="w-5 h-5" />
                        <p>Pattern validated! Click "Next" to proceed to risk calculation.</p>
                    </div>
                )}
            </form>
        </div>
    );
}
