'use client';

import { useState } from 'react';

interface StepIconProps {
    step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    size?: number;
    active?: boolean;
    className?: string;
}

export default function StepIcon({ step, size = 80, active = false, className = '' }: StepIconProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        if (step === 5 || step === 6) {
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 800);
        }
    };

    const renderIcon = () => {
        switch (step) {
            case 1: // Market Bias
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect className="bias-candle" x="20" y="60" width="8" height="20" fill="#64748B" rx="1" />
                        <rect className="bias-candle" x="35" y="50" width="8" height="25" fill="#64748B" rx="1" />
                        <rect className="bias-candle" x="50" y="55" width="8" height="15" fill="#10b981" rx="1" />
                        <rect className="bias-candle" x="65" y="40" width="8" height="25" fill="#10b981" rx="1" />
                        <path className="bias-arrow" d="M20 80 L50 65 L60 70 L90 30" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path className="bias-arrow" d="M90 30 L75 30 M90 30 L90 45" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );

            case 2: // Price Zones
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect className="zone-bar" x="10" y="20" width="80" height="4" fill="#64748B" rx="2" />
                        <rect className="zone-bar" x="10" y="80" width="80" height="4" fill="#64748B" rx="2" />
                        <rect className="zone-candle" x="30" y="30" width="10" height="20" fill="#10b981" rx="1" />
                        <rect className="zone-candle-test" x="45" y="50" width="10" height="30" fill="#10b981" rx="1" />
                        <rect className="zone-candle" x="60" y="40" width="10" height="20" fill="#10b981" rx="1" />
                    </svg>
                );

            case 3: // Setup Criteria
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <g className="scope-group">
                            <circle cx="50" cy="50" r="35" stroke="#10b981" strokeWidth="2" fill="none" />
                            <line x1="10" y1="50" x2="30" y2="50" stroke="#10b981" strokeWidth="2" />
                            <line x1="70" y1="50" x2="90" y2="50" stroke="#10b981" strokeWidth="2" />
                            <line x1="50" y1="10" x2="50" y2="30" stroke="#10b981" strokeWidth="2" />
                            <line x1="50" y1="70" x2="50" y2="90" stroke="#10b981" strokeWidth="2" />
                        </g>
                        <g className="scope-center">
                            <rect x="45" y="40" width="10" height="20" fill="#10b981" rx="1" />
                        </g>
                    </svg>
                );

            case 4: // Risk & Size
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon points="50,80 40,90 60,90" fill="#64748B" />
                        <g className="balance-beam">
                            <rect x="10" y="55" width="80" height="4" fill="#64748B" rx="2" />
                            <rect x="15" y="35" width="20" height="20" fill="#64748B" rx="2" opacity="0.6" />
                            <rect className="balance-reward" x="65" y="15" width="20" height="40" fill="#10b981" rx="2" />
                        </g>
                    </svg>
                );

            case 5: // Execution (Lock)
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path className="lock-shackle" d="M30 40 V 25 A 20 20 0 0 1 70 25 V 40" stroke="#64748B" strokeWidth="6" fill="none" strokeLinecap="round" />
                        <rect x="20" y="40" width="60" height="50" fill="#64748B" rx="4" />
                        <path className="lock-check" d="M35 65 L 45 75 L 65 55" stroke="#10b981" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );

            case 6: // Completed
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="#1E293B" />
                        <path className="big-check-path" d="M30 50 L 45 65 L 75 35" stroke="#10b981" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );

            case 7: // Warning
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full warning-group">
                        <path d="M50 15 L 85 80 L 15 80 Z" stroke="#10b981" strokeWidth="4" fill="none" strokeLinejoin="round" />
                        <rect x="48" y="35" width="4" height="25" fill="#10b981" rx="2" />
                        <circle cx="50" cy="70" r="3" fill="#10b981" />
                    </svg>
                );

            case 8: // Journal
                return (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="48" y="20" width="4" height="60" fill="#10b981" />
                        <g className="book-page-left">
                            <rect x="18" y="20" width="30" height="60" fill="#64748B" opacity="0.5" />
                            <line className="book-content" x1="22" y1="30" x2="44" y2="30" stroke="#10b981" strokeWidth="2" />
                            <line className="book-content" x1="22" y1="40" x2="44" y2="40" stroke="#10b981" strokeWidth="2" />
                        </g>
                        <g className="book-page-right">
                            <rect x="52" y="20" width="30" height="60" fill="#64748B" opacity="0.5" />
                            <circle className="book-content" cx="67" cy="40" r="10" stroke="#10b981" strokeWidth="2" fill="none" />
                        </g>
                    </svg>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`step-icon ${isHovered ? 'hovered' : ''} ${isClicked || active ? 'active' : ''} ${className}`}
            style={{ width: size, height: size }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {renderIcon()}

            <style jsx>{`
                .step-icon {
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .step-icon:hover {
                    transform: scale(1.05);
                }

                /* Market Bias Animations */
                .bias-candle {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .bias-arrow {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    transition: stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.35, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .step-icon.hovered .bias-candle:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.05s; }
                .step-icon.hovered .bias-candle:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.1s; }
                .step-icon.hovered .bias-candle:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 0.15s; }
                .step-icon.hovered .bias-candle:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 0.2s; }
                .step-icon.hovered .bias-arrow {
                    stroke-dashoffset: 0;
                    transform: translate(2px, -2px);
                    transition-delay: 0.25s;
                }

                /* Price Zones Animations */
                .zone-bar { opacity: 0.3; transition: opacity 0.4s ease; }
                .zone-candle { opacity: 0; transition: opacity 0.4s ease; }
                .zone-candle-test {
                    opacity: 0;
                    transform: translateY(-8px);
                    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .step-icon.hovered .zone-bar { opacity: 1; }
                .step-icon.hovered .zone-candle { opacity: 1; }
                .step-icon.hovered .zone-candle-test {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Setup Criteria Animations */
                .scope-group {
                    transform-origin: center;
                    transform: scale(1.15) rotate(-30deg);
                    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .scope-center {
                    opacity: 0;
                    transition: opacity 0.1s linear;
                }

                .step-icon.hovered .scope-group {
                    transform: scale(1) rotate(0deg);
                }

                .step-icon.hovered .scope-center {
                    opacity: 1;
                    transition-delay: 0.4s;
                }

                /* Risk & Size Animations */
                .balance-beam {
                    transform-origin: 50% 50%;
                    transform: rotate(-15deg);
                    transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
                }

                .balance-reward {
                    transform-origin: bottom center;
                    transform: scaleY(0.7);
                    transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
                }

                .step-icon.hovered .balance-beam { transform: rotate(0deg); }
                .step-icon.hovered .balance-reward { transform: scaleY(1); }

                /* Execution Lock Animations */
                .lock-shackle {
                    transform: translateY(-12px);
                    transition: transform 0.3s cubic-bezier(0.5, 0, 0.75, 0);
                }

                .lock-check {
                    transform-origin: center;
                    transform: scale(0);
                    opacity: 0;
                    transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.1s;
                }

                .step-icon.active .lock-shackle { transform: translateY(0); }
                .step-icon.active .lock-check {
                    transform: scale(1);
                    opacity: 1;
                    transition-delay: 0.3s;
                }

                /* Completed Check Animations */
                .big-check-path {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    transition: stroke-dashoffset 0.5s ease-out;
                }

                .step-icon.active .big-check-path {
                    stroke-dashoffset: 0;
                }

                /* Warning Breathing Animation */
                .warning-group {
                    transform-origin: center;
                    animation: breathe 3s ease-in-out infinite;
                }

                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.85; }
                }

                /* Journal Book Animations */
                .book-page-left {
                    transform-origin: 50% 50%;
                    transform: perspective(500px) rotateY(-30deg) translateX(5px);
                    transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
                }

                .book-page-right {
                    transform-origin: 50% 50%;
                    transform: perspective(500px) rotateY(30deg) translateX(-5px);
                    transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
                }

                .book-content {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .step-icon.hovered .book-page-left { transform: perspective(500px) rotateY(0deg) translateX(0); }
                .step-icon.hovered .book-page-right { transform: perspective(500px) rotateY(0deg) translateX(0); }
                .step-icon.hovered .book-content { opacity: 1; transition-delay: 0.3s; }
            `}</style>
        </div>
    );
}
