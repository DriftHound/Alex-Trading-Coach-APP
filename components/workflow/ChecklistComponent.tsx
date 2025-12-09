'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { getSessionTimeStatus } from '@/lib/utils/sessionTime';
import { cn } from '@/lib/utils/cn';

interface ChecklistItem {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    required: boolean;
}

interface ChecklistComponentProps {
    onComplete: () => void;
}

export default function ChecklistComponent({ onComplete }: ChecklistComponentProps) {
    const {
        step1Data,
        step2Data,
        step3Data,
        step4Data,
        step4Validation,
        step5Data,
        step5Validation,
    } = useWorkflowStore();

    const sessionTime = getSessionTimeStatus();

    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
            id: 'optimal_session',
            label: 'Trade is during Optimal Trading Hours (1:00-10:30 AM EST)',
            description: 'London session trading hours',
            checked: sessionTime.isOptimalSession,
            required: true,
        },
        {
            id: 'confluence',
            label: 'Confluence score ≥ 60',
            description: 'Pattern validation passed',
            checked: (step4Validation?.confluence_score || 0) >= 60,
            required: true,
        },
        {
            id: 'rr_ratio',
            label: 'R:R ratio ≥ 1:2',
            description: 'Minimum risk-reward requirement',
            checked: step5Validation?.rr_valid || false,
            required: true,
        },
        {
            id: 'screenshot',
            label: 'Pattern screenshot uploaded',
            description: 'Chart evidence documented',
            checked: !!step4Data?.screenshot_url,
            required: false,
        },
        {
            id: 'trend_analysis',
            label: 'Multi-timeframe trend analysis completed',
            description: 'Weekly, Daily, and 4H trends identified',
            checked: !!step2Data,
            required: true,
        },
        {
            id: 'aoi_marked',
            label: 'Area of Interest marked',
            description: 'Entry zone identified',
            checked: !!step3Data,
            required: true,
        },
    ]);

    const allRequiredChecked = checklist
        .filter((item) => item.required)
        .every((item) => item.checked);

    const handleCheckboxChange = (id: string) => {
        setChecklist((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const handleProceed = () => {
        if (allRequiredChecked) {
            onComplete();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-2">Final Trade Checklist</h3>
                <p className="text-gray-400">
                    Verify all requirements before logging this trade
                </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
                {checklist.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            'p-4 rounded-lg border-2 transition-all',
                            item.checked
                                ? 'border-success bg-success/5'
                                : item.required
                                    ? 'border-danger bg-danger/5'
                                    : 'border-gray-700 bg-background-secondary'
                        )}
                    >
                        <label className="flex items-start gap-3 cursor-pointer">
                            <div className="flex-shrink-0 mt-1">
                                {item.checked ? (
                                    <CheckCircle className="w-6 h-6 text-success" />
                                ) : item.required ? (
                                    <XCircle className="w-6 h-6 text-danger" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{item.label}</p>
                                    {item.required && (
                                        <span className="text-xs px-2 py-0.5 bg-danger/20 text-danger rounded">
                                            REQUIRED
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            </div>

                            {/* Only allow manual toggle for non-auto-checked items */}
                            {!['optimal_session', 'confluence', 'rr_ratio', 'screenshot', 'trend_analysis', 'aoi_marked'].includes(item.id) && (
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="w-5 h-5 rounded border-gray-600 bg-background-secondary text-primary-600 focus:ring-primary-500"
                                />
                            )}
                        </label>
                    </div>
                ))}
            </div>

            {/* Validation Summary */}
            <div className={cn(
                'p-6 rounded-lg border-2',
                allRequiredChecked
                    ? 'bg-success/10 border-success'
                    : 'bg-danger/10 border-danger'
            )}>
                {allRequiredChecked ? (
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-success text-lg">All Requirements Met!</p>
                            <p className="text-sm text-gray-300 mt-1">
                                This trade setup meets all of the required criteria. You may proceed to journal entry.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-danger flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-danger text-lg">Requirements Not Met</p>
                            <p className="text-sm text-gray-300 mt-1">
                                You must complete all required items before proceeding. Missing requirements are marked in red.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Proceed Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleProceed}
                    disabled={!allRequiredChecked}
                    className={allRequiredChecked ? 'btn-success' : 'btn-disabled'}
                >
                    {allRequiredChecked ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Proceed to Journal Entry
                        </span>
                    ) : (
                        <span>Complete Required Items First</span>
                    )}
                </button>
            </div>
        </div>
    );
}
