'use client';

import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
    return (
        <div className="bg-warning/10 border-l-4 border-warning p-4 mb-6">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold text-warning mb-1">
                        EDUCATIONAL USE ONLY
                    </p>
                    <p className="text-gray-300">
                        This checklist is for your personal trading plan. It does not provide financial advice
                        and does not execute trades. You are solely responsible for your trading decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
