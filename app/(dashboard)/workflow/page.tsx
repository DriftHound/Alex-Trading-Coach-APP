'use client';

import { useWorkflowStore } from '@/store/workflowStore';
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Step1MarketSession from '@/components/workflow/Step1MarketSession';
import Step2TrendAnalysis from '@/components/workflow/Step2TrendAnalysis';
import Step3AOIMapping from '@/components/workflow/Step3AOIMapping';
import Step4PatternValidation from '@/components/workflow/Step4PatternValidation';
import Step5RiskCalculation from '@/components/workflow/Step5RiskCalculation';
import Step6ReviewJournal from '@/components/workflow/Step6ReviewJournal';
import UltraStepIcon from '@/components/icons/UltraStepIcon';

const steps = [
    { number: 1, title: 'Market & Session', component: Step1MarketSession },
    { number: 2, title: 'Trend Analysis', component: Step2TrendAnalysis },
    { number: 3, title: 'AOI Mapping', component: Step3AOIMapping },
    { number: 4, title: 'Pattern & Signal', component: Step4PatternValidation },
    { number: 5, title: 'Risk & R:R', component: Step5RiskCalculation },
    { number: 6, title: 'Review & Journal', component: Step6ReviewJournal },
];

export default function WorkflowPage() {
    const router = useRouter();
    const { currentStep, previousStep, resetWorkflow, saveDraft } = useWorkflowStore();

    const CurrentStepComponent = steps[currentStep - 1].component;

    const handleAbandon = () => {
        if (confirm('Are you sure you want to abandon this trade? All progress will be lost.')) {
            resetWorkflow();
            router.push('/dashboard');
        }
    };

    const handleSaveDraft = () => {
        saveDraft();
        alert('Draft saved! You can resume this trade later.');
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Trade Validation Workflow</h1>
                        <p className="text-gray-400">
                            Step {currentStep} of 6: {steps[currentStep - 1].title}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveDraft}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Draft
                        </button>
                        <button
                            onClick={handleAbandon}
                            className="btn-danger flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Abandon
                        </button>
                    </div>
                </div>

                {/* Progress bar with Icons */}
                <div className="relative">
                    <div className="flex justify-between mb-2">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="flex flex-col items-center"
                                style={{ width: `${100 / steps.length}%` }}
                            >
                                <div className={`transition-all duration-300 ${step.number < currentStep
                                        ? 'opacity-60 grayscale'
                                        : step.number === currentStep
                                            ? 'scale-110'
                                            : 'opacity-40 grayscale'
                                    }`}>
                                    <UltraStepIcon
                                        step={step.number as 1 | 2 | 3 | 4 | 5 | 6}
                                        size={50}
                                        active={step.number === currentStep}
                                    />
                                </div>
                                <span className={`text-xs mt-2 text-center transition-colors ${step.number === currentStep
                                        ? 'text-primary-400 font-semibold'
                                        : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-4">
                        <div
                            className="h-full bg-gradient-to-r from-primary-600 to-success transition-all duration-300"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Current Step Content */}
            <div className="card mb-6">
                <CurrentStepComponent />
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={previousStep}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ? 'btn-disabled' : 'btn-secondary'}
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Previous
                </button>

                {/* Next button is controlled by each step component */}
            </div>
        </div>
    );
}
