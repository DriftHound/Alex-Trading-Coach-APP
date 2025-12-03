import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkflowState } from '@/types/api';

interface WorkflowStore extends WorkflowState {
    // Actions
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    setStep1Data: (data: WorkflowState['step1Data']) => void;
    setStep2Data: (data: WorkflowState['step2Data']) => void;
    setStep2Validation: (data: WorkflowState['step2Validation']) => void;
    setStep3Data: (data: WorkflowState['step3Data']) => void;
    setStep3Validation: (data: WorkflowState['step3Validation']) => void;
    setStep4Data: (data: WorkflowState['step4Data']) => void;
    setStep4Validation: (data: WorkflowState['step4Validation']) => void;
    setStep5Data: (data: WorkflowState['step5Data']) => void;
    setStep5Validation: (data: WorkflowState['step5Validation']) => void;
    setStep6Data: (data: WorkflowState['step6Data']) => void;
    setStep6Validation: (data: WorkflowState['step6Validation']) => void;
    resetWorkflow: () => void;
    saveDraft: () => void;
    loadDraft: (draftId: string) => void;
}

const initialState: WorkflowState = {
    currentStep: 1,
    step1Data: null,
    step2Data: null,
    step2Validation: null,
    step3Data: null,
    step3Validation: null,
    step4Data: null,
    step4Validation: null,
    step5Data: null,
    step5Validation: null,
    step6Data: null,
    step6Validation: null,
};

export const useWorkflowStore = create<WorkflowStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            setCurrentStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const currentStep = get().currentStep;
                if (currentStep < 6) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            previousStep: () => {
                const currentStep = get().currentStep;
                if (currentStep > 1) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            setStep1Data: (data) => set({ step1Data: data }),
            setStep2Data: (data) => set({ step2Data: data }),
            setStep2Validation: (data) => set({ step2Validation: data }),
            setStep3Data: (data) => set({ step3Data: data }),
            setStep3Validation: (data) => set({ step3Validation: data }),
            setStep4Data: (data) => set({ step4Data: data }),
            setStep4Validation: (data) => set({ step4Validation: data }),
            setStep5Data: (data) => set({ step5Data: data }),
            setStep5Validation: (data) => set({ step5Validation: data }),
            setStep6Data: (data) => set({ step6Data: data }),
            setStep6Validation: (data) => set({ step6Validation: data }),

            resetWorkflow: () => set(initialState),

            saveDraft: () => {
                const draftId = `draft_${Date.now()}`;
                set({ draftId });
                // In a real app, this would save to backend
                console.log('Draft saved:', draftId);
            },

            loadDraft: (draftId) => {
                // In a real app, this would load from backend
                console.log('Loading draft:', draftId);
            },
        }),
        {
            name: 'workflow-storage',
            partialize: (state) => ({
                // Only persist workflow data, not the current step
                step1Data: state.step1Data,
                step2Data: state.step2Data,
                step2Validation: state.step2Validation,
                step3Data: state.step3Data,
                step3Validation: state.step3Validation,
                step4Data: state.step4Data,
                step4Validation: state.step4Validation,
                step5Data: state.step5Data,
                step5Validation: state.step5Validation,
                step6Data: state.step6Data,
                step6Validation: state.step6Validation,
                draftId: state.draftId,
            }),
        }
    )
);
