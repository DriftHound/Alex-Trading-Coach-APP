'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { workflowAPI } from '@/lib/api/workflow';

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
                is_alex_time: true, // Keep for API compatibility, always true now
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
                Select the currency pair you're analyzing for your trading setup
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Info Card */}
                <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                    <p className="text-sm text-gray-300">
                        <strong>Step 1 of 5:</strong> Start by selecting the market you're planning to trade.
                        The following steps will help you document your complete pre-trade analysis.
                    </p>
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
                    <p className="text-xs text-gray-500 mt-2">
                        Choose the market that meets your trading plan criteria
                    </p>
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
