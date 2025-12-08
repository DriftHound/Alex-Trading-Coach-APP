'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';
import { getAlexTimeStatus } from '@/lib/utils/alexTime';
import { cn } from '@/lib/utils/cn';

const FX_PAIRS = [
    'EURUSD',
    'GBPUSD',
    'USDJPY',
    'AUDUSD',
    'USDCAD',
    'USDCHF',
    'NZDUSD',
    'EURGBP',
    'EURJPY',
    'GBPJPY',
    'AUDJPY',
    'AUDCHF',
    'AUDNZD',
    'EURAUD',
    'EURCHF',
];

const step1Schema = z.object({
    pair: z.string().min(1, 'Please select a currency pair'),
});

type Step1FormData = z.infer<typeof step1Schema>;

export default function Step1MarketSession() {
    const { step1Data, setStep1Data, nextStep } = useWorkflowStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sessionTime] = useState(getAlexTimeStatus());

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Step1FormData>({
        resolver: zodResolver(step1Schema),
        defaultValues: step1Data || undefined,
    });

    const onSubmit = async (data: Step1FormData) => {
        setIsSubmitting(true);

        try {
            const sessionData = {
                pair: data.pair,
                timestamp: new Date().toISOString(),
                is_alex_time: sessionTime.isAlexTime,
            };

            // Log session with Manus API
            await workflowAPI.logMarketSession(sessionData);

            // Save to store and proceed
            setStep1Data(sessionData);
            nextStep();
        } catch (error) {
            console.error('Failed to log session:', error);
            alert('Failed to log session. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">Market Bias & Environment</h2>
            <p className="text-gray-400 mb-6">
                Select your currency pair and verify you're trading during optimal hours
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Trading Session Time Widget */}
                <div className={cn(
                    'p-6 rounded-lg border-2',
                    sessionTime.isAlexTime
                        ? 'bg-success/10 border-success'
                        : 'bg-danger/10 border-danger'
                )}>
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className={cn(
                            'w-6 h-6',
                            sessionTime.isAlexTime ? 'text-success' : 'text-danger'
                        )} />
                        <h3 className="text-lg font-semibold">
                            {sessionTime.isAlexTime ? '✓ Optimal Trading Hours Active' : '⚠️ Outside Optimal Trading Hours'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Current Time (EST)</p>
                            <p className="font-mono font-semibold text-lg">
                                {sessionTime.currentTimeEST}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Optimal Session Window</p>
                            <p className="font-semibold">
                                {sessionTime.sessionStart} - {sessionTime.sessionEnd}
                            </p>
                        </div>
                    </div>

                    {sessionTime.isAlexTime ? (
                        <div className="mt-3 flex items-center gap-2 text-success">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">
                                {sessionTime.timeUntilEnd} remaining in London session
                            </span>
                        </div>
                    ) : (
                        <div className="mt-3 text-danger">
                            <p className="font-medium">
                                ⚠️ Trading outside optimal hours reduces edge
                            </p>
                            <p className="text-sm mt-1">
                                Next session starts in {sessionTime.timeUntilStart}
                            </p>
                        </div>
                    )}
                </div>

                {/* Currency Pair Selection */}
                <div>
                    <label htmlFor="pair" className="label">
                        Select Currency Pair
                    </label>
                    <select
                        id="pair"
                        className="input"
                        {...register('pair')}
                    >
                        <option value="">-- Choose a pair --</option>
                        {FX_PAIRS.map((pair) => (
                            <option key={pair} value={pair}>
                                {pair}
                            </option>
                        ))}
                    </select>
                    {errors.pair && (
                        <p className="text-danger text-sm mt-1">{errors.pair.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'btn-disabled' : 'btn-primary'}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Logging session...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Continue to Trend Analysis
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
